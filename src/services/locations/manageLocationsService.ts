import {
  createNewLocationClient,
  editLocationClient,
} from "@/clients/Locations/locationsClient";
import logger from "@/logger/*";

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
