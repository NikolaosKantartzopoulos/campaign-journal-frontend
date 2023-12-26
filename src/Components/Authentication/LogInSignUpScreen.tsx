import { Box, Button, TextField } from "@mui/material";
import { AxiosResponse } from "axios";
import { GetServerSideProps } from "next";
import { useContext, useState } from "react";
import { toastMessage } from "../CustomComponents/Toastify/Toast";
import UserContext from "@/Context/UserContext";
import { UserControlScreenBox } from "./AuthenticationCSS";
import { useRouter } from "next/router";

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
      const res = await userCtx?.loginUser(userName, userPassword);
      const text = res?.data?.text || "Logged in";
      toastMessage(text, "success");
      router.push("/");
    } catch (e) {
      toastMessage("There was an error", "error");
    }
  }
  async function handleSignUp() {
    try {
      const { data } = (await userCtx?.createUser(
        userName,
        userPassword
      )) as AxiosResponse;
      const text = data?.text || "Signed up";
      toastMessage(text, "success");
      router.push("/");
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
