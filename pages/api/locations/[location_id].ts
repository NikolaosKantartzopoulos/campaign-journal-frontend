import { NextApiRequest, NextApiResponse } from "next";
import { getUniqueLocationByIdService } from "@/services/locations/getLocations";
import { getAPISession } from "@/utilities/functions/getServerSideSession";
import { editLocationService } from "@/services/locations/manageLocationsService";
import logger from "@/logger/*";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const location = await getUniqueLocationByIdService(
      Number(req.query.location_id)
    );
    res.status(200).json(location);
    return;
  }

  if (req.method === "PATCH") {
    try {
      await getAPISession(req, res);

      const newData = await editLocationService({
        location_id: Number(req.query.location_id),
        location_name: req.body.location_name,
        location_description: req.body.location_description,
      });

      res.status(200).json({ message: "Location updated" });
    } catch (err) {
      logger.error("[Locations API]: Location failed to update");
    }
  }

  // if (req.method === "DELETE") {
  //   const { user } = await getAPISession(req, res);
  //   if (!user || !user?.location_id) {
  //     res.status(401);
  //     return;
  //   }
  //   if (!req.query.location_id) {
  //     res.status(400);
  //     return;
  //   }

  //   const editedSentient = await deleteSentient({
  //     location_id: Number(req.query.location_id),
  //   });
  //   res.status(200).json({ editedSentient, message: "Character updated" });
  //   return;
  // }
}
