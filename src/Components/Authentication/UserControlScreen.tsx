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
	const [userPassword, setUserPassword] = useState<string>("");
	const [userEmail, setUserEmail] = useState<string>("");

	async function handleLogin() {
		await userCtx?.loginUser(userName, userPassword);
	}
	async function handleSignUp() {
		try {
			const res = await userCtx?.createUser(userName, userPassword);
			console.log(res);
			// toastMessage(, "success");
		} catch (e) {
			toastMessage("There was an error", "error");
		}
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
				<TextField
					label="Username"
					value={userName}
					onChange={(e) => setUserName(e.target.value)}
				/>
				<TextField
					label="Password"
					value={userPassword}
					onChange={(e) => setUserPassword(e.target.value)}
				/>
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
