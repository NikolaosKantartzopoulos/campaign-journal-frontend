import {
  getLocationFullNamesAndIdsClient,
  getLocationsAndParentsIdsClient,
} from "@/clients/Locations/locationsClient";
import logger from "@/logger/*";
import { getLocationFullTitle } from "@/utilities/helperFn/createLocationsFullTitle";

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

export async function getLocationFullNamesAndIdsService({
  world_id,
}: {
  world_id: number;
}) {
  try {
    const data = await getLocationFullNamesAndIdsClient({ world_id });

    return data.map((el) => ({
      location_id: el.location_id,
      location_title: getLocationFullTitle(el),
    }));
  } catch (err) {
    logger.error(
      "[Get Locations Service]: getLocationFullNamesAndIdsService()"
    );
  }
}
