import { NextApiRequest, NextApiResponse } from "next";
import { createHeroFaction } from "@/services/modifyData/createHeroFaction";
import { getAPISession } from "@/utilities/functions/getServerSideSession";

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

    const createdHeroFaction = await createHeroFaction(
      user?.selectedWorld,
      req.body.newFactionName
    );

    res
      .status(200)
      .json({ createdHeroFaction, message: "Hero faction created" });
  } catch (err) {
    res.status(400);
  }
}
