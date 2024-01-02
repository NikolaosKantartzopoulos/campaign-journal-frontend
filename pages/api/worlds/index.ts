import { Session, getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import {
  getAllWorldsWhereUserIsGameMaster,
} from "@/services/data-fetching/getWorlds";
import { authOptions } from "../auth/[...nextauth]";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    try {
      const { deleteWorldInput: location_name } = req.body;
      const session = (await getServerSession(
        req,
        res,
        authOptions
      )) as Session;

      if (!session) {
        res.status(401);
      }

      const user = session?.user;

      const allWorldsWhereUserIsGameMaster =
        await getAllWorldsWhereUserIsGameMaster(user.user_id);

      console.log(allWorldsWhereUserIsGameMaster);
      console.log(location_name);

      res.status(200).json(allWorldsWhereUserIsGameMaster);
    } catch (err) {
      console.log(err);
    }
  }
}
