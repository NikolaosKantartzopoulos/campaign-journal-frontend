import { prisma } from "../../../prisma/prisma";

export async function getWorldsWhereUserIsGameMaster(user_id: number) {
  return prisma.location.findMany({
    where: {
      game_master: user_id,
    },
  });
}
