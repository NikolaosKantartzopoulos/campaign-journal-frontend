import { getLocationsAndParentsIdsClient } from "@/clients/Locations/locationsClient";
import logger from "@/logger/*";

export async function getLocationsAndParentsIdsService({
  world_id,
}: {
  world_id: number;
}) {
  try {
    return await getLocationsAndParentsIdsClient({ world_id });
  } catch (err) {
    logger.error("[Get Locations Service]: getLocationsAndParentsIdsService()");
  }
}
