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
  location_scale:
    | "World"
    | "Continent"
    | "Kingdom"
    | "Province"
    | "Area"
    | "Place";
  location_description: string;
  part_of: number;
  game_master: number;
  world_id: number;
}): Promise<location> {
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

export async function editLocationClient({
  location_id,
  location_name,
  location_description,
}: {
  location_name: string;
  location_id: number;
  location_description: string;
}): Promise<location> {
  return prisma.location.update({
    where: {
      location_id: location_id,
    },
    data: {
      location_name,
      location_description,
    },
  });
}

export async function deleteLocationClient({
  location_id,
}: {
  location_id: number;
}) {
  return prisma.location.deleteMany({
    where: {
      location_id: location_id,
    },
  });
}

export async function getLocationsAndParentsIdsClient({
  world_id,
}: {
  world_id: number;
}) {
  return prisma.location.findMany({
    where: {
      world_id: world_id,
    },
    select: {
      location_id: true,
      part_of: true,
      location_scale: true,
    },
  });
}
