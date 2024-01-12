import { prisma } from "../../../prisma/prisma";

export async function createUser(user_name: string, user_password: string) {
  return prisma.user.create({
    data: {
      user_name: user_name,
      user_password: user_password,
    },
  });
}
