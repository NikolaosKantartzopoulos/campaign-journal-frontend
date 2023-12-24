import axios, { AxiosResponse } from "axios";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { UserManagementApiResponse } from "../../pages/api/user-management";
import { useRouter } from "next/router";

export interface User {
  userId: number;
  userName: string;
  userPassword: string;
  userEmail?: string;
  userRole?: string;
}

export interface UserContext {
  user: User | null;
  showUserControlScreen: boolean;
  setShowUserControlScreen: Dispatch<SetStateAction<boolean>>;
  logoutUser: () => void;
  createUser: (
    userName: string,
    userPassword: string
  ) => Promise<AxiosResponse<any, any>>;
  loginUser: (
    userName: string,
    userPassword: string
  ) => Promise<AxiosResponse<any, any>>;
  editUser: (
    userId: number,
    userName: string,
    newUserName: string,
    newPasswordField: string
  ) => Promise<AxiosResponse<any, any>>;
}

const UserContext = createContext<UserContext | null>(null);

export function UserContextProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showUserControlScreen, setShowUserControlScreen] =
    useState<boolean>(false);

  async function logoutUser() {
    setUser(null);
    localStorage.removeItem("user");
    router.replace("/account-access");
  }

  async function createUser(userName: string, userPassword: string) {
    const res: AxiosResponse = await axios.post("/api/user-management", {
      userName,
      userPassword,
    });
    return res;
  }

  async function loginUser(userName: string, userPassword: string) {
    const res: AxiosResponse<UserManagementApiResponse> = await axios.put(
      "/api/user-management",
      {
        userName,
        userPassword,
      }
    );
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    setShowUserControlScreen(false);
    return res;
  }

  async function editUser(
    userId: number,
    userName: string,
    newUserName: string,
    newPasswordField: string
  ) {
    const res = await axios.post("/api/user-management/edit-profile", {
      userId,
      userName,
      newUserName,
      newPasswordField,
    });
    if (res.statusText === "OK") {
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        showUserControlScreen,
        setShowUserControlScreen,
        logoutUser,
        createUser,
        editUser,
        loginUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
