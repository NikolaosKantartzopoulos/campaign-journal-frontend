import { NextApiRequest, NextApiResponse } from "next";
import { databaseConnect } from "../../../utilities/databaseConnect";
import { Sentient } from "../../../utilities/interfaces/main";

export default async function apiHandler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		case "GET":
			res.status(500);
			break;
		case "POST":
			// create user
			res.status(500);
			break;
		case "PUT":
			// login user
			res.status(500);
			break;
		case "PATCH":
			// edit user
			res.status(500);
			break;
	}

	if (req.method === "GET") {
		const connection = await databaseConnect();
		try {
			const [rows, fields] = await connection.execute(
				"SELECT * FROM sentients"
			);

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
