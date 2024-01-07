import { NextApiRequest, NextApiResponse } from "next";
import { getPlayersSubscribedToWorld } from "@/services/data-fetching/getPlayers";
import { getAPISession } from "@/utilities/functions/getServerSideSession";
import { location } from "@prisma/client";
import logger from "../../../logger";

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
      const players = await getPlayersSubscribedToWorld(
        user?.selectedWorld as location,
        user.user_id
      );

      res.status(200).json(players);
    } catch (err) {
      logger.error(err);
    }
  }
}
