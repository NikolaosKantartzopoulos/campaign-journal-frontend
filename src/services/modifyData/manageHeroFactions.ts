import { faction, location } from "@prisma/client";
import logger from "@/logger/*";
import { prisma } from "../../../prisma/prisma";

export async function addUserToFaction(
  faction_id: number,
  user_id: number,
  world_id: number
) {
  try {
    const data = await prisma.faction_membership.create({
      data: {
        faction_id: faction_id,
        user_id: user_id,
        world_id: world_id,
      },
    });
    return data;
  } catch (err) {
    logger.error(err);
  }
}

export async function deleteUserFromFaction(
  faction_id: number,
  user_id: number
) {
  try {
    const data = await prisma.faction_membership.deleteMany({
      where: {
        faction_id: faction_id,
        user_id: user_id,
      },
    });
    return data;
  } catch (err) {
    logger.error(err);
  }
}

export async function deleteHeroFaction({
  selectedWorld,
  factionToBeDeleted,
}: {
  selectedWorld: location;
  factionToBeDeleted: faction;
}) {
  try {
    await prisma.faction_membership.deleteMany({
      where: {
        faction_id: factionToBeDeleted.faction_id,
        world_id: selectedWorld.location_id,
      },
    });

    const data = await prisma.faction.delete({
      where: {
        faction_id: factionToBeDeleted.faction_id,
      },
    });
    return data;
  } catch (err) {
    logger.error(err);
  }
}
// export async function renameHeroFaction () {
//   // check that new name does not exist

//   // update the entry
// }
