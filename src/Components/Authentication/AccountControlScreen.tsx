import UserContext from "@/Context/UserContext";
import { useContext } from "react";
import LogInSignUpScreen from "./LogInSignUpScreen";
import { Box, Button } from "@mui/material";
import AccountEditScreen from "./AccountEditScreen";

const AccountControlScreen = () => {
	const userCtx = useContext(UserContext);

	return (
		<Box>
			{!userCtx?.user && <LogInSignUpScreen />}
			{userCtx?.user && <AccountEditScreen />}
		</Box>
	);
};

export default AccountControlScreen;
