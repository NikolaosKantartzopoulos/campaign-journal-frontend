import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { user_name, location_id } = req.body;
      const data = await prisma.user.findFirst({
        where: {
          user_name: user_name,
        },
        select: { user_id: true },
      });
      if (!data) {
        res.status(406).json({ message: `No user named ${user_name} exists` });
        return;
      }

      const { user_id }: { user_id: number } = data as { user_id: number };

      await prisma.world_user.create({
        data: {
          user_id: user_id,
          location_id: location_id,
        },
      });
      res.status(200);
    } catch (err) {
      console.log(err);
    }
  }
}
