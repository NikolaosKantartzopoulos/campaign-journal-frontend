import { NextApiRequest, NextApiResponse } from "next";
import { getAllSentientsNotInUsersVanguard } from "@/services/heroes/handleHeroes";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // addExistingSentientToUsersVanguard
    try {
      const data = await getAllSentientsNotInUsersVanguard(
        Number(req.query.user_id)
      );
      res.status(200).json(data);
    } catch (err) {
      res.status(400);
    }
  }
}
