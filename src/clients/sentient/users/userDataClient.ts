import { prisma } from "../../../../prisma/prisma";

export async function updateUserPassword({
  user_id,
  user_password,
}: {
  user_id: number;
  user_password: string;
}) {
  return prisma.user.update({
    where: {
      user_id: user_id,
    },
    data: {
      user_password: user_password,
    },
  });
}

export async function updateUserName({
  user_id,
  user_name,
}: {
  user_id: number;
  user_name: string;
}) {
  return prisma.user.update({
    where: {
      user_id: user_id,
    },
    data: {
      user_name: user_name,
    },
  });
}

export async function updateUserNameAndUserPassword({
  user_id,
  user_name,
  user_password,
}: {
  user_id: number;
  user_name: string;
  user_password: string;
}) {
  return prisma.user.update({
    where: {
      user_id: user_id,
    },
    data: {
      user_name: user_name,
      user_password: user_password,
    },
  });
}
