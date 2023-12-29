import { user } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";

export function getAllWorlds(user: user) {
  return prisma.location.findMany({
    where: {
      game_master: user.user_id,
    },
  });
}
