import * as React from "react";
import { AppProps } from "next/app";
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import CssBaseline from "@mui/material/CssBaseline";
import { EmotionCache } from "@emotion/react";
import Layout from "@/Components/Layouts/Layout";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "toastify-js/src/toastify.css";
import "./globals.css";
import ToggleColorMode from "@/Context/ColorModeContext";

// Client-side cache, shared for the whole session of the user in the browser.

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props;

  const [queryClient] = React.useState(
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
    <ToggleColorMode>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={pageProps.dehydratedState}>
            <CssBaseline />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </HydrationBoundary>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SessionProvider>
    </ToggleColorMode>
  );
}
