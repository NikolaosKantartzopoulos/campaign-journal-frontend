import { sentient } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";
import logger from "../../../logger";

export async function createSentient({
  first_name,
  last_name,
  race_name,
  short_title,
  world_id,
}: {
  first_name: string;
  last_name: string;
  race_name: string;
  short_title: string;
  world_id: number;
}): Promise<sentient | undefined> {
  try {
    const newlyCreatedSentient = await prisma.sentient.create({
      data: {
        first_name: first_name,
        last_name: last_name,
        race_name: race_name,
        short_title: short_title,
        world_id: world_id,
      },
    });

    if (!newlyCreatedSentient) {
      throw Error("Sentient was not created");
    }
    return newlyCreatedSentient;
  } catch (err) {
    logger.error(err);
  }
}

export async function addProfileImageToSentient({
  sentient_id,
}: {
  sentient_id: number;
}) {
  try {
    const newlyCreatedSentient = await prisma.sentient.updateMany({
      where: {
        sentient_id: sentient_id,
      },
      data: {
        profile_image_path: true,
      },
    });

    if (!newlyCreatedSentient) {
      throw Error("Sentient was not created");
    }
    return true;
  } catch (err) {
    logger.error(err);
  }
}
