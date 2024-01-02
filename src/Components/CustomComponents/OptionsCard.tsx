import { Card, Typography } from "@mui/material";
import React from "react";

const OptionsCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <Card
      sx={(theme) => ({
        p: 2,
        maxWidth: "600px",
        minWidth: "50%",
        m: 0,
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        [theme.breakpoints.down("md")]: {
          width: "100%",
        },
      })}
    >
      <Typography variant="h4" sx={{ m: "auto", textAlign: "center" }}>
        {title}
      </Typography>
      {children}
    </Card>
  );
};

export default OptionsCard;
