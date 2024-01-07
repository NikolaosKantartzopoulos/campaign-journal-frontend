import logger from "../../../logger";
import { prisma } from "../../../prisma/prisma";

export async function getAllSentients() {
  try {
    return prisma.sentient.findMany();
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
