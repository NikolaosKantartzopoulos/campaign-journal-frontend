import { NextApiRequest, NextApiResponse } from "next";
import { getAllWorldsThatUserHasAccess } from "@/services/data-fetching/getWorlds";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      console.log("api---->", req.query.user_id);
      const data = await getAllWorldsThatUserHasAccess(
        Number(req.query.user_id)
      );
      console.log("targetAPI +++++", data);

      res.status(200).json(data);
    } catch (err) {
      console.log(err);
    }
  }
}
