import {
  createNewLocationClient,
  deleteLocationClient,
  editLocationClient,
} from "@/clients/Locations/locationsClient";
import logger from "@/logger/*";
import { getLocationsAndParentsIdsService } from "../data-fetching/getLocations";
import { separateLocationsBySize } from "@/utilities/helperFn/locations";

export async function createNewLocationService({
  location_name,
  location_scale,
  location_description,
  part_of,
  game_master,
  world_id,
}: {
  location_name: string;
  location_scale:
    | "World"
    | "Continent"
    | "Kingdom"
    | "Province"
    | "Area"
    | "Place";
  location_description: string;
  part_of: number;
  game_master: number;
  world_id: number;
}) {
  try {
    const createdLocation = await createNewLocationClient({
      location_name,
      location_scale,
      location_description,
      part_of,
      game_master,
      world_id,
    });

    return createdLocation;
  } catch (err) {
    logger.error(
      "[createNewLocationService]: Location could not be created",
      err
    );
  }
}

export async function editLocationService({
  location_id,
  location_name,
  location_description,
}: {
  location_id: number;
  location_name: string;
  location_description: string;
}) {
  try {
    const createdLocation = await editLocationClient({
      location_id,
      location_name,
      location_description,
    });

    return createdLocation;
  } catch (err) {
    logger.error("[Edit location service]: Location could not be created", err);
  }
}

export async function deleteLocationService({
  location_id,
}: {
  location_id: number;
}) {
  try {
    const res = await deleteLocationClient({ location_id });
    console.log(res);
  } catch (err) {
    logger.error("[Delete location service]: Failed", err);
  }
}

export async function deleteLocationAndChildren({
  world_id,
  location_id,
}: {
  world_id: number;
  location_id: number;
}) {
  try {
    const locationsAndParentsIds = await getLocationsAndParentsIdsService({
      world_id,
    });

    const selectedLocation = locationsAndParentsIds?.find(
      (el) => el.location_id === location_id
    );

    if (!locationsAndParentsIds) {
      throw Error("No locations found");
    }

    const availableLocations = separateLocationsBySize<{
      location_id: number;
      part_of: number | null;
      location_scale: string | null;
    }>(locationsAndParentsIds);

    const locationsArray = [];
    for (const value of Object.values(availableLocations)) {
      locationsArray.push(value);
    }

    const locationsToDelete = new Set<number>();
    locationsArray.forEach((scale) => {
      scale.forEach((location) => {
        if (
          selectedLocation?.location_id === location.location_id ||
          (location.part_of && locationsToDelete.has(location.part_of))
        ) {
          locationsToDelete.add(location.location_id);
        }
      });
    });
    console.log(Array.from(locationsToDelete));
    for (const location_id of Array.from(locationsToDelete).reverse()) {
      await deleteLocationService({ location_id });
    }
  } catch (err) {
    logger.error("[manageLocationsService]: deleteLocationAndChildren()");
  }
}
