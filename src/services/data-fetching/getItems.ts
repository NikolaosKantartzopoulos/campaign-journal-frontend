import { getAllItemsClient } from "@/clients/Items/itemsClient";
import logger from "@/logger/*";

export async function getAllItemsService({ world_id }: { world_id: number }) {
  try {
    const allItems = await getAllItemsClient({ world_id });
    console.log(allItems);
  } catch (err) {
    logger.error(`[Items service]: getAllItemsService`);
  }
}
