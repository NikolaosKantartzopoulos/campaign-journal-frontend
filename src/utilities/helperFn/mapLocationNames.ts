import { location } from "@prisma/client";

export const mapLocationNames = (location: location) => location.location_name;
