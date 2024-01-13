import * as React from "react";
import Box from "@mui/material/Box";
import { location } from "@prisma/client";
import axios from "axios";
import { toastMessage } from "../CustomComponents/Toastify/Toast";
import { useSession } from "next-auth/react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { FlexBox } from "../CustomComponents/FlexBox";
import LoadingSpinner from "../CustomComponents/LoadingSpinner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import EditIcon from "@mui/icons-material/Edit";
import { getLocationFromLocationId } from "@/utilities/helperFn/getLocationFromLocationId";
import { useEffect, useState } from "react";
import logger from "@/logger/*";

export default function SelectWorld() {
  const { data: session, update, status } = useSession();
  const user = session?.user;
  const queryClient = useQueryClient();

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [editWorldNameInput, setEditWorldNameInput] = useState(
    user?.selectedWorld?.location_name || ""
  );
  const [editWorldDescription, setEditWorldDescription] = useState(
    user?.selectedWorld?.location_description || ""
  );

  const { data: playerLocations, isLoading } = useQuery<location[]>({
    queryKey: [
      `getAllWorldsThatUserHasAccess`,
      { user_id: user?.user_id },
      { world_id: user?.selectedWorld?.location_id },
    ],

    queryFn: async () => {
      try {
        const response = await axios(
          `/api/worlds/get-all-worlds-that-user-has-access/${user?.user_id}`
        );
        return response.data || null;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Failed to fetch data");
      }
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (
      playerLocations &&
      playerLocations?.length > 0 &&
      !user?.selectedWorld
    ) {
      update({
        location_id: playerLocations[0].location_id,
        selectedWorld: getLocationFromLocationId(
          Number(playerLocations[0].location_id),
          playerLocations
        ),
      });
    }
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  async function handleWorldSelection(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    if (!playerLocations) return;

    const worldToSend = playerLocations?.find(
      (world) => world.location_name === event.target.value
    );

    try {
      const { status } = await axios.put(
        "/api/user-management/change-active-world",
        {
          user_id: user?.user_id,
          location_id: worldToSend?.location_id,
        }
      );
      if (status === 200) {
        toastMessage("Active world updated", "success");
        update({
          location_id: worldToSend?.location_id,
          selectedWorld: getLocationFromLocationId(
            Number(worldToSend?.location_id),
            playerLocations
          ),
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["playersSubscribedToWorld", "worldsHeroFactions"],
      });
    } catch (err) {
      toastMessage("Action Failed, please try again", "error");
    }
  }

  async function handleRenameWorld() {
    try {
      const { data } = await axios.patch("/api/worlds/rename-world", {
        newLocationName: editWorldNameInput,
        newDescription: editWorldDescription,
      });
      toastMessage(data.message, "success");
      queryClient.invalidateQueries({
        queryKey: [`getAllWorldsThatUserHasAccess`],
      });
      handleClose();
      update({
        selectedWorld: data.updatedWorldVersion,
      });
    } catch (err: any) {
      logger.error(err);
    }
  }

  if (playerLocations?.length === 0) {
    return (
      <>
        <Typography variant="h5" align="center">
          No worlds available
        </Typography>
        <Typography variant="subtitle1" align="center">
          You should create one!
        </Typography>
      </>
    );
  }

  if (status === "authenticated") {
    return (
      <Box sx={{ width: "100%" }}>
        <FlexBox>
          <Typography
            variant="h6"
            noWrap
            sx={{
              display: "inline-block",
              overflow: "hidden",
              minWidth: "65px",
            }}
          >
            Active
          </Typography>
          <select
            defaultValue={session.user.selectedWorld?.location_name}
            onChange={handleWorldSelection}
            style={{
              height: "2rem",
              minWidth: "150px",
              paddingLeft: "0.5rem",
              backgroundColor: "white",
            }}
          >
            {playerLocations?.map((el) => (
              <option key={el.location_id} value={el.location_name}>
                {el.game_master === user?.user_id && "🔑 "}
                {el.location_name}
              </option>
            ))}
          </select>
          <Box sx={{ height: "32px", width: "32px", position: "relative" }}>
            <EditIcon
              color="primary"
              sx={{ "&:hover": { scale: "1.1", cursor: "pointer" } }}
              onClick={handleClickOpen}
            />
          </Box>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{ padding: "1rem" }}
          >
            <DialogTitle id="alert-dialog-title" sx={{ paddingBottom: 0 }}>
              Rename world
            </DialogTitle>
            <DialogContent sx={{ p: 1 }}>
              <TextField
                label="New name"
                value={editWorldNameInput}
                onChange={(e) => setEditWorldNameInput(e.target.value)}
                size="small"
                sx={{ margin: "1rem" }}
              />
              <Typography variant="h6">Description</Typography>
              <TextareaAutosize
                style={{
                  width: "100%",
                  minHeight: "4rem",
                  padding: "1rem",
                }}
                value={editWorldDescription}
                onChange={(e) => setEditWorldDescription(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>back</Button>
              <Button onClick={handleRenameWorld}>Edit world name</Button>
            </DialogActions>
          </Dialog>
        </FlexBox>
        {user?.selectedWorld?.location_description && (
          <>
            <Divider sx={{ m: 2 }} />
            <Typography variant="body1" align="center" sx={{ m: 1 }}>
              {user?.selectedWorld?.location_description}
            </Typography>
            <Divider sx={{ m: 2 }} />
          </>
        )}
      </Box>
    );
  }
}
