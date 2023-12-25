import { sentient } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";

export async function getAllSentients() {
  return prisma.sentient.findMany();
}

export async function getUniqueSentientById(sentient_id: number) {
  return prisma.sentient.findUnique({
    where: {
      sentient_id: sentient_id,
    },
  });
}
