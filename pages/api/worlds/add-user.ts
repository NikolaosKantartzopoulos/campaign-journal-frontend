import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";
import logger from "../../../logger";
import { getAPISession } from "@/utilities/functions/getServerSideSession";
import { isUserGameMaster } from "@/utilities/helperFn/isUserGameMaster";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { user, session } = await getAPISession(req, res);

    if (!user) {
      res.status(401);
      return;
    }

    if (!user.selectedWorld) {
      res.status(400);
      return;
    }

    try {
      const { user_name } = req.body;
      const isWorldGameMaster = isUserGameMaster(session);

      if (!isWorldGameMaster) {
        res.status(401).json({ message: "You do not own this world." });
        return;
      }
      console.log(user);
      if (!user?.selectedWorld?.location_id) {
        res.status(400).json({ message: "No world_id selected" });
        return;
      }

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
      await prisma.world_user.create({
        data: {
          user_id: user_id,
          world_id: user.selectedWorld?.location_id,
        },
      });

      res.status(200).json({ message: `${user_name} added` });
    } catch (err) {
      logger.error(err);
      res.status(400).json(err);
    }
  }
}
