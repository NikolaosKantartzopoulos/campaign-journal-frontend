import { Box, Button, Divider, TextField } from "@mui/material";
import { FlexBox } from "../CustomComponents/FlexBox";
import SelectWorld from "./SelectWorld";
import { getPlayersSubscribedToWorldReturnType } from "@/services/data-fetching/getPlayers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MouseEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { toastMessage } from "../CustomComponents/Toastify/Toast";
import LoadingSpinner from "../CustomComponents/LoadingSpinner";
import SideBySideBox from "./SideBySideBox";
import { heroFactionTypes } from "@/utilities/types/heroFactionTypes";

const HeroesAndFactions = () => {
  const { data: session } = useSession();

  const user = session?.user;
  const queryClient = useQueryClient();

  const { data: playersSubscribedToWorld } = useQuery<
    getPlayersSubscribedToWorldReturnType[]
  >({
    queryKey: [
      "playersSubscribedToWorld",
      user?.selectedWorld?.location_id,
      user?.user_id,
    ],
    queryFn: async () => {
      try {
        const { data } = await axios(
          "/api/worlds/get-players-subscribed-to-world"
        );

        return data;
      } catch (err) {}
    },
    enabled: !!session,
  });

  const { data: worldsHeroFactions } = useQuery<heroFactionTypes[]>({
    queryKey: [
      "worldsHeroFactions",
      user?.selectedWorld?.location_id,
      user?.user_id,
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
    try {
      const { data } = await axios.post("/api/heroes/create-hero-faction/", {
        newFactionName: factionInputValue,
      });
      const { message } = data;
      toastMessage(message, "success");
      queryClient.invalidateQueries({
        queryKey: ["worldsHeroFactions", user?.selectedWorld?.location_id],
      });
    } catch (err: any) {
      toastMessage(err.message, "error");
    }
  }

  const handleAddPlayerToWorld = async () => {
    try {
      const { data } = await axios.post(`/api/worlds/add-user`, {
        user_name: newUsername,
        location_id: user?.location_id,
      });
      toastMessage(data.message, "success");
      setNewUsername("");
      queryClient.invalidateQueries({
        queryKey: [
          "playersSubscribedToWorld",
          user?.selectedWorld?.location_id,
        ],
      });
    } catch (err: any) {
      if (err.response.status === 406)
        toastMessage(err?.response?.data?.message, "error");
    }
  };

  async function handlePlayerRowClick(e: MouseEvent, user_id: string) {
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

  async function handlePlayersBoxTitleClick() {}

  async function handleHeroFactionsBoxTitleClick() {}

  if (!user || !playersSubscribedToWorld || !worldsHeroFactions) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Divider />
      <Box>
        <SelectWorld />

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
          </FlexBox>

          <FlexBox sx={{ gap: 0, alignItems: "stretch", width: "320px" }}>
            <TextField
              label="Faction name"
              value={factionInputValue}
              onChange={(e) => setFactionInputValue(e.target.value)}
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
          </FlexBox>
        </FlexBox>
        <Box
          sx={{
            my: "1rem",
            mx: "auto",
          }}
        >
          <FlexBox sx={{ gap: 0, alignItems: "stretch" }}>
            {playersSubscribedToWorld && (
              <SideBySideBox
                visibleValue="user_name"
                boxTitle={"Players"}
                itemsArray={playersSubscribedToWorld}
                idUsed="user_id"
                sx={{ flexBasis: "150px" }}
                onItemClick={handlePlayerRowClick}
                onTitleClick={handlePlayersBoxTitleClick}
                visibleOptions={true}
              />
            )}

            <FlexBox
              sx={{
                flex: "1 1 0",
                height: "100%",
                alignItems: "stretch",
                flexDirection: "column",
                gap: 0,
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
                    sx={{ flex: "1 1 0", height: "100%" }}
                    onItemClick={handleDeleteUserFromFaction}
                    onTitleClick={handleHeroFactionsBoxTitleClick}
                    visibleOptions={selectedFactionName}
                    setVisibleOptions={setSelectedFactionName}
                  />
                ))}
            </FlexBox>
          </FlexBox>
        </Box>
      </Box>
    </>
  );
};

export default HeroesAndFactions;
