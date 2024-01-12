import { NextApiRequest, NextApiResponse } from "next";
import { getUniqueSentientById } from "@/services/data-fetching/getSentients";
import { getAPISession } from "@/utilities/functions/getServerSideSession";
import { deleteSentient } from "@/services/modifyData/sentients";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const sentient = await getUniqueSentientById(Number(req.query.sentient_id));
    res.status(200).json(sentient);
  }
  if (req.method === "DELETE") {
    const { user } = await getAPISession(req, res);
    if (!user || !user?.location_id) {
      res.status(401);
      return;
    }
    if (!req.query.sentient_id) {
      res.status(400);
      return;
    }

    const editedSentient = await deleteSentient({
      sentient_id: Number(req.query.sentient_id),
    });
    res.status(200).json({ editedSentient, message: "Character updated" });
    return;
  }
}
