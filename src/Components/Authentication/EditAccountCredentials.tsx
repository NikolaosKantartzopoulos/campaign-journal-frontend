import UserContext from "@/Context/UserContext";
import { Box, Button, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { FlexBox } from "../CustomComponents/FlexBox";
import { AxiosError } from "axios";
import { toastMessage } from "../CustomComponents/Toastify/Toast";
import { useSession } from "next-auth/react";
import OptionsCard from "../CustomComponents/OptionsCard";

const EditAccountCredentials = () => {
  const userCtx = useContext(UserContext);
  const { data: session } = useSession();
  const user = session?.user;

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
    <OptionsCard title="Account">
      <FlexBox
        sx={{
          flexDirection: "column",
          minHeight: "180px",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <FlexBox
          sx={{
            flexFlow: "row wrap",
            gap: "1rem",
            minHeight: "90px",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <Box sx={{ minWidth: "240px" }}>
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
          </Box>
          <Box sx={{ minWidth: "240px" }}>
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
          </Box>
        </FlexBox>
        {(enableEditUserName || enablePasswordChange) && (
          <Button onClick={handleChangeInformation} variant="contained">
            Update Information
          </Button>
        )}
      </FlexBox>
    </OptionsCard>
  );
};

export default EditAccountCredentials;
