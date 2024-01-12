import { render } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { SessionProvider } from "next-auth/react";
import { theme } from "./src/styles/muiTheme";

const mockSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: { user_id: 1, user_name: "Nikos", user_password: "1234" },
};

jest.mock("next/router", () => jest.requireActual("next-router-mock"));

const AllTheProviders = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <SessionProvider session={mockSession}>
        {/* <QueryClientProvider client={queryClient}> */}
        {/* <HydrationBoundary state={pageProps.dehydratedState}> */}
        {/* <CssBaseline /> */}
        {/* <Layout> */}
        {children}
        {/* </Layout> */}
        {/* </HydrationBoundary> */}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        {/* </QueryClientProvider> */}
      </SessionProvider>
    </ThemeProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
