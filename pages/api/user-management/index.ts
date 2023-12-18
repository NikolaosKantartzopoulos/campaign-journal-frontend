import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";

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
			const { userName, userPassword } = req.body;
			console.log(userName);
			if (!userName) {
				res.status(400);
			}
			try {
				const user = await prisma.users.create({
					data: {
						user_name: userName,
						user_password: userPassword,
						user_role: "Player",
					},
				});

				res.status(200).json({ text: "User created" });
			} catch (e) {
				res.status(400).json({ text: "There was an error" });
			}

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

	return res.status(500);
}
