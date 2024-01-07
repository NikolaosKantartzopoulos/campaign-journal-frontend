import { faction, location } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";
import logger from "../../../logger";

export async function getWorldsHeroFactions(selectedWorld: location) {
  if (selectedWorld.location_scale !== "World") {
    throw Error("Location is not of World Scale");
  }
  try {
    const worldsHeroFactions: faction[] = await prisma.faction.findMany({
      where: {
        world_id: selectedWorld.location_id,
        is_hero_faction: true,
      },
    });

    const getHeroesSubscribedToFaction = async (faction: faction) => {
      return prisma.$queryRaw`
    SELECT user_id, user_name 
    FROM user u
    JOIN faction_membership fm USING(user_id)
    JOIN world_user wu USING(user_id)
    WHERE fm.faction_id = ${faction.faction_id} AND wu.world_id = ${selectedWorld.location_id}
  `;
    };

    const worldsHeroFactionsAndPlayers = await Promise.all(
      worldsHeroFactions.map(async (heroFaction) => {
        const usersSubscribed = await getHeroesSubscribedToFaction(heroFaction);

        const toRet = {
          faction: heroFaction,
          usersSubscribed,
        };
        return toRet;
      })
    );

    return worldsHeroFactionsAndPlayers;
  } catch (err) {
    logger.error(err);
  }
}
