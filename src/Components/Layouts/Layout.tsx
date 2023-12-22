import { ReactNode, useContext, useState } from "react";
import Navbar from "../Navbar/Navbar";
import UserContext from "@/Context/UserContext";
import UserControlScreen from "../Authentication/AccountControlScreen";
import Drawer from "@mui/material/Drawer";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import LinkSection from "../Navbar/LinkSection";

export default function Layout({ children }: { children: ReactNode }) {
  const userCtx = useContext(UserContext);

  const [isDrawerOpen, setDrawerOpen] = useState(true);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const theme = useTheme();
  const under600px = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Navbar toggleDrawer={toggleDrawer} />
      {under600px && (
        <Drawer
          open={isDrawerOpen}
          onClose={() => toggleDrawer(false)}
          onClick={() => setDrawerOpen(false)}
        >
          <Box
            sx={(theme) => ({
              width: 200,
              backgroundColor: theme.palette.primary.main,
              height: "100%",
            })}
            role="presentation"
          >
            <LinkSection />
          </Box>
        </Drawer>
      )}
    </>
  );
}
