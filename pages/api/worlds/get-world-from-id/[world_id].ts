import { NextApiRequest, NextApiResponse } from "next";
import { getAPISession } from "@/utilities/functions/getServerSideSession";
import logger from "../../../../logger";
import { getWorldFromId } from "@/services/data-fetching/getWorlds";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { user } = await getAPISession(req, res);

    if (!user || user === undefined) {
      res.status(400).json({ message: "no active session" });
      return;
    }
    try {
      const world = await getWorldFromId({
        user_id: user.user_id,
        world_id: Number(req.query.world_id),
      });

      res.status(200).json(world);
    } catch (err) {
      logger.error(err);
    }
  }
}
