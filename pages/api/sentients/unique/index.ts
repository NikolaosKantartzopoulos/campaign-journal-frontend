import { NextApiRequest, NextApiResponse } from "next";
import { getAPISession } from "@/utilities/functions/getServerSideSession";
import { createSentient } from "@/services/modifyData/sentients";
import logger from "../../../../logger";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { user } = await getAPISession(req, res);
      if (!user || !user?.location_id) {
        res.status(401);
        return;
      }
      const { first_name, last_name, race_name, short_title } = req.body;
      console.log(req.body);
      const newlyCreatedSentient = await createSentient({
        first_name,
        last_name,
        race_name,
        short_title,
        world_id: user?.location_id,
      });

      res.status(200).json(newlyCreatedSentient);
    } catch (err) {
      logger.error(err);
    }
  }
}
