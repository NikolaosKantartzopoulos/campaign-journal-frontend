import { sentient } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";
import logger from "@/logger/*";

export async function createSentient({
  first_name,
  last_name,
  race_name,
  short_title,
  world_id,
  state = "alive",
  sentient_description,
}: {
  first_name: string;
  last_name: string;
  race_name: string;
  short_title: string;
  world_id: number;
  state?: "alive" | "dead" | "undead" | "missing";
  sentient_description: string;
}): Promise<sentient | undefined> {
  try {
    const newlyCreatedSentient = await prisma.sentient.create({
      data: {
        first_name: first_name,
        last_name: last_name,
        race_name: race_name,
        short_title: short_title,
        world_id: world_id,
        state: state,
        sentient_description: sentient_description,
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

export async function updateSentient({
  sentient_id,
  first_name,
  last_name,
  race_name,
  short_title,
  world_id,
  state = "alive",
  sentient_description,
}: {
  sentient_id: number;
  first_name: string;
  last_name: string;
  race_name: string;
  short_title: string;
  world_id: number;
  state?: "alive" | "dead" | "undead" | "missing";
  sentient_description: string;
}): Promise<sentient | undefined> {
  try {
    const newlyCreatedSentient = await prisma.sentient.update({
      where: {
        sentient_id: sentient_id,
      },
      data: {
        first_name: first_name,
        last_name: last_name,
        race_name: race_name,
        short_title: short_title,
        world_id: world_id,
        sentient_description: sentient_description,
        state: state,
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

export async function deleteSentient({
  sentient_id,
}: {
  sentient_id: number;
}): Promise<sentient | undefined> {
  try {
    const deletedSentient = await prisma.sentient.delete({
      where: {
        sentient_id: sentient_id,
      },
    });

    if (!deletedSentient) {
      throw Error("Sentient was not created");
    }
    return deletedSentient;
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
