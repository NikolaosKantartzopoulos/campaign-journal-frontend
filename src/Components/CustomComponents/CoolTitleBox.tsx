import { Box } from "@mui/material";
import { ReactNode } from "react";

const CoolTitleBox = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={(theme) => ({
        bgcolor: theme.palette.primary.dark,
        pl: "1rem",
        color: "white",
        fontSize: "1.3rem",
      })}
    >
      {children}
    </Box>
  );
};

export default CoolTitleBox;
