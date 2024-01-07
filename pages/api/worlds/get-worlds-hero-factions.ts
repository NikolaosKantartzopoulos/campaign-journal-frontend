import { NextApiRequest, NextApiResponse } from "next";
import { getAPISession } from "@/utilities/functions/getServerSideSession";
import { getWorldsHeroFactions } from "@/services/data-fetching/getFactions";
import logger from "../../../logger";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { user } = await getAPISession(req, res);

      if (!user || !user.selectedWorld) {
        res.status(401).json({ message: "Not signed in" });
        return;
      }

      const worldsHeroFactions = await getWorldsHeroFactions(
        user.selectedWorld
      );

      res.status(200).json({
        worldsHeroFactions,
        message: "Worlds hero factions retrieved",
      });
    } catch (err) {
      logger.error(err);
      res.status(400);
    }
  }
}
