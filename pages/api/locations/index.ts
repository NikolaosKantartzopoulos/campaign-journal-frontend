import { getAllLocationsWithWorldId } from "@/clients/Locations/locationsClient";
import { getAPISession } from "@/utilities/functions/getServerSideSession";
import { NextApiRequest, NextApiResponse } from "next";
import { getUniqueLocationByIdService } from "@/services/locations/getLocations";
import { createNewLocationService } from "@/services/locations/manageLocationsService";
import logger from "@/logger/*";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { user } = await getAPISession(req, res);
      if (!user) {
        res.status(401);
        return;
      }
      const { location_name, location_description, part_of } = req.body;

      const parentLocation = await getUniqueLocationByIdService(
        Number(part_of)
      );

      if (!parentLocation) {
        res.status(400);
        return;
      }

      const worldsLocations = await getAllLocationsWithWorldId(Number(part_of));
      const worldLocationsNames = worldsLocations?.map(
        (location) => location.location_name
      );
      if (worldLocationsNames?.includes(location_name)) {
        res.status(406);
      }

      const locationScales = [
        "World",
        "Continent",
        "Kingdom",
        "Province",
        "Area",
      ];

      const childLocationScale =
        locationScales[
          locationScales.findIndex(
            (el) => parentLocation?.location_scale === el
          ) + 1
        ];

      // console.log({
      //   location_name,
      //   location_scale: childLocationScale as
      //     | "World"
      //     | "Continent"
      //     | "Kingdom"
      //     | "Province"
      //     | "Area",
      //   location_description,
      //   part_of,
      //   game_master: user.user_id,
      //   world_id: Number(user.location_id),
      // });

      const createdLocation = await createNewLocationService({
        location_name,
        location_scale: childLocationScale as
          | "World"
          | "Continent"
          | "Kingdom"
          | "Province"
          | "Area",
        location_description,
        part_of: Number(part_of),
        game_master: user.user_id,
        world_id: Number(user.location_id),
      });

      res.status(200).json(createdLocation);
      return;
    } catch (err) {
      logger.error(
        "/pages/api/locations/[location_id].ts => Error while creating new location"
      );
    }
  }
}
