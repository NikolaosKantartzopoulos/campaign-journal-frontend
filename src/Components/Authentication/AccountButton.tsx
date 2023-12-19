import UserContext from "@/Context/UserContext";
import { Box, Button } from "@mui/material";
import { useContext } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const LoginButton = ({ ...rest }) => {
	const userCtx = useContext(UserContext);

	function handleAccountButtonClick() {
		userCtx?.setShowUserControlScreen((prev) => !prev);
	}

	return (
		<Box
			sx={{
				display: "flex",
				gap: "8px",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Button
				{...rest}
				onClick={handleAccountButtonClick}
				sx={{ display: "flex", gap: "16px" }}
			>
				<>
					{userCtx?.user?.userName && userCtx?.user?.userName}
					<AccountCircleIcon sx={{ height: "48px", width: "48px" }} />
				</>
			</Button>
		</Box>
	);
};

export default LoginButton;
