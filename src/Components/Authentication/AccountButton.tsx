import UserContext from "@/Context/UserContext";
import { Button } from "@mui/material";
import { useContext } from "react";

const LoginButton = ({ ...rest }) => {
	const userCtx = useContext(UserContext);

	function handleAccountButtonClick() {
		if (userCtx?.user) {
			userCtx.logoutUser();
		} else if (!userCtx?.user) {
			console.log("Show sign up/login screen");
			userCtx?.setShowUserControlScreen((prev) => !prev);
		}
	}

	const buttonText = userCtx?.user?.userName ? "Account" : "LOGIN";

	return (
		<Button {...rest} onClick={handleAccountButtonClick}>
			{buttonText}
		</Button>
	);
};

export default LoginButton;
