import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { Logout } from "@mui/icons-material";
import SettingsIcon from "@mui/icons-material/Settings";

const LoginButton = ({ ...rest }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const theme = useTheme();
  const under600px = useMediaQuery(theme.breakpoints.down("sm"));

  function handleAccountButtonClick() {
    router.push(user ? "/account/control" : "/account/access");
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: "8px",
        justifyContent: "center",
        alignItems: "center",
        flexFlow: "row",
        mx: 1,
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
        <SettingsIcon onClick={handleAccountButtonClick} />
      ) : (
        <Button
          {...rest}
          onClick={handleAccountButtonClick}
          sx={{
            px: 1,
            py: 0,
            display: "flex",
            flexFlow: "row",
            justifyContent: "center",
            alignItems: "center",
            height: "36px",
            gap: 1,
          }}
        >
          {!user && (
            <AccountCircleIcon sx={{ height: "32px", width: "32px" }} />
          )}
          {user && <Typography variant="body1">{user.user_name}</Typography>}
        </Button>
      )}
      {user && (
        <Logout
          onClick={() => signOut({ callbackUrl: "/" })}
          sx={{ "&:hover": { cursor: "pointer" } }}
        />
      )}
    </Box>
  );
};

export default LoginButton;
