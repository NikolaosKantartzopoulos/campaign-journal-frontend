import { sentient } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";

export async function getSentientById(
  sentient_id: number
): Promise<sentient | null> {
  return prisma.sentient.findUnique({ where: { sentient_id: sentient_id } });
}
