import { Button } from "@mui/material";
import EditAccountCredentials from "./EditAccountCredentials";
import WorldManagement from "../World/WorldManagement";
import { FlexBox } from "../CustomComponents/FlexBox";
import { useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import LandscapeIcon from "@mui/icons-material/Landscape";
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
          variant={selectedTab === "account" ? "contained" : "outlined"}
          endIcon={<SettingsIcon />}
          onClick={() => setSelectedTab("account")}
          sx={{ maxWidth: "250px" }}
        >
          Account
        </Button>
        <Button
          variant={selectedTab === "worlds" ? "contained" : "outlined"}
          endIcon={<LandscapeIcon />}
          onClick={() => setSelectedTab("worlds")}
          sx={{ maxWidth: "250px" }}
        >
          Worlds
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
