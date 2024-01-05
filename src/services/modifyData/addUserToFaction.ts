import { prisma } from "../../../prisma/prisma";

export async function addUserToFaction(faction_id: number, user_id: number) {
  try {
    const data = await prisma.faction_membership.create({
      data: {
        faction_id: faction_id,
        user_id: user_id,
      },
    });
    return data
  } catch (err) {}
}
