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
  } catch (err) {
    console.log(err);
  }
}

export async function createAndAddSentientToUsersVanguard(
  sentient: sentient,
  user: user
) {
  console.log(sentient, user);
}
