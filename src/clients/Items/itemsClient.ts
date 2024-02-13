import { item_item_state } from "@prisma/client";
import { prisma } from "prisma/prisma";

export async function getAllItemsClient({ world_id }: { world_id: number }) {
  return prisma.$queryRaw`
    SELECT 
        *
    FROM
        item i
            LEFT JOIN
        sentient s ON i.item_owner = s.sentient_id
            LEFT JOIN
        location l ON i.item_location = l.location_id
    WHERE
        i.world_id = ${world_id}
`;
}

export async function createItemClient({
  item_name,
  item_description,
  item_owner,
  item_state,
  item_location,
  world_id,
}: {
  item_name: string;
  item_description: string;
  item_owner: number;
  item_state: item_item_state;
  item_location: number;
  world_id: number;
}) {
  return prisma.item.create({
    data: {
      item_name,
      item_description,
      item_owner,
      item_state,
      item_location,
      world_id,
    },
  });
}
