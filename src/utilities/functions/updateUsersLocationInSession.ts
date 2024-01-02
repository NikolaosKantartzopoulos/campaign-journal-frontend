import { Session } from "next-auth";
import { getLocationFromLocationId } from "../helperFn/getLocationFromLocationId";
import { location } from "@prisma/client";

export async function updateUsersLocationInSession(
  location_id: number,
  playerLocations: location[],
  update: (data?: any) => Promise<Session | null>
) {
  update({
    test: "value",
    location_id: location_id,
    selectedWorld: getLocationFromLocationId(
      Number(location_id),
      playerLocations
    ),
  });
}
