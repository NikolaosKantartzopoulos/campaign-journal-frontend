import { NextApiRequest, NextApiResponse } from "next";
import { sentient, user } from "@prisma/client";
import { addExistingSentientToUsersVanguard } from "@/services/heroes/handleHeroes";
import getSentientFullName from "@/utilities/helperFn/getSentientFullName";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    //createAndAddSentientToUsersVanguard
    // const { sentient, user }: { sentient: sentient; user: user } = req.body;

    // const sentients = await createAndAddSentientToUsersVanguard(sentient, user);
    res.status(200);
  }

  if (req.method === "PUT") {
    // addExistingSentientToUsersVanguard
    const { sentient, user }: { sentient: sentient; user: user } = req.body;
    try {
      await addExistingSentientToUsersVanguard(sentient, user);
      res.status(200).json({
        text: `Hero ${getSentientFullName(sentient)} added to ${
          user.user_name
        }'s Vanguard`,
      });
    } catch (err) {
      res.status(400);
    }
  }
}
