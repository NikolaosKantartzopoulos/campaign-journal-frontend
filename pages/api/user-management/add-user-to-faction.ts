import { addUserToFaction } from "@/services/modifyData/manageHeroFactions";
import { getAPISession } from "@/utilities/functions/getServerSideSession";
import { NextApiRequest, NextApiResponse } from "next";
import logger from "../../../logger";
import { isUserGameMaster } from "@/utilities/helperFn/isUserGameMaster";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    try {
      const { user, session } = await getAPISession(req, res);

      if (!user || !user.selectedWorld || !user.selectedWorld?.location_id) {
        res.status(401).json({ message: "Not signed in" });
        return;
      }

      const isWorldGameMaster = isUserGameMaster(session);

      if (!isWorldGameMaster) {
        res.status(401).json({ message: "You do not own this world." });
        return;
      }

      const data = await addUserToFaction(
        req.body.faction_id,
        req.body.user_id,
        user.selectedWorld?.location_id
      );
      res.status(200).json({
        data,
        message: `User added to Faction`,
      });
      return;
    } catch (err) {
      logger.error(err);
      res.status(400);
    }
  }
  res.status(400);
}
