import { NextApiRequest, NextApiResponse } from "next";
import { createHeroFaction } from "@/services/modifyData/createHeroFaction";
import { getAPISession } from "@/utilities/functions/getServerSideSesion";

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
    console.log("Before Created Faction in API");

    const createdHeroFaction = await createHeroFaction(
      user?.selectedWorld,
      req.body.newFactionName
    );
    console.log("Created Faction in API", createdHeroFaction);

    res
      .status(200)
      .json({ createdHeroFaction, message: "Hero faction created" });
  } catch (err) {
    res.status(400);
  }
}
