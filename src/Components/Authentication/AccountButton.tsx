import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { Logout } from "@mui/icons-material";
import SettingsIcon from "@mui/icons-material/Settings";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import React from "react";
import { ColorModeContext } from "@/Context/ColorModeContext";
import { FlexBox } from "../CustomComponents/FlexBox";

const LoginButton = ({ ...rest }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const theme = useTheme();
  const under600px = useMediaQuery(theme.breakpoints.down("sm"));

  const { colorMode } = React.useContext(ColorModeContext);

  function handleAccountButtonClick() {
    router.push(user ? "/account/control" : "/account/access");
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexFlow: "row wrap",
      }}
      onClick={() => {
        console.log(
          session,
          user,
          user?.selectedWorld,
          user?.selectedWorld?.location_name
        );
      }}
    >
      {under600px ? (
        <IconButton onClick={handleAccountButtonClick}>
          <SettingsIcon sx={{ color: "white" }} />
        </IconButton>
      ) : (
        <Button
          {...rest}
          onClick={handleAccountButtonClick}
          sx={{
            px: 1,
            py: 0,
            display: "flex",
            flexFlow: "row",
            alignItems: "center",
            height: "36px",
            gap: 1,
            justifyContent: "space-evenly",
            "&>*": { flex: "1 1 0" },
          }}
        >
          {!user && (
            <AccountCircleIcon
              sx={{ height: "32px", width: "32px", color: "white" }}
            />
          )}
          {user && <Typography variant="body1">{user.user_name}</Typography>}
        </Button>
      )}
      <FlexBox
        sx={{ height: "36px", gap: "0px", justifyContent: "space-evenly" }}
      >
        <IconButton onClick={colorMode.toggleColorMode} color="inherit">
          {theme.palette.mode === "dark" ? (
            <Brightness7Icon sx={{ color: "white" }} />
          ) : (
            <Brightness4Icon sx={{ color: "white" }} />
          )}
        </IconButton>
        {user && (
          <IconButton onClick={() => signOut({ callbackUrl: "/" })}>
            <Logout sx={{ color: "white" }} />
          </IconButton>
        )}
      </FlexBox>
    </Box>
  );
};

export default LoginButton;
