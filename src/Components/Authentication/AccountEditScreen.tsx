import { Button } from "@mui/material";
import { signOut } from "next-auth/react";
import EditAccountCredentials from "./EditAccountCredentials";
import WorldManagement from "./WorldManagement";
import { FlexBox } from "../CustomComponents/FlexBox";
import { useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import LandscapeIcon from "@mui/icons-material/Landscape";
import { Logout } from "@mui/icons-material";
import { location } from "@prisma/client";

const AccountEditScreen = ({
  playerLocations,
}: {
  playerLocations: location[];
}) => {
  const [selectedTab, setSelectedTab] = useState<"account" | "worlds">(
    "worlds"
  );

  return (
    <FlexBox sx={{ width: "100%", p: 1, flexDirection: "column" }}>
      <FlexBox
        sx={(theme) => ({
          flexFlow: "row",
          gap: "1rem",
          [theme.breakpoints.down("sm")]: {
            flexFlow: "row wrap",
            gap: "2px",
          },
        })}
      >
        <Button
          variant="contained"
          endIcon={<SettingsIcon />}
          onClick={() => setSelectedTab("account")}
          sx={{ maxWidth: "250px", marginBottom: "1rem" }}
        >
          Account
        </Button>
        <Button
          variant="contained"
          endIcon={<LandscapeIcon />}
          onClick={() => setSelectedTab("worlds")}
          sx={{ maxWidth: "250px", marginBottom: "1rem" }}
        >
          Worlds
        </Button>
        <Button
          variant="contained"
          endIcon={<Logout />}
          onClick={() => signOut({ callbackUrl: "/" })}
          sx={{
            maxWidth: "250px",
            marginBottom: "1rem",
            whiteSpace: "nowrap",
          }}
        >
          Sign Out
        </Button>
      </FlexBox>
      {selectedTab === "account" && <EditAccountCredentials />}
      {selectedTab === "worlds" && (
        <WorldManagement playerLocations={playerLocations} />
      )}
    </FlexBox>
  );
};

export default AccountEditScreen;
