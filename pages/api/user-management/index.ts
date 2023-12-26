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
      await prisma.user.create({
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
      const usersRetrieved = await prisma.user.findMany({
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
      res.status(400).json(e);
    }
    res.status(500);
  }

  if (req.method === "PATCH") {
    // edit user password

    const { userId, newUserName, newPasswordField } = req.body;
    let userRetrieved;
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
    res.status(500);
  }
}
