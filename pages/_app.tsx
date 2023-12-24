import Layout from "@/Components/Layouts/Layout";
import { UserContextProvider } from "@/Context/UserContext";
import { CssBaseline, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import "toastify-js/src/toastify.css";
import "./globals.css";
import { theme } from "@/styles/muiTheme";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <UserContextProvider>
        <CssBaseline />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserContextProvider>
    </ThemeProvider>
  );
}
