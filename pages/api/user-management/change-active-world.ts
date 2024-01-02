import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { location_id, user_id } = req.body;
    try {
      const data = await prisma.user.update({
        where: {
          user_id: user_id,
        },
        data: {
          location_id: location_id,
        },
      });
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  }
}
