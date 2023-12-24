import Layout from "@/Components/Layouts/Layout";
import { UserContextProvider } from "@/Context/UserContext";
import { CssBaseline, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import "toastify-js/src/toastify.css";
import "./globals.css";
import { theme } from "@/styles/muiTheme";
import {
  QueryClientProvider,
  QueryClient,
  HydrationBoundary,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <ThemeProvider theme={theme}>
          <UserContextProvider>
            <CssBaseline />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </UserContextProvider>
        </ThemeProvider>
      </HydrationBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
