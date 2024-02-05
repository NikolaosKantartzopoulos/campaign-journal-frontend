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
import { location } from "@prisma/client";
import { QueryClient, dehydrate, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

const ManageLocation = ({ parentLocation }: { parentLocation: location }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [locationName, setLocationName] = useState<string>("");
  const [locationDescription, setLocationDescription] = useState<string>("");

  async function handleCreateLocation() {
    try {
      const { data: createdLocation } = await axios.post("/api/locations/", {
        location_name: locationName,
        location_description: locationDescription,
        part_of: parentLocation.location_id,
      });
      toastMessage("Location created", "success");

      console.log(createdLocation);

      queryClient.invalidateQueries({
        queryKey: ["worldLocations"],
      });

      router.push(`/location/manage-location/${createdLocation?.location_id}`);
    } catch (error) {
      const err = error as AxiosError;
      toastMessage(
        // @ts-expect-error Error
        err?.response?.data?.message || "Try again",
        "error"
      );
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
      <Typography variant="h4">
        Create new location in World: {user?.selectedWorld?.location_name}
      </Typography>

      <Typography variant="h6">
        as a part of {parentLocation?.location_name}
      </Typography>

      <FlexBox sx={{ flexFlow: "column", alignItems: "center" }}>
        <TextField
          placeholder="Name"
          size="small"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          label="Name"
          sx={{ margin: "2rem auto" }}
          inputRef={input => input && input.focus()}
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
  await withServerSessionGuard(ctx);

  const parentLocation = await getUniqueLocationById(
    Number(ctx.query.parent_location_id)
  );
  const queryClient = new QueryClient();

  return { props: { parentLocation, dehydratedState: dehydrate(queryClient) } };
};

export default ManageLocation;
