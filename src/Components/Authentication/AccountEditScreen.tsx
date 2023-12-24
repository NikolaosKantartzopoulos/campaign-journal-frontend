import UserContext from "@/Context/UserContext";
import { Button, Divider, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { FlexBox } from "../CustomComponents/FlexBox";
import { AxiosError } from "axios";
import { toastMessage } from "../CustomComponents/Toastify/Toast";

const AccountEditScreen = () => {
  const userCtx = useContext(UserContext);

  const [newPasswordField, setNewPasswordField] = useState<string>("");
  const [newUserName, setNewUserName] = useState<string>("");
  const [enableEditUserName, setEnableEditUserName] = useState<boolean>(false);
  const [enablePasswordChange, setEnablePasswordChange] =
    useState<boolean>(false);

  async function handleChangeInformation() {
    try {
      if (!enableEditUserName) {
        setNewUserName("");
      }
      if (!enablePasswordChange) {
        setNewPasswordField("");
      }
      const res = await userCtx?.editUser(
        userCtx?.user?.userId as number,
        userCtx?.user?.userName as string,
        newUserName,
        newPasswordField
      );

      toastMessage("Changed password successfully", "success");
    } catch (err) {
      const e: AxiosError = err as AxiosError;
      // @ts-ignore
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
        Welcome {userCtx?.user?.userName}
      </Typography>
      <Divider />
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
        size="small"
        sx={{ height: "32px", color: "white", marginTop: "3rem" }}
        onClick={userCtx?.logoutUser}
      >
        Logout
      </Button>
    </FlexBox>
  );
};

export default AccountEditScreen;
