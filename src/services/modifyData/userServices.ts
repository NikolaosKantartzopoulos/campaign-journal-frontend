import logger from "@/logger/*";
import { prisma } from "../../../prisma/prisma";
import { changeUsersActiveWorldClient } from "@/clients/worlds/worldsDataClient";

export async function removeUserFromWorld({
  user_id,
  location_id,
}: {
  user_id: number;
  location_id: number;
}) {
  try {
    // remove all user_sentient rows
    await prisma.user_sentient.deleteMany({ where: { user_id: user_id } });

    //faction_membership remove if world_id === location_id AND user_id = user_id
    await prisma.faction_membership.deleteMany({
      where: { world_id: location_id, user_id: user_id },
    });

    // delete world_user rows where user_id === user_id AND world_id === location_id
    await prisma.world_user.deleteMany({
      where: {
        world_id: location_id,
        user_id: user_id,
      },
    });

    //table user =>  if user(user_location_id) === location_id, select another world
    const newSelectedWorld = await prisma.world_user.findFirst({
      where: {
        user_id: user_id,
      },
    });

    await prisma.user.update({
      where: {
        user_id: user_id,
      },
      data: {
        location_id: newSelectedWorld?.world_id,
      },
    });

    return true;
  } catch (err) {
    logger.error(err);
    throw err;
  }
}

export async function changeUsersActiveWorld(
  location_id: number,
  user_id: number
) {
  try {
    const data = await changeUsersActiveWorldClient(location_id, user_id);
    return data;
  } catch (err) {
    logger.error("Change active world API", err);
    throw Error("Error while changing user's active world");
  }
}
