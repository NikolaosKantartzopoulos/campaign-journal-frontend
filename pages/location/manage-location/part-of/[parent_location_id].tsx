import { FlexBox } from "@/Components/CustomComponents/FlexBox";
import { toastMessage } from "@/Components/CustomComponents/Toastify/Toast";
import { getUniqueLocationById } from "@/clients/Locations/locationsClient";
import { withServerSessionGuard } from "@/utilities/functions/getServerSideSession";
import {
  Box,
  Button,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

const ManageLocation = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const parent_location_id = router.query.parent_location_id;

  const { data: location } = useQuery({
    queryKey: [
      "location",
      { user_id: user?.user_id },
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
  console.log(location);

  const [locationName, setLocationName] = useState<string>("");
  const [locationDescription, setLocationDescription] = useState<string>("");

  async function handleCreateLocation() {
    try {
      const createdLocation = await axios.post("/api/locations/", {
        location_name: locationName,
        location_description: locationDescription,
        part_of: parent_location_id,
      });
      toastMessage("Location created", "success");
    } catch (err) {
      toastMessage("Error: Try again", "error");
    }
  }

  return (
    <Box
      sx={(theme) => ({
        m: 2,
        [theme.breakpoints.up("md")]: {
          width: "70%",
          mx: "auto",
        },
      })}
    >
      <Typography variant="h4">Create new location</Typography>
      <Typography variant="h6">
        as a part of {user?.selectedWorld?.location_name} world
      </Typography>

      <FlexBox sx={{ flexFlow: "column", alignItems: "center" }}>
        <TextField
          placeholder="Name"
          size="small"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          label="Name"
          sx={{ margin: "2rem auto" }}
        />
        <Typography variant="h5" align="center">
          Info
        </Typography>
        <TextareaAutosize
          style={{
            width: "100%",
            minHeight: "4rem",
            padding: "1rem",
          }}
          value={locationDescription}
          onChange={(e) => setLocationDescription(e.target.value)}
        />
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Button variant="outlined" onClick={() => router.push("/locations")}>
            Back
          </Button>
          <Button variant="outlined" onClick={handleCreateLocation}>
            Create
          </Button>
        </Box>
      </FlexBox>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const { user } = await withServerSessionGuard(ctx);

  const queryClient = new QueryClient();
  const location_id = ctx?.params?.location_id;

  await queryClient.prefetchQuery({
    queryKey: [
      "location",
      { user_id: user?.user_id },
      { location_id: ctx.query.location_id },
    ],
    queryFn: () => getUniqueLocationById(Number(ctx.query.location_id)),
  });

  return { props: { dehydratedState: dehydrate(queryClient) } };
};

export default ManageLocation;
