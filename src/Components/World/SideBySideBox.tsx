import { Box, SxProps, Typography } from "@mui/material";
import { FlexBox } from "../CustomComponents/FlexBox";
import { MouseEvent, useState } from "react";

interface SideBySideBoxProps<T> {
  boxTitle: string;
  itemsArray: T[];
  idUsed: string;
  visibleValue: string;
  sx?: SxProps;
  onItemClick: (e: MouseEvent, idUsed: string) => void;
  onTitleClick: (e: MouseEvent, title: string) => void;
}

const SideBySideBox = ({
  visibleValue,
  boxTitle,
  itemsArray,
  idUsed,
  sx,
  onItemClick,
  onTitleClick,
}: SideBySideBoxProps<Record<string, any>>) => {
  const [visibleOptions, setVisibleOptions] = useState(true);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid black",
        ...sx,
      }}
    >
      <Typography
        variant="h6"
        sx={{ px: "1rem", cursor: "pointer", "&:hover": { scale: "1.01" } }}
        onClick={(e) => {
          setVisibleOptions((p) => !p);
          onTitleClick(e, boxTitle);
        }}
      >
        {boxTitle}
      </Typography>
      {visibleOptions && (
        <FlexBox sx={{ flexDirection: "column", gap: 0 }}>
          {itemsArray.map((item) => (
            <Typography
              key={item[idUsed]}
              sx={{
                pl: "1rem",
                m: 0,
                width: "100%",
                "&:hover": {
                  backgroundColor: "#efefef",
                  cursor: "pointer",
                },
              }}
              onClick={(e: MouseEvent) => onItemClick(e, item[idUsed])}
            >
              {item[visibleValue]}
            </Typography>
          ))}
        </FlexBox>
      )}
    </Box>
  );
};

export default SideBySideBox;
