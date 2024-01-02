import axios, { AxiosResponse } from "axios";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { user } from "@prisma/client";

export interface UserContextInterface {
  user: user | null;
  showUserControlScreen: boolean;
  setShowUserControlScreen: Dispatch<SetStateAction<boolean>>;
  // logoutUser: () => void;
  createUser: (
    user_name: string,
    user_password: string
  ) => Promise<AxiosResponse<user, null>>;
  // loginUser: (
  //   user_name: string,
  //   user_password: string
  // ) => Promise<AxiosResponse<UserManagementApiResponse, null>>;
  editUser: (
    user_id: number,
    user_name: string,
    newUser_name: string,
    newUser_passwordField: string,
    enableEditUserName: boolean,
    enablePasswordChange: boolean
  ) => Promise<AxiosResponse<null, null>>;
  setUser: Dispatch<SetStateAction<user | null>>;
}

const UserContext = createContext<UserContextInterface | null>(null);

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<user | null>(null);
  const [showUserControlScreen, setShowUserControlScreen] =
    useState<boolean>(false);

  async function createUser(user_name: string, user_password: string) {
    const res: AxiosResponse = await axios.post("/api/user-management", {
      user_name,
      user_password,
    });
    return res;
  }

  async function editUser(
    user_id: number,
    user_name: string,
    newUser_name: string,
    newUser_passwordField: string,
    enableEditUserName: boolean,
    enablePasswordChange: boolean
  ) {
    const res = await axios.post("/api/user-management/edit-profile", {
      user_id,
      user_name,
      newUser_name,
      newUser_passwordField,
      enableEditUserName,
      enablePasswordChange,
    });
    if (res.statusText === "OK") {
      setUser(res.data.user);
    }
    return res;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        showUserControlScreen,
        setShowUserControlScreen,
        createUser,
        editUser,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
