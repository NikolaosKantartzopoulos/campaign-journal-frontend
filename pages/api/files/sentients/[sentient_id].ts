import { getAPISession } from "./../../../../src/utilities/functions/getServerSideSession";
import { NextApiHandler } from "next";
import { saveFile } from "@/utilities/formidable";
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
    await saveFile(
      req,
      true,
      "characters",
      `${user.location_id}_${sentient_id}`
    );

    await addProfileImageToSentient({ sentient_id: Number(sentient_id) });

    res.json({ done: "ok" });
  } catch (err) {
    logger.error(err);
  }
};

export default handler;
