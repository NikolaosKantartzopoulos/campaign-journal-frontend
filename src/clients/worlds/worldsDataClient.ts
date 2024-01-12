import { prisma } from "../../../prisma/prisma";

export async function getWorldsWhereUserIsGameMaster(user_id: number) {
  return prisma.location.findMany({
    where: {
      game_master: user_id,
    },
  });
}

export async function changeUsersActiveWorldClient(
  user_id: number,
  location_id: number
) {
  return prisma.user.update({
    where: {
      user_id: user_id,
    },
    data: {
      location_id: location_id,
    },
  });
}
