import { NextApiRequest, NextApiResponse } from "next";
import logger from "../../../logger";
import { getAPISession } from "@/utilities/functions/getServerSideSession";
import { removeUserFromWorld } from "@/services/modifyData/userServices";
import { userMinimumInfo } from "@/utilities/types/heroFactionTypes";
import { isUserGameMaster } from "@/utilities/helperFn/isUserGameMaster";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { user, session } = await getAPISession(req, res);

    if (!user) {
      res.status(401);
      return;
    }

    if (!user.selectedWorld) {
      res.status(400);
      return;
    }

    const isWorldGameMaster = isUserGameMaster(session);

    if (!isWorldGameMaster) {
      res.status(401).json({ message: "You do not own this world." });
      return;
    }

    try {
      const { userToBeDeleted }: { userToBeDeleted: userMinimumInfo } =
        req.body;

      await removeUserFromWorld({
        user_id: userToBeDeleted.user_id,
        location_id: Number(user.selectedWorld?.location_id),
      });

      res.status(200).json({ message: `${userToBeDeleted.user_name} removed` });
    } catch (err) {
      logger.error(err);
      res.status(400).json(err);
    }
  }
}
