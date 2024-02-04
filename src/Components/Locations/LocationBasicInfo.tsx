import Button from "@mui/material/Button";
import { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  NativeSelect,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { FlexBox } from "@/Components/CustomComponents/FlexBox";
import { toastMessage } from "@/Components/CustomComponents/Toastify/Toast";
import axios, { AxiosError } from "axios";
import { location, sentient } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const LocationBasicInfo = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: location, isFetched } = useQuery<location>({
    queryKey: [
      "location",
      { user_id: user?.user_id },
      { world_id: user?.selectedWorld?.location_id },
      { location_id: router.query.location_id },
    ],
    queryFn: async () => {
      const { data: location } = await axios(
        `/api/locations/${router.query.location_id}`
      );
      return location;
    },
    enabled: !!user,
  });

  const [location_name, setLocation_name] = useState(
    location?.location_name || ""
  );
  const [location_description, setLocation_description] = useState(
    location?.location_description || ""
  );

  async function handleEditLocation() {
    try {
      const { data } = await axios.patch(
        "/api/locations/" + location?.location_id,
        {
          location_name,
          location_description,
        }
      );
      queryClient.invalidateQueries({
        queryKey: [
          "location",
          { user_id: user?.user_id },
          { world_id: user?.selectedWorld?.location_id },
          { location_id: router.query.location_id },
        ],
      });
      toastMessage(data.message, "success");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toastMessage("There was an error", "error");
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <FlexBox>
        <TextField
          placeholder="Thor"
          size="small"
          value={location_name}
          onChange={(e) => setLocation_name(e.target.value)}
          label="Location Name"
        />
      </FlexBox>
      <Typography variant="h5" align="center">
        Info
      </Typography>
      <TextareaAutosize
        style={{
          width: "100%",
          minHeight: "4rem",
          padding: "1rem",
        }}
        value={location_description}
        onChange={(e) => setLocation_description(e.target.value)}
      />
      {/* {!sentient && (
        <Button variant="contained" onClick={handleCreateSentient}>
          Create
        </Button>
      )} */}
      {location && (
        <Button
          variant="contained"
          onClick={() => {
            handleEditLocation();
            console.log("TODO edit character");
          }}
          disabled={
            location_name === location?.location_name &&
            location_description === location?.location_description
          }
        >
          Edit
        </Button>
      )}
    </Box>
  );
};

export default LocationBasicInfo;
