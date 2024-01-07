import { getAPISession } from "@/utilities/functions/getServerSideSession";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { user } = await getAPISession(req, res);

    try {
      const { location_name } = req.body;

      const locationObject = await prisma.location.findFirst({
        where: {
          location_name: location_name,
        },
      });

      if (!locationObject) {
        res
          .status(406)
          .json({ message: `No world named ${location_name} exists` });
        return;
      }

      if (locationObject?.game_master !== user.user_id) {
        res.status(401).json({ message: "You do not own this world." });
        return;
      }

      await prisma.world_user.deleteMany({
        where: {
          world_id: locationObject?.location_id,
        },
      });

      if (user.location_id === locationObject.location_id) {
        await prisma.user.update({
          where: {
            user_id: user.user_id,
          },
          data: {
            location_id: null,
          },
        });
      }

      await prisma.event_chain.deleteMany({
        where: { world_id: locationObject.location_id },
      });

      await prisma.event_faction.deleteMany({
        where: { world_id: locationObject.location_id },
      });

      await prisma.event_item.deleteMany({
        where: { world_id: locationObject.location_id },
      });

      await prisma.event_location.deleteMany({
        where: { world_id: locationObject.location_id },
      });

      await prisma.event_sentient.deleteMany({
        where: { world_id: locationObject.location_id },
      });

      await prisma.event.deleteMany({
        where: { world_id: locationObject.location_id },
      });

      await prisma.faction_membership.deleteMany({
        where: { world_id: locationObject.location_id },
      });

      await prisma.faction.deleteMany({
        where: { world_id: locationObject.location_id },
      });

      await prisma.item.deleteMany({
        where: { world_id: locationObject.location_id },
      });

      await prisma.location.deleteMany({
        where: { world_id: locationObject.location_id },
      });

      await prisma.sentient.deleteMany({
        where: { world_id: locationObject.location_id },
      });

      await prisma.world_user.deleteMany({
        where: { world_id: locationObject.location_id },
      });

      await prisma.location.deleteMany({
        where: { location_id: locationObject.location_id },
      });

      res.status(200).json({
        message: `World ${location_name} deleted`,
        deletedWorldId: locationObject.location_id,
      });
    } catch (err) {
      res.status(400).json(err);
    }
  }
}
