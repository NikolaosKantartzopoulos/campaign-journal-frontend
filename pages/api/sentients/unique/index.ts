import { NextApiRequest, NextApiResponse } from "next";
import { getAPISession } from "@/utilities/functions/getServerSideSession";
import {
  createSentient,
  updateSentient,
} from "@/services/modifyData/sentients";
import logger from "@/logger/*";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user } = await getAPISession(req, res);
  if (!user || !user?.location_id) {
    res.status(401);
    return;
  }
  try {
    if (req.method === "POST") {
      const { first_name, last_name, race_name, short_title, state } = req.body;
      const newlyCreatedSentient = await createSentient({
        first_name,
        last_name,
        race_name,
        short_title,
        state,
        world_id: user?.location_id,
      });
      res.status(200).json(newlyCreatedSentient);
      return;
    }
    if (req.method === "PATCH") {
      const {
        sentient_id,
        first_name,
        last_name,
        race_name,
        short_title,
        state,
      } = req.body;
      const editedSentient = await updateSentient({
        sentient_id,
        first_name,
        last_name,
        race_name,
        short_title,
        state,
        world_id: user?.location_id,
      });
      res.status(200).json({ editedSentient, message: "Character updated" });
      return;
    }
  } catch (err) {
    logger.error(err);
  }
}
