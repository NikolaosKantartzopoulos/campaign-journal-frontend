import { prisma } from "../../../prisma/prisma";

export async function addUserToFaction(faction_id: number, user_id: number) {
  try {
    console.log(faction_id, user_id);
    const data = await prisma.faction_membership.create({
      data: {
        faction_id: faction_id,
        user_id: user_id,
      },
    });
    console.log(data);
    return data;
  } catch (err) {}
}

export async function deleteUserFromFaction(
  faction_id: number,
  user_id: number
) {
  try {
    const data = await prisma.faction_membership.deleteMany({
      where: {
        faction_id: faction_id,
        user_id: user_id,
      },
    });
    return data;
  } catch (err) {}
}

// export async function renameHeroFaction () {
//   // check that new name does not exist

//   // update the entry
// }
