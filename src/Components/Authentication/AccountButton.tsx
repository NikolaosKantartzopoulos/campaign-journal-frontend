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
        mx: 1,
      }}
    >
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
        <AccountCircleIcon sx={{ height: "32px", width: "32px" }} />
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
