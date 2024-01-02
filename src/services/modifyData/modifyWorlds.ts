import { prisma } from "../../../prisma/prisma";

export function addWorldToUsersAvailableWorlds(
  location_id: number,
  user_id: number
) {
  return prisma.world_user.create({
    data: {
      location_id: location_id,
      user_id: user_id,
    },
  });
}

export function createWorld({
  location_description,
  location_name,
  user_id,
}: {
  location_description: string;
  location_name: string;
  user_id: number;
}) {
  return prisma.location.create({
    data: {
      location_scale: "World",
      location_name: location_name,
      location_description: location_description,
      game_master: user_id,
    },
  });
}
