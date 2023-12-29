import UserContext from "@/Context/UserContext";
import { Button, Divider, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { FlexBox } from "../CustomComponents/FlexBox";
import { AxiosError } from "axios";
import { toastMessage } from "../CustomComponents/Toastify/Toast";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

const AccountEditScreen = () => {
  const userCtx = useContext(UserContext);
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const [newPasswordField, setNewPasswordField] = useState<string>("");
  const [newUserName, setNewUserName] = useState<string>("");
  const [enableEditUserName, setEnableEditUserName] = useState<boolean>(false);
  const [enablePasswordChange, setEnablePasswordChange] =
    useState<boolean>(false);

  async function handleChangeInformation() {
    if (enableEditUserName && newUserName === "") {
      toastMessage("The username field can not be empty", "error");
    }
    try {
      if (!enableEditUserName) {
        setNewUserName("");
      }
      if (!enablePasswordChange) {
        setNewPasswordField("");
      }

      const [newUser_name, newUser_passwordField] = [
        newUserName,
        newPasswordField,
      ];
      await userCtx?.editUser(
        user?.user_id as number,
        user?.user_name as string,
        newUser_name,
        newUser_passwordField,
        enableEditUserName,
        enablePasswordChange
      );
      // userCtx?.setUser({ ...user, user_name: newUser_name });
      toastMessage(
        "User updated successfully. Next time please log in with your new credentials.",
        "success"
      );
    } catch (err) {
      const e: AxiosError = err as AxiosError;
      // @ts-expect-error Error while changing user password
      const errorText: string = e?.response?.data?.text as string;
      toastMessage(errorText, "error");
    }
  }

  return (
    <FlexBox
      sx={{
        margin: "1rem",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "stretch",
      }}
    >
      <Typography variant="h4">Account Control</Typography>
      <Divider />
      <Typography
        variant="h5"
        sx={{ margin: "1rem auto", textAlign: "center" }}
      >
        {userCtx?.user?.user_name ? userCtx?.user?.user_name : user?.user_name}
      </Typography>
      <FlexBox sx={{ justifyContent: "start" }}>
        <input
          type="checkbox"
          readOnly
          onClick={() => setEnableEditUserName((p) => !p)}
          checked={enableEditUserName}
        />
        <span>Edit User Name</span>
      </FlexBox>
      {enableEditUserName && (
        <TextField
          label="New Username"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />
      )}

      <FlexBox sx={{ justifyContent: "start" }}>
        <input
          type="checkbox"
          readOnly
          onClick={() => setEnablePasswordChange((p) => !p)}
          checked={enablePasswordChange}
        />
        <span>Edit Password</span>
      </FlexBox>
      {enablePasswordChange && (
        <TextField
          label="New Password"
          value={newPasswordField}
          onChange={(e) => setNewPasswordField(e.target.value)}
        />
      )}
      {(enableEditUserName || enablePasswordChange) && (
        <Button onClick={handleChangeInformation} variant="contained">
          Update Information
        </Button>
      )}
      <Button
        variant="contained"
        onClick={() => router.push(`/worlds/${user?.user_id}`)}
      >
        Worlds
      </Button>
      <Divider />
      <Button
        variant="contained"
        size="small"
        sx={{ height: "32px", color: "white", marginTop: "3rem" }}
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Logout
      </Button>
    </FlexBox>
  );
};

export default AccountEditScreen;
