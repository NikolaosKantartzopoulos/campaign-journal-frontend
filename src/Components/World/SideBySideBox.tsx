import { Box, SxProps, Typography } from "@mui/material";
import { FlexBox } from "../CustomComponents/FlexBox";
import { Dispatch, MouseEvent, SetStateAction } from "react";

interface SideBySideBoxProps<T> {
  boxTitle?: string;
  itemsArray: T[];
  idUsed: string;
  visibleValue: string;
  sx?: SxProps;
  onItemClick: (e: MouseEvent, idUsed: string, boxTitle?: string) => void;
  onTitleClick: (e: MouseEvent, title: string) => void;
  noVisibleOptionsText?: string;
  visibleOptions?: string | null | boolean;
  setVisibleOptions?: Dispatch<SetStateAction<string | null>>;
}

const SideBySideBox = ({
  visibleValue,
  boxTitle,
  itemsArray,
  idUsed,
  sx,
  onItemClick,
  onTitleClick,
  noVisibleOptionsText = "It is lonely here!",
  visibleOptions,
  setVisibleOptions,
}: SideBySideBoxProps<Record<string, any>>) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
        gap: 0,
        // border: "1px solid black",
        ...sx,
      }}
    >
      {boxTitle && (
        <Typography
          variant="h6"
          sx={(theme) => ({
            px: "1rem",
            cursor: "pointer",
            "&:hover": { scale: "1.01" },
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.primary.main
                : theme.palette.secondary.dark,
            color: "white",
          })}
          onClick={(e) => {
            if (!setVisibleOptions) return;
            setVisibleOptions(boxTitle);
            onTitleClick(e, boxTitle);
          }}
        >
          {boxTitle}
        </Typography>
      )}
      {(visibleOptions == boxTitle || visibleOptions === true) && (
        <FlexBox sx={{ flexDirection: "column", gap: 0 }}>
          {itemsArray.map((item) => (
            <Typography
              key={item[idUsed]}
              sx={(theme) => ({
                pl: "1rem",
                m: 0,
                width: "100%",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "light"
                      ? theme.palette.primary.light
                      : theme.palette.secondary.light,
                  color: theme.palette.mode === "light" ? "white" : "black",
                  cursor: "pointer",
                },
              })}
              onClick={(e: MouseEvent) => {
                if (boxTitle) {
                  onItemClick(e, item[idUsed], boxTitle);
                } else onItemClick(e, item[idUsed]);
              }}
            >
              {item[visibleValue]}
            </Typography>
          ))}
          {!itemsArray?.length && (
            <Typography variant="body1">{noVisibleOptionsText}</Typography>
          )}
        </FlexBox>
      )}
    </Box>
  );
};

export default SideBySideBox;
