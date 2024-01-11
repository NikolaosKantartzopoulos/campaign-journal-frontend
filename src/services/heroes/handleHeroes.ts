import { sentient, user } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";
import logger from "../../../logger";

export async function addExistingSentientToUsersVanguard(
  sentient: sentient,
  user: user
) {
  try {
    if (!user) {
      logger.error("No user in addExistingSentientToUsersVanguard");
      return;
    }
    if (!user.location_id) {
      logger.error(
        "No world location_id in addExistingSentientToUsersVanguard"
      );
      return;
    }
    await prisma.user_sentient.create({
      data: {
        user_id: user?.user_id,
        sentient_id: sentient.sentient_id,
        world_id: user?.location_id,
      },
    });
  } catch (err) {
    logger.error(err);
  }
}

// export async function createAndAddSentientToUsersVanguard(
//   _sentient: sentient,
//   _user: user
// ) {}

export async function getAllSentientsNotInUsersVanguard({
  world_id,
  user_id,
}: {
  world_id: number;
  user_id: number;
}) {
  return (await prisma.$queryRaw`SELECT *
    FROM sentient
    WHERE sentient_id NOT IN (
        SELECT s.sentient_id
        FROM sentient s
        JOIN user_sentient us ON s.sentient_id = us.sentient_id
        JOIN user u ON us.user_id = u.user_id
        WHERE u.user_id = ${user_id} AND us.world_id = ${world_id}
    )`) as sentient[];
}

export async function getAllSentientsInUsersVanguard({
  world_id,
  user_id,
}: {
  world_id: number;
  user_id: number;
}) {
  return (await prisma.$queryRaw`SELECT *
    FROM sentient
    WHERE sentient_id IN (
        SELECT s.sentient_id
        FROM sentient s
        JOIN user_sentient us ON s.sentient_id = us.sentient_id
        JOIN user u ON us.user_id = u.user_id
        WHERE u.user_id = ${user_id} AND us.world_id = ${world_id}
    )`) as sentient[];
}
