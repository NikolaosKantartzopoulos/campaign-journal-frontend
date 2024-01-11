import { NextApiRequest, NextApiResponse } from "next";
import { user } from "@prisma/client";
import {
  checkIfUsernameExists,
  editUsersCredentials,
} from "@/services/users/user-management";

export interface UserManagementApiResponse {
  text: string;
  user: user;
}

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // edit user's username / password or both

    const {
      user_id,
      newUser_name,
      newUser_passwordField,
      enableEditUserName,
      enablePasswordChange,
    } = req.body;

    const usernameIsUnique = await checkIfUsernameExists({
      user_name: newUser_name,
    });

    if (!usernameIsUnique) {
      res.status(400).json({ text: "Username exists" });
      return;
    }
    try {
      const userRetrieved = await editUsersCredentials({
        user_id: user_id,
        enableEditUserName: enableEditUserName,
        enablePasswordChange: enablePasswordChange,
        user_name: newUser_name,
        user_password: newUser_passwordField,
      });
      if (!userRetrieved) {
        res.status(400);
        return;
      }
      const user: user = {
        user_name: userRetrieved.user_name,
        user_id: userRetrieved.user_id,
        user_password: userRetrieved.user_password || "",
        location_id: userRetrieved.location_id,
        sentient_id: userRetrieved.sentient_id,
      };

      res.status(200).json({ text: "Logged in successfully", user });
    } catch (e) {
      res.status(400).json("Error. Please try again.");
    }

    res.status(500);
  }
}
