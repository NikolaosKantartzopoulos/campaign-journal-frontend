import { NextApiRequest, NextApiResponse } from "next";
import { getAllWorlds } from "@/services/data-fetching/getWorlds";
import {
  addWorldToUsersAvailableWorlds,
  createWorld,
} from "@/services/modifyData/modifyWorlds";
import { getAPISession } from "@/utilities/functions/getServerSideSession";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { user } = await getAPISession(req, res);

    const {
      location_name,
      location_description,
    }: { location_name: string; location_description: string } = req.body;

    const allWorlds = await getAllWorlds();
    const allWorldsNames = allWorlds.map((el) => el.location_name);
    if (allWorldsNames.includes(location_name)) {
      res.status(403).json({ error: "World name already exists" });
      return;
    }

    try {
      const data = await createWorld({
        location_name: location_name,
        location_description: location_description,
        user_id: Number(req.query.user_id),
      });

      await addWorldToUsersAvailableWorlds(data.location_id, user?.user_id);
      res.status(200).json(data);
    } catch (err) {}
  }
}
