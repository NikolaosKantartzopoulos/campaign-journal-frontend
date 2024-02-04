import { location } from "@prisma/client";
import { prisma } from "prisma/prisma";

export interface locationAndPartOfLocationIncluded extends location {
  location: location | null;
}

export async function getAllLocationsWithWorldId(
  world_id: number
): Promise<locationAndPartOfLocationIncluded[] | null> {
  return prisma.location.findMany({
    where: {
      world_id: world_id,
    },
    include: {
      location: {
        include: {
          location: true, // Include the parent location
        },
      },
    },
  });
}

export async function getUniqueLocationById(
  location_id: number
): Promise<locationAndPartOfLocationIncluded | null> {
  return prisma.location.findUnique({
    where: {
      location_id: location_id,
    },
    include: {
      location: {
        include: {
          location: true, // Include the parent location
        },
      },
    },
  });
}

export async function createNewLocationClient({
  location_name,
  location_scale,
  location_description,
  part_of,
  game_master,
  world_id,
}: {
  location_name: string;
  location_scale: "World" | "Continent" | "Kingdom" | "Province" | "Area";
  location_description: string;
  part_of: number;
  game_master: number;
  world_id: number;
}): Promise<location> {
  console.log("createNewLocationClient", {
    location_name,
    location_scale,
    location_description,
    part_of,
    game_master,
    world_id,
  });

  return prisma.location.create({
    data: {
      location_name,
      location_scale,
      location_description,
      part_of,
      game_master,
      world_id,
    },
  });
}
