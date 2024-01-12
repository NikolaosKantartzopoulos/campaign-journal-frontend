import { NextApiRequest, NextApiResponse } from "next";
import { changeUsersActiveWorld } from "@/services/modifyData/userServices";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { location_id, user_id } = req.body;
    try {
      const data = await changeUsersActiveWorld(user_id, location_id);
      res.status(200).json(data);
    } catch (err) {
      res.status(400).json({ message: "Could not save user's active world" });
    }
  }
}
