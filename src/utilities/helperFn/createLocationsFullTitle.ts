import { locationFullNameAndIdInterface } from "@/clients/Locations/locationsClient";

export function getLocationFullTitle(location: locationFullNameAndIdInterface) {
  return `${location.location_name}, ${location.parent_location_scale} of ${location.parent_location_name}`;
}
