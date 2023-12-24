import { NextApiRequest, NextApiResponse } from "next";
import { getAllSentients } from "@/services/data-fetching/getSentients";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const sentients = await getAllSentients();
    res.status(200).json(sentients);
  }
}
