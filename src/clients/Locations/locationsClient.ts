import { location } from "@prisma/client";
import { prisma } from "prisma/prisma";

export interface locationAndPartOfLocationIncluded extends location {
  location: location | null;
}

export async function getAllWorldsLocations(
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
