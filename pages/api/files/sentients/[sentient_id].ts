import { getAPISession } from "./../../../../src/utilities/functions/getServerSideSession";
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
    if (!user || !user?.location_id) {
      res.status(401);
      return;
    }
    const { sentient_id } = req.query;
    switch (req.method) {
      case "POST":
        await saveFile(
          req,
          true,
          "characters",
          `${user.location_id}_${sentient_id}`
        );
        await addProfileImageToSentient({
          sentient_id: Number(sentient_id),
        });

        res.json({ done: "ok" });
        return;
      case "GET":
        const image = await readImageFromDrive();
        res.setHeader("Content-Type", "image/jpg");
        res.status(200).send(image);
        return;

      case "DELETE":
        console.log("first");
        await deleteImageFromDrive(
          "characters",
          `${user.location_id}_${sentient_id}`
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
