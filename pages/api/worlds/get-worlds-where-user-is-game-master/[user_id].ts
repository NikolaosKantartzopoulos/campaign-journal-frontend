import { NextApiRequest, NextApiResponse } from "next";
import { getAPISession } from "@/utilities/functions/getServerSideSession";
import logger from "@/logger/*";
import { getWorldsWhereUserIsGameMaster } from "@/clients/worlds/worldsDataClient";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { user } = await getAPISession(req, res);

    if (!user || !user.selectedWorld) {
      res.status(401).json({ message: "Not signed in" });
      return;
    }

    try {
      const data = await getWorldsWhereUserIsGameMaster(
        Number(req.query.user_id)
      );
      res.status(200).json(data);
    } catch (err) {
      logger;
    }
  }
}
