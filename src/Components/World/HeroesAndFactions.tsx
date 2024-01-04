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
  const [factionInputValue, setFactionInputValue] = useState<string>("");
  const [newUsername, setNewUsername] = useState("");

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
        console.log(data);
        return data;
      } catch (err) {
        console.log(err);
      }
    },
  });

  const { data: worldsHeroFactions } = useQuery<heroFactionTypes[]>({
    queryKey: ["worldsHeroFactions"],
    queryFn: async () => {
      try {
        const { data } = await axios("/api/worlds/get-worlds-hero-factions");
        return data.worldsHeroFactions;
      } catch (err) {
        console.log(err);
      }
    },
  });

  const createWorldHeroFactionMutation = useMutation({
    mutationFn: handleCreateHeroFaction,
    onSuccess: (data) => {
      queryClient.setQueryData(["worldsHeroFactions"], data);
    },
  });

  async function handleCreateHeroFaction() {
    console.log("handleCreateHeroFaction");
    try {
      const { data } = await axios.post("/api/heroes/create-hero-faction/", {
        newFactionName: factionInputValue,
      });
      const { createdHeroFaction, message } = data;
      toastMessage(message, "success");
      console.log(createdHeroFaction);
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
      console.log(err);
      if (err.response.status === 406)
        toastMessage(err?.response?.data?.message, "error");
    }
  };

  function handlePlayerRowClick(e: MouseEvent, itemId: string) {
    console.log(itemId);
  }

  function handleFactionUserRowClick(e: MouseEvent, itemId: string) {
    console.log(itemId);
  }
  function handlePlayersBoxTitleClick(e: MouseEvent, title: string) {
    console.log(title);
  }
  function handleHeroFactionsBoxTitleClick(e: MouseEvent, title: string) {
    console.log(title);
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
