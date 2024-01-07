import { Box, Button, TextField } from "@mui/material";
import { AxiosResponse } from "axios";
import { GetServerSideProps } from "next";
import { useContext, useState } from "react";
import { toastMessage } from "../CustomComponents/Toastify/Toast";
import UserContext from "@/Context/UserContext";
import { UserControlScreenBox } from "./AuthenticationCSS";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

const userInfoCSS = {
  maxWidth: "375px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "16px",
};

const LogInSignUpScreen = () => {
  const userCtx = useContext(UserContext);
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");

  async function handleLogin() {
    try {
      const [user_name, user_password] = [userName, userPassword];
      signIn(
        "credentials",
        { redirect: false },
        { user_name, user_password }
      ).then((res) => {
        if (res?.ok) {
          router.push("/");
        } else {
          toastMessage("Wrong username or password", "error");
        }
      });
    } catch (e) {
      toastMessage("There was an error", "error");
    }
  }
  async function handleSignUp() {
    if (userName === "" || userPassword === "") {
      toastMessage("Username and/or Password fields empty", "success");
      return;
    }
    try {
      const [user_name, user_password] = [userName, userPassword];
      (await userCtx?.createUser(user_name, user_password)) as AxiosResponse;
      toastMessage(
        "AccountCreated! Please log in with your new account",
        "success"
      );
      setUserName("");
      setUserPassword("");
    } catch (e) {
      toastMessage("There was an error", "error");
    }
  }

  return (
    <UserControlScreenBox>
      <Box sx={userInfoCSS}>
        <TextField
          label="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <TextField
          label="Password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        />
        <Box
          sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}
        >
          <Button variant="contained" onClick={handleLogin}>
            Login
          </Button>
          <Button variant="contained" onClick={handleSignUp}>
            Sign up
          </Button>
        </Box>
      </Box>
    </UserControlScreenBox>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default LogInSignUpScreen;
