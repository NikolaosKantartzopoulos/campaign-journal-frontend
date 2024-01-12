import { deleteUserFromFaction } from "@/services/modifyData/manageHeroFactions";
import { getAPISession } from "@/utilities/functions/getServerSideSession";
import { isUserGameMaster } from "@/utilities/helperFn/isUserGameMaster";
import { NextApiRequest, NextApiResponse } from "next";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    try {
      const { user, session } = await getAPISession(req, res);

      if (!user || !user.selectedWorld) {
        res.status(401).json({ message: "Not signed in" });
        return;
      }

      const isWorldGameMaster = isUserGameMaster(session);

      if (!isWorldGameMaster) {
        res.status(401).json({ message: "You do not own this world." });
        return;
      }

      const data = await deleteUserFromFaction(
        req.body.faction_id,
        req.body.user_id
      );

      res.status(200).json({
        data,
        message: `User removed from Faction`,
      });
      return;
    } catch (err) {
      res.status(400);
    }
  }
  res.status(400);
}
