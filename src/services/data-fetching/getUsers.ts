import { prisma } from "../../../prisma/prisma";

export async function getAllUsers() {
  return prisma.user.findMany();
}

export async function getAllUsernames() {
  return prisma.user.findMany({
    select: {
      user_id: true,
      user_name: true,
    },
  });
}

// export async function getUserActiveSentient(
//   userId: number
// ): Promise<sentient | undefined> {
//   //   select s.first_name, s.last_name, s.birth_date, s.heroes_team_name, s.short_title, s.state, s.world_id, s.race_name from user
//   // join sentient s using(sentient_id)
//   // where user_id = 2;
//   try {
//     const sentient = await prisma.$queryRaw`
//       SELECT s.first_name, s.last_name, s.birth_date, s.heroes_team_name, s.short_title, s.state, s.world_id, s.race_name
//       FROM user
//       JOIN sentient s USING (sentient_id)
//       WHERE user_id = ${userId};
//     `;

//     return sentient;
//   } catch (error) {
//     console.error("Error:", error);
//     throw new Error("Failed to fetch user sentient details");
//   }
// }

// export async function getUserActiveWorld(
//   userId: number
// ): Promise<location | null> {
//   //   select l.location_id, l.location_scale, l.part_of, l.location_description, l.game_master, l.location_name from user u
//   // join location l using(location_id)
//   // where user_id = 0;
//   try {
//     const location = await prisma.$queryRaw`
//       SELECT l.location_id, l.location_scale, l.part_of, l.location_description, l.game_master, l.location_name
//       FROM user u
//       JOIN location l USING (location_id)
//       WHERE user_id = ${userId};
//     `;
//     console.log(location);
//     return location;
//   } catch (error) {
//     console.error("Error:", error);
//     throw new Error("Failed to fetch location details for user");
//   }
// }
