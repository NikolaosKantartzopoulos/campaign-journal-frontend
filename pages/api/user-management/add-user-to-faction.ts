import { addUserToFaction } from "@/services/modifyData/addUserToFaction";
import { getAPISession } from "@/utilities/functions/getServerSideSession";
import { NextApiRequest, NextApiResponse } from "next";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    try {
      const { user } = await getAPISession(req, res);

      if (!user || !user.selectedWorld) {
        res.status(401).json({ message: "Not signed in" });
        return;
      }

      const data = await addUserToFaction(
        req.body.faction_id,
        req.body.user_id
      );

      res.status(200).json({
        data,
        message: `User added to Faction`,
      });
      return;
    } catch (err) {
      res.status(400);
    }
  }
  res.status(400);
}
