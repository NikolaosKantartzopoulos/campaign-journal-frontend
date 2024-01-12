import { Box, Button, TextField } from "@mui/material";
import { FlexBox } from "../CustomComponents/FlexBox";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MouseEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { toastMessage } from "../CustomComponents/Toastify/Toast";
import LoadingSpinner from "../CustomComponents/LoadingSpinner";
import SideBySideBox from "./SideBySideBox";
import {
  heroFactionTypes,
  userMinimumInfo,
} from "@/utilities/types/heroFactionTypes";
import CoolTitleBox from "../CustomComponents/CoolTitleBox";
import { isUserGameMaster } from "@/utilities/helperFn/isUserGameMaster";

const HeroesAndFactions = () => {
  const { data: session } = useSession();

  const user = session?.user;
  const queryClient = useQueryClient();

  const { data: playersSubscribedToWorld } = useQuery<userMinimumInfo[]>({
    queryKey: [
      "playersSubscribedToWorld",
      { user_id: user?.user_id },
      { world_id: user?.selectedWorld?.location_id },
    ],
    queryFn: async () => {
      try {
        const { data } = await axios(
          "/api/worlds/get-players-subscribed-to-world"
        );

        return data;
      } catch (err) {}
    },
    enabled: !!user,
  });

  const { data: worldsHeroFactions } = useQuery<heroFactionTypes[]>({
    queryKey: [
      "worldsHeroFactions",
      { user_id: user?.user_id },
      { world_id: user?.selectedWorld?.location_id },
    ],
    queryFn: async () => {
      try {
        const { data } = await axios("/api/worlds/get-worlds-hero-factions");
        return data.worldsHeroFactions;
      } catch (err) {}
    },
    enabled: !!user,
  });

  const [factionInputValue, setFactionInputValue] = useState<string>("");
  const [newUsername, setNewUsername] = useState("");
  const [selectedFactionName, setSelectedFactionName] = useState<string | null>(
    null
  );

  async function handleCreateHeroFaction() {
    if (!isUserGameMaster(session)) {
      toastMessage("This is not your world", "error");
      return;
    }
    try {
      const { data } = await axios.post("/api/worlds/create-hero-faction/", {
        newFactionName: factionInputValue,
      });
      const { message } = data;
      toastMessage(message, "success");
      queryClient.invalidateQueries({
        queryKey: ["worldsHeroFactions"],
      });
      setFactionInputValue("");
    } catch (err: any) {
      toastMessage(err.message, "error");
    }
  }

  async function handleDeleteHeroFaction() {
    if (!isUserGameMaster(session)) {
      toastMessage("This is not your world", "error");
      return;
    }
    const selectedFactionEntry = worldsHeroFactions?.find(
      (entry) => entry.faction.faction_name === factionInputValue
    );
    if (!selectedFactionEntry) {
      toastMessage("No such faction exists", "error");
      return;
    }
    try {
      const { data } = await axios.post("/api/worlds/delete-hero-faction/", {
        factionToBeDeleted: selectedFactionEntry.faction,
      });
      const { message } = data;
      toastMessage(message, "success");
      queryClient.invalidateQueries({
        queryKey: ["worldsHeroFactions"],
      });
      setFactionInputValue("");
    } catch (err: any) {
      toastMessage(err.message, "error");
    }
  }

  const handleAddPlayerToWorld = async () => {
    if (!isUserGameMaster(session)) {
      toastMessage("This is not your world", "error");
      return;
    }
    if (
      playersSubscribedToWorld
        ?.map((player) => player.user_name)
        .includes(newUsername)
    ) {
      toastMessage("User already invited", "error");
      setNewUsername("");
      return;
    }
    try {
      const { data } = await axios.post(`/api/worlds/add-user`, {
        user_name: newUsername,
      });
      toastMessage(data.message, "success");
      setNewUsername("");
      queryClient.invalidateQueries({
        queryKey: ["playersSubscribedToWorld"],
      });
    } catch (err: any) {
      if (err.response.status === 406)
        toastMessage(err?.response?.data?.message, "error");
    }
  };

  async function addUserToHeroFaction(e: MouseEvent, user_id: string) {
    if (!isUserGameMaster(session)) {
      toastMessage("This is not your world", "error");
      return;
    }
    if (!worldsHeroFactions) return;
    if (!selectedFactionName) {
      toastMessage("Select a User Faction", "warning");
      return;
    }
    const selectedFactionEntry = worldsHeroFactions?.find(
      (entry) => entry.faction.faction_name === selectedFactionName
    );

    try {
      const { data } = await axios.put(
        "/api/user-management/add-user-to-faction",
        {
          faction_id: selectedFactionEntry?.faction.faction_id,
          user_id: user_id,
        }
      );

      toastMessage(data.message, "success");
      queryClient.invalidateQueries({ queryKey: ["worldsHeroFactions"] });
    } catch (err: any) {
      toastMessage(err.message || "Error", "error");
    }
  }

  async function handleDeleteUserFromFaction(e: MouseEvent, itemId: string) {
    if (!isUserGameMaster(session)) {
      toastMessage("This is not your world", "error");
      return;
    }
    const selectedFactionEntry = worldsHeroFactions?.find(
      (entry) => entry.faction.faction_name === selectedFactionName
    ) as heroFactionTypes;

    const selectedFaction = selectedFactionEntry?.faction;

    try {
      const { data } = await axios.put(
        "/api/user-management/delete-user-from-faction",
        { faction_id: selectedFaction.faction_id, user_id: itemId }
      );
      toastMessage(data.message, "success");
      queryClient.invalidateQueries({ queryKey: ["worldsHeroFactions"] });
    } catch (err: any) {
      toastMessage(err.message, "error");
    }
  }

  async function handleRemovePlayerFromWorld() {
    if (!isUserGameMaster(session)) {
      toastMessage("This is not your world", "error");
      return;
    }
    if (!playersSubscribedToWorld) {
      return;
    }
    const userToBeDeleted = playersSubscribedToWorld?.find(
      (el) => el.user_name === newUsername.trim()
    );

    if (!userToBeDeleted) {
      toastMessage("No such user exists", "error");
      return;
    }

    try {
      const { data } = await axios.post("/api/worlds/delete-user-from-world", {
        userToBeDeleted,
      });
      toastMessage(data.message || "User deleted", "success");

      queryClient.setQueryData(["playersSubscribedToWorld"], () => {
        const newData = [...playersSubscribedToWorld].filter(
          (el) => el.user_name !== newUsername
        );
        return newData;
      });

      if (worldsHeroFactions) {
        queryClient.setQueryData(["worldsHeroFactions"], () => {
          const worldsHeroFactionCopy: heroFactionTypes[] = [
            ...worldsHeroFactions,
          ] as heroFactionTypes[];
          for (const faction of worldsHeroFactionCopy) {
            faction.usersSubscribed = [...faction.usersSubscribed].filter(
              (el) => el.user_name !== newUsername
            );
          }

          return worldsHeroFactionCopy;
        });
      }

      queryClient.invalidateQueries({
        queryKey: [
          "playersSubscribedToWorld",
          { user_id: user?.user_id },
          { world_id: user?.selectedWorld?.location_id },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "worldsHeroFactions",
          { user_id: user?.user_id },
          { world_id: user?.selectedWorld?.location_id },
        ],
      });
      setNewUsername("");
    } catch (err: any) {
      toastMessage(err.message, "error");
    }
  }

  async function handlePlayersBoxTitleClick() {}

  async function handleHeroFactionsBoxTitleClick() {}

  if (!user || !playersSubscribedToWorld || !worldsHeroFactions) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Box>
        {/* <SelectWorld /> */}

        {isUserGameMaster(session) && (
          <FlexBox
            sx={{
              my: "1rem",
              justifyContent: "center",
              alignItems: "center",
              flexFlow: "row wrap",
            }}
          >
            <FlexBox sx={{ gap: 0, alignItems: "stretch", width: "320px" }}>
              <TextField
                label="Player's Name"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddPlayerToWorld();
                  }
                }}
                size="small"
              />
              <Button
                onClick={handleAddPlayerToWorld}
                variant="outlined"
                disabled={!newUsername}
                sx={{ width: "85px" }}
              >
                Invite
              </Button>
              <Button
                onClick={handleRemovePlayerFromWorld}
                variant="outlined"
                color="error"
                disabled={!newUsername}
                sx={{ width: "85px" }}
              >
                Delete
              </Button>
            </FlexBox>

            <FlexBox sx={{ gap: 0, alignItems: "stretch", width: "320px" }}>
              <TextField
                label="Faction name"
                value={factionInputValue}
                onChange={(e) => setFactionInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateHeroFaction();
                  }
                }}
                size="small"
              />
              <Button
                onClick={handleCreateHeroFaction}
                disabled={!factionInputValue}
                variant="outlined"
                sx={{ width: "85px" }}
              >
                Create
              </Button>
              <Button
                onClick={handleDeleteHeroFaction}
                color="error"
                disabled={!factionInputValue}
                variant="outlined"
                sx={{ width: "85px" }}
              >
                Delete
              </Button>
            </FlexBox>
          </FlexBox>
        )}
        <Box
          sx={{
            my: "1rem",
            mx: "auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          <Box>
            <CoolTitleBox>Heroes</CoolTitleBox>
            <FlexBox
              sx={{
                gap: 0,
                alignItems: "stretch",
                justifyContent: "flex-start",
              }}
            >
              {playersSubscribedToWorld.length > 0 && (
                <SideBySideBox
                  visibleValue="user_name"
                  itemsArray={playersSubscribedToWorld}
                  idUsed="user_id"
                  sx={{ flexBasis: "150px" }}
                  onItemClick={addUserToHeroFaction}
                  onTitleClick={handlePlayersBoxTitleClick}
                  visibleOptions={true}
                />
              )}
            </FlexBox>
          </Box>

          <Box
            sx={{
              flex: "1 1 0",
              height: "100%",
              alignItems: "stretch",
              flexDirection: "column",
            }}
          >
            <CoolTitleBox>Factions</CoolTitleBox>
            <FlexBox
              sx={{
                flex: "1 1 0",
                alignItems: "stretch",
                flexDirection: "column",
                justifyContent: "flex-start",
                gap: "1px",
              }}
            >
              {worldsHeroFactions &&
                worldsHeroFactions.map((heroFactionAndUsersArray) => (
                  <SideBySideBox
                    key={heroFactionAndUsersArray.faction.faction_id}
                    visibleValue="user_name"
                    boxTitle={heroFactionAndUsersArray.faction.faction_name}
                    itemsArray={heroFactionAndUsersArray.usersSubscribed}
                    idUsed={"user_id"}
                    onItemClick={handleDeleteUserFromFaction}
                    onTitleClick={handleHeroFactionsBoxTitleClick}
                    visibleOptions={selectedFactionName}
                    setVisibleOptions={setSelectedFactionName}
                  />
                ))}
            </FlexBox>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default HeroesAndFactions;
