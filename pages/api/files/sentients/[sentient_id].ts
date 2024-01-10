import { getAPISession } from "./../../../../src/utilities/functions/getServerSideSession";
import { NextApiHandler } from "next";
import { readImageFromDrive, saveFile } from "@/utilities/formidable";
import logger from "../../../../logger";
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

        await addProfileImageToSentient({ sentient_id: Number(sentient_id) });
        res.json({ done: "ok" });

        break;
      case "GET":
        const image = await readImageFromDrive();
        res.setHeader("Content-Type", "image/jpg");
        res.status(200).send(image);
    }
  } catch (err) {
    logger.error(err);
  }
};

export default handler;
