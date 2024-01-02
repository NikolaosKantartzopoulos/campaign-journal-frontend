import { location } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";

export function getAllWorldsWhereUserIsGameMaster(user_id: number) {
  return prisma.location.findMany({
    where: {
      game_master: user_id,
      location_scale: "World",
    },
  });
}

export function getAllWorlds() {
  return prisma.location.findMany({
    where: {
      location_scale: "World",
    },
  });
}

export async function getAllWorldsThatUserHasAccess(
  user_id: number
): Promise<location[]> {
  // SELECT * FROM user
  // join world_user w using(user_id)
  // join location l on l.location_id = w.location_id
  // where user.user_id = 0;
  const data = await prisma.user.findUnique({
    where: {
      user_id: user_id, // Replace with the desired user_id
    },
    include: {
      world_user: {
        select: {
          location: true,
        },
      },
    },
  });
  const locationsData = data?.world_user || [];
  const locations = locationsData.map((el) => el.location);
  return locations || [];
}
