import logger from "../../../logger";
import { prisma } from "../../../prisma/prisma";

export async function getAllSentients({ world_id }: { world_id: number }) {
  if (!world_id) {
    logger.error("getAllSentients missing world_id");
    throw Error("getAllSentients missing world_id");
  }
  try {
    return prisma.sentient.findMany({
      where: {
        world_id: world_id,
      },
      orderBy: {
        first_name: "asc",
      },
    });
  } catch (err) {
    logger.error(err);
  }
}

export async function getUniqueSentientById(sentient_id: number) {
  try {
    return prisma.sentient.findUnique({
      where: {
        sentient_id: sentient_id,
      },
    });
  } catch (err) {
    logger.error(err);
  }
}
