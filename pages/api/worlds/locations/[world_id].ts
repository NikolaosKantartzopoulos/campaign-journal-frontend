import { NextApiRequest, NextApiResponse } from "next";
import { getAllWorldsLocations } from "@/clients/Locations/locationsClient";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const data = await getAllWorldsLocations(Number(req.query.world_id));
      res.status(200).json(data);
    } catch (err) {}
  }
}
