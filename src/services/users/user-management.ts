import { user } from "@prisma/client";
import logger from "../../../logger";
import { prisma } from "../../../prisma/prisma";
import {
  updateUserName,
  updateUserNameAndUserPassword,
  updateUserPassword,
} from "@/clients/sentient/users/userDataClient";

export async function checkIfUserNameIsUnique({
  user_name,
}: {
  user_name: string;
}) {
  const allUsers = await prisma.user.findMany({
    where: {
      user_name: user_name,
    },
  });

  if (allUsers.length) {
    logger.error("[user-management API]: user_name exists");
    throw new Error("Username exists");
  }
  return true;
}

export async function editUsersCredentials({
  user_id,
  enableEditUserName,
  enablePasswordChange,
  user_name,
  user_password,
}: {
  enablePasswordChange: string;
  user_id: number;
  user_password: string;
  enableEditUserName: string;
  user_name: string;
}): Promise<user | undefined> {
  let userRetrieved: user;
  try {
    if (enablePasswordChange) {
      userRetrieved = await updateUserPassword({
        user_id: user_id,
        user_password: user_password,
      });
    } else if (enableEditUserName) {
      userRetrieved = await updateUserName({
        user_id: user_id,
        user_name: user_name,
      });
    } else {
      userRetrieved = await updateUserNameAndUserPassword({
        user_id: user_id,
        user_name: user_name,
        user_password: user_password,
      });
    }
    console.log(userRetrieved);
    return userRetrieved;
  } catch (err) {
    logger.error(err);
  }
}
