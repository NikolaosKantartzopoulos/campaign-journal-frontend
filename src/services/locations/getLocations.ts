import logger from "@/logger/*";
import {
  getUniqueLocationById,
  locationAndPartOfLocationIncluded,
} from "@/clients/Locations/locationsClient";

export async function getUniqueLocationByIdService(
  location_id: number
): Promise<locationAndPartOfLocationIncluded | undefined | null> {
  try {
    const location = await getUniqueLocationById(location_id);
    return location;
  } catch (err) {
    logger.error(`[getUniqueLocationByIdService]: ${err}`);
    throw new Error("Location exists");
  }
}
