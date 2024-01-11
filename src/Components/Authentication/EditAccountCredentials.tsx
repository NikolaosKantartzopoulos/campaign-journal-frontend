import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { FlexBox } from "../CustomComponents/FlexBox";
import axios, { AxiosError } from "axios";
import { toastMessage } from "../CustomComponents/Toastify/Toast";
import { useSession } from "next-auth/react";
import OptionsCard from "../CustomComponents/OptionsCard";

const EditAccountCredentials = () => {
  const { update } = useSession();

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
      const { data } = await axios.patch("/api/user-management/", {
        newUser_name,
        newUser_passwordField,
        enableEditUserName,
        enablePasswordChange,
      });
      console.log(data.userRetrieved);
      update({ user: data.userRetrieved });
      toastMessage("User updated", "success");
      setNewUserName("");
      setNewPasswordField("");
      setEnableEditUserName(false);
      setEnablePasswordChange(false);
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
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <FlexBox
          sx={{
            flexFlow: "row wrap",
            gap: "1rem",
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
