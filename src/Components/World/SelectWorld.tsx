import * as React from "react";
import Box from "@mui/material/Box";
import { location } from "@prisma/client";
import axios from "axios";
import { toastMessage } from "../CustomComponents/Toastify/Toast";
import { useSession } from "next-auth/react";
import { Typography } from "@mui/material";
import { FlexBox } from "../CustomComponents/FlexBox";
import LoadingSpinner from "../CustomComponents/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { getLocationFromLocationId } from "@/utilities/helperFn/getLocationFromLocationId";

export default function SelectWorld() {
  const { data: session, update, status } = useSession();
  const user = session?.user;

  const { data: playerLocations, isLoading } = useQuery<location[]>({
    queryKey: [`getAllWorldsThatUserHasAccess-${user?.user_id}`],
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
  });

  if (isLoading || !session) {
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
          test: "value",
          location_id: worldToSend?.location_id,
          selectedWorld: getLocationFromLocationId(
            Number(worldToSend?.location_id),
            playerLocations
          ),
        });
      }
    } catch (err) {
      toastMessage("Action Failed, please try again", "error");
    }
  }
  if (status === "authenticated") {
    return (
      <Box sx={{ width: "100%", mb: "1rem" }}>
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
            style={{ height: "2rem", minWidth: "150px", paddingLeft: "0.5rem" }}
          >
            {playerLocations?.map((el) => (
              <option key={el.location_id} value={el.location_name}>
                {el.location_name}
              </option>
            ))}
          </select>
        </FlexBox>
      </Box>
    );
  }
}
