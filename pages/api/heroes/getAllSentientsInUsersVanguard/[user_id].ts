import { NextApiRequest, NextApiResponse } from "next";
import { getAllSentientsInUsersVanguard } from "@/services/heroes/handleHeroes";
import { getAPISession } from "@/utilities/functions/getServerSideSession";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // getAllSentientsInUsersVanguard
    const { user } = await getAPISession(req, res);
    if (!user || !user?.location_id) {
      res.status(401);
      return;
    }
    try {
      const data = await getAllSentientsInUsersVanguard({
        world_id: Number(user.location_id),
        user_id: Number(req.query.user_id),
      });
      res.status(200).json(data);
    } catch (err) {
      res.status(400);
    }
  }
}
