import { sentients } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";

export async function getAllSentients() {
  return prisma.sentients.findMany();
}

export async function getUniqueSentient(sentient_id: number) {
  return prisma.sentients.findUnique({
    where: {
      sentient_id: sentient_id,
    },
  });
}
