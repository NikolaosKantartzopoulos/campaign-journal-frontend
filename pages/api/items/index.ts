import { getAPISession } from "@/utilities/functions/getServerSideSession";
import { NextApiRequest, NextApiResponse } from "next";
import logger from "@/logger/*";
import { createItemService } from "@/services/items/manageItemsService";

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
      const {
        item_name,
        item_description,
        item_owner_id,
        item_state,
        item_location_id,
      } = req.body;

      const createdLocation = await createItemService({
        item_name,
        item_description,
        item_owner: item_owner_id,
        item_state,
        item_location: Number(item_location_id),
        world_id: Number(user.selectedWorld?.location_id),
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
