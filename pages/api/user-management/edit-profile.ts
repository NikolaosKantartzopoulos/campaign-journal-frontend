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
  if (req.method === "POST") {
    // edit user password

    const {
      user_id,
      newUser_name,
      newUser_passwordField,
      enableEditUserName,
      enablePasswordChange,
    } = req.body;
    let userRetrieved;

    const allUsers = await prisma.user.findMany({
      where: {
        user_name: newUser_name,
      },
    });

    if (allUsers.length) {
      res.status(400).json({ text: "Username exists" });
    } else {
      try {
        if (enablePasswordChange) {
          userRetrieved = await prisma.user.update({
            where: {
              user_id: user_id,
            },
            data: {
              user_password: newUser_passwordField,
            },
          });
        } else if (enableEditUserName) {
          userRetrieved = await prisma.user.update({
            where: {
              user_id: user_id,
            },
            data: {
              user_name: newUser_name,
            },
          });
        } else {
          userRetrieved = await prisma.user.update({
            where: {
              user_id: user_id,
            },
            data: {
              user_name: newUser_name,
              user_password: newUser_passwordField,
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
    }

    res.status(500);
  }
}
