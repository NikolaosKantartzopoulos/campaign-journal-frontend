import { NextApiRequest, NextApiResponse } from "next";
import { getUniqueLocationByIdService } from "@/services/locations/getLocations";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const location = await getUniqueLocationByIdService(
      Number(req.query.location_id)
    );
    res.status(200).json(location);
    return;
  }
  // if (req.method === "DELETE") {
  //   const { user } = await getAPISession(req, res);
  //   if (!user || !user?.location_id) {
  //     res.status(401);
  //     return;
  //   }
  //   if (!req.query.location_id) {
  //     res.status(400);
  //     return;
  //   }

  //   const editedSentient = await deleteSentient({
  //     location_id: Number(req.query.location_id),
  //   });
  //   res.status(200).json({ editedSentient, message: "Character updated" });
  //   return;
  // }
}
