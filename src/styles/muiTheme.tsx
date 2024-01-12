import { createTheme } from "@mui/material";

export const theme = createTheme({
  // palette: {
  //   primary: {
  //     main: "#254565",
  //   },
  // },
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
});
