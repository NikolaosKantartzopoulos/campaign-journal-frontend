import { NextApiRequest, NextApiResponse } from "next";
import { getAllSentientsInUsersVanguard } from "@/services/heroes/handleHeroes";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // getAllSentientsInUsersVanguard
    try {
      const data = await getAllSentientsInUsersVanguard(
        Number(req.query.user_id)
      );
      res.status(200).json(data);
    } catch (err) {
      res.status(400);
    }
  }
}
