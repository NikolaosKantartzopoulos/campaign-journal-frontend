import { Box, Button, TextField, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import SelectWorld from "./SelectWorld";
import { useState } from "react";
import OptionsCard from "../CustomComponents/OptionsCard";
import axios from "axios";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { toastMessage } from "../CustomComponents/Toastify/Toast";
import { FlexBox } from "../CustomComponents/FlexBox";
import { location } from "@prisma/client";
import LoadingSpinner from "../CustomComponents/LoadingSpinner";
import { useQueryClient } from "@tanstack/react-query";

const WorldManagement = ({
  playerLocations,
}: {
  playerLocations: location[];
}) => {
  const { data: session, update } = useSession();
  const user = session?.user;
  const queryClient = useQueryClient();

  const [newWorldName, setNewWorldName] = useState("");
  const [newWorldDescription, setNewWorldDescription] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [deleteWorldInput, setDeleteWorldInput] = useState("");
  const [visibleOption, setVisibleOption] = useState<
    "createWorld" | "deleteWorld" | "inviteUser" | null
  >(null);

  const handleCreateWorld = async () => {
    try {
      const { data: createdWorld } = await axios.post(
        `/api/worlds/create/${user?.user_id}`,
        {
          location_name: newWorldName,
          location_description: newWorldDescription,
        }
      );

      const { location_id } = createdWorld;
      update({
        location_id: location_id,
        selectedWorld: createdWorld,
      });
      await queryClient.invalidateQueries({
        queryKey: [`getAllWorldsThatUserHasAccess-${user?.user_id}`],
      });
      setVisibleOption(null);
      toastMessage("World successfully created", "success");
      console.log(playerLocations);
    } catch (err: any) {
      toastMessage(err?.response?.data?.error, "error");
    }
  };

  const handleDeleteWorld = async () => {
    if (!deleteWorldInput) {
      toastMessage("Input is empty", "error");
      return;
    }
    try {
      const { data } = await axios.put("/api/worlds/delete", {
        location_name: deleteWorldInput,
      });
      toastMessage(data.message, "success");
      await queryClient.invalidateQueries({
        queryKey: [`getAllWorldsThatUserHasAccess-${user?.user_id}`],
      });

      console.log(user?.selectedWorld?.location_id, data.location_id);

      if (playerLocations.length === 1) {
        update({
          location_id: null,
          selectedWorld: null,
        });
        return;
      }

      if (user?.selectedWorld?.location_id === data.deletedWorldId) {
        console.log(playerLocations);
        update({
          location_id: playerLocations[0].location_id,
          selectedWorld: playerLocations.length ? playerLocations[0] : null,
        });
      }

      setDeleteWorldInput("");
      setVisibleOption(null);
    } catch (err: any) {
      console.log(err);
      toastMessage(err.response.data.message, "error");
    }
  };

  const handleAddPlayerToWorld = async () => {
    try {
      await axios.post(`/api/worlds/add-user`, {
        user_name: newUsername,
        location_id: user?.location_id,
      });
      toastMessage("User successfully added", "success");
      setVisibleOption(null);
    } catch (err: any) {
      console.log(err);
      if (err.response.status === 406)
        toastMessage(err?.response?.data?.message, "error");
    }
  };

  if (!playerLocations || !user) {
    return <LoadingSpinner />;
  }

  return (
    <OptionsCard title="Worlds">
      {playerLocations.length ? <SelectWorld /> : null}
      <FlexBox sx={{ gap: "2px" }}>
        <Button
          variant={
            !(visibleOption === "createWorld") ? "outlined" : "contained"
          }
          onClick={() =>
            setVisibleOption((p) =>
              p === "createWorld" ? null : "createWorld"
            )
          }
        >
          Create
        </Button>
        <Button
          variant={
            !(visibleOption === "deleteWorld") ? "outlined" : "contained"
          }
          onClick={() =>
            setVisibleOption((p) =>
              p === "deleteWorld" ? null : "deleteWorld"
            )
          }
        >
          Delete
        </Button>
        <Button
          variant={!(visibleOption === "inviteUser") ? "outlined" : "contained"}
          onClick={() =>
            setVisibleOption((p) => (p === "inviteUser" ? null : "inviteUser"))
          }
        >
          Add player
        </Button>
      </FlexBox>
      {visibleOption === "inviteUser" && (
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
      )}

      {visibleOption === "createWorld" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "auto",
            gap: "1rem",
            width: "100%",
          }}
        >
          <FlexBox>
            <TextField
              label="New World name"
              value={newWorldName}
              onChange={(e) => setNewWorldName(e.target.value)}
              size="small"
            />
            <Button variant="contained" onClick={handleCreateWorld}>
              Create
            </Button>
          </FlexBox>
          <Typography variant="h6">Description</Typography>
          <TextareaAutosize
            style={{ width: "100%", minHeight: "4rem", padding: "1rem" }}
            value={newWorldDescription}
            onChange={(e) => setNewWorldDescription(e.target.value)}
          />
        </Box>
      )}

      {visibleOption === "deleteWorld" && (
        <FlexBox>
          <TextField
            label="World's name"
            value={deleteWorldInput}
            onChange={(e) => setDeleteWorldInput(e.target.value)}
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleDeleteWorld}
            sx={(theme) => ({
              bgcolor: theme.palette.error.main,
              color: "white",
              "&:hover": {
                bgcolor: theme.palette.error.main,
              },
            })}
          >
            Do it!
          </Button>
        </FlexBox>
      )}
    </OptionsCard>
  );
};

export default WorldManagement;
