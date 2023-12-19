import Layout from "@/Components/Layouts/Layout";
import { UserContextProvider } from "@/Context/UserContext";
import { CssBaseline } from "@mui/material";
import type { AppProps } from "next/app";
import "toastify-js/src/toastify.css";

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<UserContextProvider>
			<CssBaseline />
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</UserContextProvider>
	);
}
