import { NextApiRequest, NextApiResponse } from "next";
import { getUniqueSentient } from "@/services/data-fetching/getSentients";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const sentient = await getUniqueSentient(Number(req.query.sentient_id));
    res.status(200).json(sentient);
  }
}
