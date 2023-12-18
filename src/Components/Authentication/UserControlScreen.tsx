import UserContext from "@/Context/UserContext";
import {
	Box,
	Button,
	Divider,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { GetServerSideProps } from "next";
import { useContext, useState } from "react";
import Toastify from "toastify-js";
import { toastMessage } from "../CustomComponents/Toastify/Toast";

const userInfoCSS = {
	maxWidth: "375px",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	gap: "16px",
};

const UserControlScreen = () => {
	const userCtx = useContext(UserContext);
	const theme = useTheme();

	const [userName, setUserName] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	function handleLogin() {
		userCtx?.loginUser(userName, password);
	}
	function handleSignUp() {
		userCtx?.createUser(userName, password);
	}

	return (
		<Box
			sx={{
				border: "1px solid black",
				display: "flex",
				flexFlow: "row wrap",
				gap: "64px",
				alignItems: "center",
				justifyContent: "center",
				maxWidth: "375px",
				margin: "auto",
				marginTop: "150px",
				padding: "32px 0px",
			}}
		>
			<Box sx={userInfoCSS}>
				<TextField label="Username" />
				<TextField label="Password" />
				<Box
					sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}
				>
					<Button variant="contained" onClick={handleLogin}>
						Login
					</Button>
					<Button variant="contained" onClick={handleSignUp}>
						Sign up
					</Button>
				</Box>
			</Box>
		</Box>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	return {
		props: {},
	};
};

export default UserControlScreen;
