import { location } from "@prisma/client";

export function getLocationFromLocationId(
  location_id: number,
  locationsArray: location[]
) {
  return locationsArray.find((el) => el.location_id === location_id) || null;
}
