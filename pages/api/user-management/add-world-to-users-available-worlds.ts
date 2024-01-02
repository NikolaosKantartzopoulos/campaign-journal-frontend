import { NextApiRequest, NextApiResponse } from "next";
import { addWorldToUsersAvailableWorlds } from "@/services/modifyData/modifyWorlds";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { location_id, user_id } = req.body;
    try {
      const data = await addWorldToUsersAvailableWorlds(location_id, user_id);
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  }
}
