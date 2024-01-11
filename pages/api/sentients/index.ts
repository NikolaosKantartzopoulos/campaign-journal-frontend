import { NextApiRequest, NextApiResponse } from "next";
import { getAllSentients } from "@/services/data-fetching/getSentients";
import { getAPISession } from "@/utilities/functions/getServerSideSession";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { user } = await getAPISession(req, res);
    if (!user || !user?.location_id) {
      res.status(401);
      return;
    }
    const sentients = await getAllSentients({ world_id: user.location_id });
    res.status(200).json(sentients);
  }
}
