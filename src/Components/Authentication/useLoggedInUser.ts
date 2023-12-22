import UserContext, { User } from "@/Context/UserContext";
import { useContext, useEffect } from "react";

export async function useLoggedInUser() {
  const userCtx = useContext(UserContext);

  useEffect(() => {
    const localStorageUser: User | null = JSON.parse(
      localStorage.getItem("user") as string
    );
    if (localStorageUser) {
      userCtx?.loginUser(
        localStorageUser.userName,
        localStorageUser.userPassword
      );
    }
  });

  return userCtx;
}
