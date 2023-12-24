import { NextApiRequest, NextApiResponse } from "next";
import { databaseConnect } from "../../../src/utilities/databaseConnect";
import { Sentient } from "../../../src/utilities/interfaces/main";

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const connection = await databaseConnect();
    try {
      const [rows] = await connection.execute("SELECT * FROM sentients");

      console.log(rows);
      if (req.method === "GET") {
        return res.json(rows as Sentient[]);
      }
    } finally {
      connection.end();
    }
    return res.status(400);
  }
}
