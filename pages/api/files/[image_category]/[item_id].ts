import { getAPISession } from "../../../../src/utilities/functions/getServerSideSession";
import { NextApiHandler } from "next";
import {
  deleteImageFromDrive,
  readImageFromDrive,
  saveFile,
} from "@/utilities/formidable";
import logger from "@/logger/*";
import { addProfileImageToSentient } from "@/services/modifyData/sentients";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler: NextApiHandler = async (req, res) => {
  try {
    const { user } = await getAPISession(req, res);
    if (!user || !user?.location_id || !req.query.image_category) {
      res.status(401);
      return;
    }

    switch (req.method) {
      case "POST":
        logger.info(
          `Saving image in ${req.query.image_category} with id ${req.query.item_id}`
        );
        await saveFile(
          req,
          true,
          req.query.image_category as string,
          `${user.location_id}_${req.query.item_id}`
        );

        res.json({ done: "ok" });
        return;
      case "GET":
        const image = await readImageFromDrive();
        res.setHeader("Content-Type", "image/jpg");
        res.status(200).send(image);
        return;

      case "DELETE":
        logger.info(
          `Deleting image in ${req.query.image_category} with id ${req.query.item_id}`
        );
        await deleteImageFromDrive(
          req.query.image_category as string,
          `${user.location_id}_${req.query.item_id}`
        );
        res.status(200).json({ message: "Image deleted" });
        return;
      default:
        res.status(400);
    }
  } catch (err) {
    logger.error(err);
  }
};

export default handler;
