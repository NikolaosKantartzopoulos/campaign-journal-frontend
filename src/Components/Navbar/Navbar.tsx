import {
  AppBar,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LoginButton from "../Authentication/AccountButton";
import LinkSection from "./LinkSection";

import * as React from "react";
import { useSession } from "next-auth/react";

const Navbar = ({
  toggleDrawer,
}: {
  toggleDrawer: (
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}) => {
  const theme = useTheme();
  const under600px = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: session } = useSession();
  const user = session?.user;

  return (
    <AppBar position="static" sx={{ marginBottom: "2rem" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: 1,
        }}
      >
        {under600px && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
            onKeyDown={toggleDrawer(false)}
          >
            <MenuIcon />
          </IconButton>
        )}

        {!under600px && (
          <Box
            sx={() => ({
              display: {
                xs: "none",
                sm: "flex",
                md: "flex",
                lg: "flex",
                xl: "flex",
              },
              flexFlow: "row wrap",
              alignItems: "center",
              justifyContent: "center",
              alignContent: "stretch",
            })}
          >
            <LinkSection />
          </Box>
        )}
        <button onClick={() => console.log(user)}>user</button>
        <LoginButton color="inherit" />
      </Box>
    </AppBar>
  );
};

export default Navbar;
