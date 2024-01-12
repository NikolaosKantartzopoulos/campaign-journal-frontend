import { NextApiRequest, NextApiResponse } from "next";
import { user } from "@prisma/client";
import {
  checkIfUserNameIsUnique,
  createUserService,
  editUsersCredentials,
} from "@/services/users/user-management";
import { getAPISession } from "@/utilities/functions/getServerSideSession";

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
      await createUserService(user_name, user_password);

      res.status(200).json({ text: "User created" });
    } catch (e) {
      res.status(400).json({ message: "There was an error" });
    }
  }

  if (req.method === "PATCH") {
    // edit user's username / password or both
    const { user } = await getAPISession(req, res);
    if (!user) {
      res.status(401);
      return;
    }
    const {
      newUser_name,
      newUser_passwordField,
      enableEditUserName,
      enablePasswordChange,
    } = req.body;

    const usernameIsUnique = await checkIfUserNameIsUnique({
      user_name: newUser_name,
    });

    if (!usernameIsUnique) {
      res.status(400).json({ text: "Username exists" });
      return;
    }
    try {
      const userRetrieved = await editUsersCredentials({
        user_id: user?.user_id,
        enableEditUserName: enableEditUserName,
        enablePasswordChange: enablePasswordChange,
        user_name: newUser_name,
        user_password: newUser_passwordField,
      });
      if (!userRetrieved) {
        res.status(400);
        return;
      }

      res.status(200).json({ text: "Logged in successfully", userRetrieved });
    } catch (e) {
      res.status(400).json("Error. Please try again.");
    }

    res.status(500);
  }
}
