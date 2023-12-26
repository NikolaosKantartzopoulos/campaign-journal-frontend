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
  if (req.method === "POST") {
    // edit user password

    const { userId, newUserName, newPasswordField } = req.body;
    let userRetrieved;

    const allUsers = await prisma.user.findMany({
      where: {
        user_name: newUserName,
      },
    });

    if (allUsers.length) {
      res.status(400).json({ text: "Username exists" });
    } else {
      try {
        if (newUserName === "") {
          userRetrieved = await prisma.user.update({
            where: {
              user_id: userId,
            },
            data: {
              user_password: newPasswordField,
            },
          });
        } else if (newPasswordField === "") {
          userRetrieved = await prisma.user.update({
            where: {
              user_id: userId,
            },
            data: {
              user_name: newUserName,
            },
          });
        } else {
          userRetrieved = await prisma.user.update({
            where: {
              user_id: userId,
            },
            data: {
              user_name: newUserName,
              user_password: newPasswordField,
            },
          });
        }

        const user: User = {
          userName: userRetrieved.user_name,
          userId: userRetrieved.user_id,
          userPassword: userRetrieved.user_password || "",
          userRole: userRetrieved.user_role || "Player",
        };

        res.status(200).json({ text: "Logged in successfully", user });
      } catch (e) {
        res.status(400).json(e);
      }
    }

    res.status(500);
  }
}
