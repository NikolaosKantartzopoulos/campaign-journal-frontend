import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";
import { User } from "@/Context/UserContext";

export interface UserManagementApiResponse {
	text: string;
	user: User;
}

export default async function apiHandler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "GET") {
		res.status(500);
	}

	if (req.method === "POST") {
		// create user
		const { userName, userPassword } = req.body;
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
	}

	if (req.method === "PUT") {
		// login user
		const { userName, userPassword } = req.body;
		if (!userName) {
			res.status(400);
		}
		try {
			const usersRetrieved = await prisma.users.findMany({
				where: {
					user_name: userName,
				},
			});

			if (!usersRetrieved) {
				res.status(400).json({ text: "This user does not exist" });
			}

			if (usersRetrieved && usersRetrieved[0].user_password !== userPassword) {
				res.status(400).json({ text: "Wrong password" });
			}

			const user: User = {
				userName: usersRetrieved[0].user_name,
				userId: usersRetrieved[0].user_id,
				userPassword: usersRetrieved[0].user_password || "",
				userRole: usersRetrieved[0].user_role || "Player",
			};

			res.status(200).json({ text: "Logged in successfully", user });
		} catch (e) {
			res.status(400).json({ text: "There was an error" });
		}
		res.status(500);
	}

	if (req.method === "PATCH") {
		// edit user
		res.status(500);
	}

	return res.status(500);
}
