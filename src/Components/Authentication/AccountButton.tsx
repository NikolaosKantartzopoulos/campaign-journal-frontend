import { Box, Button, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useContext } from "react";
import UserContext from "@/Context/UserContext";

const LoginButton = ({ ...rest }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const userCtx = useContext(UserContext);

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
        flexFlow: "row wrap",
        border: user ? "1px solid white" : "1px solid rgba(0,0,0,0)",
      }}
    >
      <Button
        {...rest}
        onClick={handleAccountButtonClick}
        sx={{
          display: "flex",
          flexFlow: "row wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AccountCircleIcon sx={{ height: "48px", width: "48px" }} />
        {user && (
          <Typography variant="body1">
            {userCtx?.user?.user_name
              ? userCtx?.user?.user_name
              : user.user_name}
          </Typography>
        )}
      </Button>
    </Box>
  );
};

export default LoginButton;
