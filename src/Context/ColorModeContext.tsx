import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import React, { ReactNode } from "react";

export const ColorModeContext = React.createContext<ColorModeContextInterface>({
  colorMode: {
    toggleColorMode: () => {},
  },
  mode: "light",
  setMode: () => "light",
});

interface ColorModeContextInterface {
  colorMode: {
    toggleColorMode: () => void;
  };
  mode: "light" | "dark";
  setMode: React.Dispatch<React.SetStateAction<"light" | "dark">>;
}

export default function ToggleColorMode({ children }: { children: ReactNode }) {
  const [mode, setMode] = React.useState<"light" | "dark">("light");
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          localStorage.setItem(
            "theme",
            prevMode === "light" ? "dark" : "light"
          );
          return prevMode === "light" ? "dark" : "light";
        });
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        components: {
          MuiTableRow: {
            styleOverrides: {
              root: {
                cursor: "pointer",
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                padding: 0,
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={{ colorMode, mode, setMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}
