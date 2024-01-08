import { NextApiRequest, NextApiResponse } from "next";
import { getAPISession } from "@/utilities/functions/getServerSideSession";
import { deleteHeroFaction } from "@/services/modifyData/manageHeroFactions";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(400);
    return;
  }
  try {
    const { user } = await getAPISession(req, res);

    if (!user || !user.selectedWorld) {
      res.status(401).json({ message: "Not signed in" });
      return;
    }
    const deletedHeroFaction = await deleteHeroFaction({
      selectedWorld: user?.selectedWorld,
      factionToBeDeleted: req.body.factionToBeDeleted,
    });

    res
      .status(200)
      .json({ deletedHeroFaction, message: "Hero faction deleted" });
  } catch (err) {
    res.status(400);
  }
}
