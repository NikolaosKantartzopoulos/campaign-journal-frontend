import { createItemClient } from "@/clients/Items/itemsClient";
import logger from "@/logger/*";
import { item_item_state } from "@prisma/client";

export async function createItemService({
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
  world_id: number;
  item_location: number;
}) {
  try {
    await createItemClient({
      item_name,
      item_description,
      item_owner,
      item_state,
      world_id,
      item_location,
    });
  } catch (err) {
    logger.error("createItemService", err);
  }
}
