import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";
import { user } from "@prisma/client";

export interface UserManagementApiResponse {
  text: string;
  user: user;
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
    const { user_name, user_password } = req.body;
    if (!user_name) {
      res.status(400);
    }
    try {
      await prisma.user.create({
        data: {
          user_name: user_name,
          user_password: user_password,
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
    const { user_name, user_password } = req.body;
    if (!user_name) {
      res.status(400);
    }
    try {
      const usersRetrieved = await prisma.user.findMany({
        where: {
          user_name: user_name,
        },
      });

      if (!usersRetrieved) {
        res.status(400).json({ text: "This user does not exist" });
        return;
      }

      if (
        usersRetrieved &&
        usersRetrieved[0].user_password &&
        usersRetrieved[0].user_password !== user_password
      ) {
        res.status(400).json({ text: "Wrong password" });
        return;
      }
      const user: user = {
        user_name: usersRetrieved[0].user_name,
        user_id: usersRetrieved[0].user_id,
        user_password: usersRetrieved[0].user_password || "",
        user_role: usersRetrieved[0].user_role || "Player",
      };

      res.status(200).json({ text: "Logged in successfully", user });
    } catch (e) {
      res.status(400).json(e);
    }
    res.status(500);
  }

  if (req.method === "PATCH") {
    // edit user password

    const { user_id, newUserName, newPasswordField } = req.body;
    let userRetrieved;
    try {
      if (newUserName === "") {
        userRetrieved = await prisma.user.update({
          where: {
            user_id: user_id,
          },
          data: {
            user_password: newPasswordField,
          },
        });
      } else if (newPasswordField === "") {
        userRetrieved = await prisma.user.update({
          where: {
            user_id: user_id,
          },
          data: {
            user_name: newUserName,
          },
        });
      } else {
        userRetrieved = await prisma.user.update({
          where: {
            user_id: user_id,
          },
          data: {
            user_name: newUserName,
            user_password: newPasswordField,
          },
        });
      }

      const user: user = {
        user_name: userRetrieved.user_name,
        user_id: userRetrieved.user_id,
        user_password: userRetrieved.user_password || "",
        user_role: userRetrieved.user_role || "Player",
      };

      res.status(200).json({ text: "Logged in successfully", user });
    } catch (e) {
      res.status(400).json(e);
    }
    res.status(500);
  }
}
