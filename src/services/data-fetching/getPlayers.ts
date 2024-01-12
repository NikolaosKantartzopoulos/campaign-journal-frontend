import { location, user } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";
import logger from "@/logger/*";
import { userMinimumInfo } from "@/utilities/types/heroFactionTypes";

export async function getPlayersSubscribedToWorld(
  activeWorld: location,
  personal_id: number
): Promise<userMinimumInfo[]> {
  if (!activeWorld) {
    throw Error("No active world set");
  }
  try {
    const usersSubscribedToWorld: user[] = await prisma.$queryRaw`
    select u.user_id, u.user_name 
    from user u
    join world_user wu using(user_id)
    where wu.world_id = ${activeWorld.location_id} 
  `;

    const players = usersSubscribedToWorld.filter(
      (us) => us.user_id !== personal_id
    );
    return players as userMinimumInfo[];
  } catch (err) {
    logger.error(err);
    throw err;
  }
}
