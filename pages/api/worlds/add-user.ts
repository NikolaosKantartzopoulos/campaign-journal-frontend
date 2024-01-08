import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";
import logger from "../../../logger";
import { getAPISession } from "@/utilities/functions/getServerSideSession";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { user } = await getAPISession(req, res);

    if (!user) {
      res.status(401);
      return;
    }

    if (!user.selectedWorld) {
      res.status(400);
      return;
    }

    try {
      const { user_name, location_id } = req.body;

      const userFound = await prisma.user.findFirst({
        where: {
          user_name: user_name,
        },
        select: { user_id: true },
      });
      if (!userFound) {
        res.status(406).json({ message: `No user named ${user_name} exists` });
        return;
      }

      const { user_id }: { user_id: number } = userFound as { user_id: number };
      console.log("====================================");
      console.log(user_id, location_id);
      await prisma.world_user.create({
        data: {
          user_id: user_id,
          world_id: location_id,
        },
      });

      res.status(200).json({ message: `${user_name} added` });
    } catch (err) {
      logger.error(err);
      res.status(400).json(err);
    }
  }
}
