import { getAPISession } from "@/utilities/functions/getServerSideSession";
import { NextApiRequest, NextApiResponse } from "next";
import { renameWorld } from "@/services/modifyData/modifyWorlds";
import logger from "../../../logger";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PATCH") {
    res.status(400);
    return;
  }
  const { user } = await getAPISession(req, res);

  if (!user) {
    res.status(401);
    return;
  }

  if (!user.selectedWorld) {
    res.status(400);
    return;
  }

  try {
    const updatedWorldVersion = await renameWorld(
      req.body.newLocationName,
      user?.selectedWorld
    );
    res
      .status(200)
      .json({ message: "Name successfully updated", updatedWorldVersion });
  } catch (err) {
    logger.error(err);
    res.status(400);
  }
}
