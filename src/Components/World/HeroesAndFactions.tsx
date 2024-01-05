import { Box, Button, Divider, TextField } from "@mui/material";
import { FlexBox } from "../CustomComponents/FlexBox";
import SelectWorld from "./SelectWorld";
import { getPlayersSubscribedToWorldReturnType } from "@/services/data-fetching/getPlayers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
      session?.selectedWorld?.location_id,
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
  });

  const { data: worldsHeroFactions } = useQuery<heroFactionTypes[]>({
    queryKey: ["worldsHeroFactions"],
    queryFn: async () => {
      try {
        const { data } = await axios("/api/worlds/get-worlds-hero-factions");
        return data.worldsHeroFactions;
      } catch (err) {}
    },
  });

  const createWorldHeroFactionMutation = useMutation({
    mutationFn: handleCreateHeroFaction,
    onSuccess: (data) => {
      queryClient.setQueryData(["worldsHeroFactions"], data);
    },
  });

  const [factionInputValue, setFactionInputValue] = useState<string>();
  const [newUsername, setNewUsername] = useState("");
  const [selectedFactionName, setSelectedFactionName] = useState<string | null>(
    null
  );

  async function handleCreateHeroFaction() {
    try {
      const { data } = await axios.post("/api/heroes/create-hero-faction/", {
        newFactionName: factionInputValue,
      });
      const { createdHeroFaction, message } = data;
      toastMessage(message, "success");
      queryClient.invalidateQueries({ queryKey: ["worldsHeroFactions"] });
      return createdHeroFaction;
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

  async function handleFactionUserRowClick(
    e: MouseEvent,
    itemId: string,
    boxTitle: string
  ) {
    console.log(e, itemId, boxTitle);
  }
  async function handlePlayersBoxTitleClick(e: MouseEvent, title: string) {
    console.log(e, title);
  }
  async function handleHeroFactionsBoxTitleClick(e: MouseEvent, title: string) {
    console.log(e, title);
  }

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Divider />
      <Box>
        <SelectWorld />

        <Box sx={{ my: "1rem" }}>
          <Button variant="outlined">Hero Factions</Button>
          <Box sx={{ marginTop: 2 }}>
            <TextField
              label="Faction name"
              value={factionInputValue}
              onChange={(e) => setFactionInputValue(e.target.value)}
              size="small"
            />
            <Button
              onClick={() => createWorldHeroFactionMutation.mutate}
              disabled={!factionInputValue}
              variant="outlined"
            >
              Create Hero Faction
            </Button>
          </Box>
          <Divider sx={{ my: "1rem" }} />
        </Box>
        {user.selectedWorld && (
          <Box sx={{ my: "1rem" }}>
            <Box sx={{ my: "1rem" }}>
              <FlexBox>
                <TextField
                  label="Player's Name"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  size="small"
                />
                <Button variant="contained" onClick={handleAddPlayerToWorld}>
                  Invite
                </Button>
              </FlexBox>
            </Box>
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

              <Box sx={{ flex: "1 1 0" }}>
                {worldsHeroFactions &&
                  worldsHeroFactions.map((heroFactionAndUsersArray) => (
                    <SideBySideBox
                      key={heroFactionAndUsersArray.faction.faction_id}
                      visibleValue="user_name"
                      boxTitle={heroFactionAndUsersArray.faction.faction_name}
                      itemsArray={heroFactionAndUsersArray.usersSubscribed}
                      idUsed={"user_id"}
                      sx={{ flex: "1 1 0" }}
                      onItemClick={handleFactionUserRowClick}
                      onTitleClick={handleHeroFactionsBoxTitleClick}
                      visibleOptions={selectedFactionName}
                      setVisibleOptions={setSelectedFactionName}
                    />
                  ))}
              </Box>
            </FlexBox>
          </Box>
        )}
      </Box>
    </>
  );
};

export default HeroesAndFactions;
