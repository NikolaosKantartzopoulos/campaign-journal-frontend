import { sentient } from "@prisma/client";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddHeroContext, { AddHeroContextInterface } from "./AddHeroContext";
import getSentientFullName from "@/utilities/helperFn/getSentientFullName";
import { toastMessage } from "../CustomComponents/Toastify/Toast";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const AddHeroConfirmation = () => {
  const { selectedHero, handleClose, submitHeroSelection, open } =
    React.useContext(AddHeroContext) as AddHeroContextInterface;
  // const { user } = React.useContext(UserContext) as UserContextInterface;
  const { data: session } = useSession();
  const user = session?.user;

  const router = useRouter();
  async function handleAddButtonClick() {
    if (!user) {
      toastMessage("Please login to add a hero to your Vanguard", "warning");
      router.replace("/");
    } else {
      const { data } = await submitHeroSelection(user);
      toastMessage(data.text, "warning");
    }
  }

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm hero selection"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Would you like to add
            <b> {getSentientFullName(selectedHero as sentient)} </b>
            to you Heroes list?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Back</Button>
          <Button onClick={handleAddButtonClick} variant="contained" autoFocus>
            ADD
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AddHeroConfirmation;
