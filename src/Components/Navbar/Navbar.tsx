import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LoginButton from "../Authentication/AccountButton";
import LinkSection from "./LinkSection";

import * as React from "react";

const Navbar = ({
  toggleDrawer,
}: {
  toggleDrawer: (
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}) => {
  const theme = useTheme();
  const under600px = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
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
            sx={{
              display: "flex",
              flexFlow: "row wrap",
              alignItems: "center",
              justifyContent: "center",
              alignContent: "stretch",
            }}
          >
            <LinkSection />
          </Box>
        )}
        <LoginButton color="inherit" />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
