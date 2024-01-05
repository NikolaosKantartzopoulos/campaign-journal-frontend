import { sentient, user } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";

export async function addExistingSentientToUsersVanguard(
  sentient: sentient,
  user: user
) {
  try {
    await prisma.user_sentient.create({
      data: {
        user_id: user.user_id,
        sentient_id: sentient.sentient_id,
      },
    });
  } catch (err) {}
}

export async function createAndAddSentientToUsersVanguard(
  sentient: sentient,
  user: user
) {
  console.log(sentient,user)
}

export async function getAllSentientsNotInUsersVanguard(user_id: number) {
  return (await prisma.$queryRaw`SELECT *
    FROM sentient
    WHERE sentient_id NOT IN (
        SELECT s.sentient_id
        FROM sentient s
        JOIN user_sentient us ON s.sentient_id = us.sentient_id
        JOIN user u ON us.user_id = u.user_id
        WHERE u.user_id = ${user_id}
    )`) as sentient[];
}

export async function getAllSentientsInUsersVanguard(user_id: number) {
  return (await prisma.$queryRaw`SELECT *
    FROM sentient
    WHERE sentient_id IN (
        SELECT s.sentient_id
        FROM sentient s
        JOIN user_sentient us ON s.sentient_id = us.sentient_id
        JOIN user u ON us.user_id = u.user_id
        WHERE u.user_id = ${user_id}
    )`) as sentient[];
}
