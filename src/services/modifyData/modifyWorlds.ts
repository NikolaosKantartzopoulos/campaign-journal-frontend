import { location } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";
import { getAllWorlds } from "../data-fetching/getWorlds";
import logger from "../../../logger";

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

export async function renameWorld(
  newLocationName: string,
  selectedWorld: location
) {
  try {
    if (!newLocationName || !selectedWorld) {
      throw new Error("missing arguments in renameWorld");
    }
    if (selectedWorld.location_scale !== "World")
      throw Error("Location's scale is not world");

    // check if world to be updated exists and is up to date
    const existingWorld = await prisma.location.findFirst({
      where: {
        location_name: selectedWorld.location_name,
      },
    });

    if (!existingWorld) {
      throw Error(`No world named ${newLocationName} exists`);
    }

    // check if new world name exists
    const newNameIsAvailable = await checkThatNewNameIsAvailable(
      newLocationName
    );

    if (!newNameIsAvailable) {
      throw Error("Name submitted is not available");
    }
    // update the entry

    const data = await prisma.location.update({
      where: { location_id: selectedWorld.location_id },
      data: {
        location_name: newLocationName,
      },
    });

    return data;
  } catch (err) {
    logger.error(err);
  }
}

export async function checkThatNewNameIsAvailable(location_name: string) {
  const allWorlds = await getAllWorlds();
  const allWorldsNames = allWorlds.map((el) => el.location_name);
  if (allWorldsNames.includes(location_name)) {
    return false;
  }
  return true;
}
