import UserContext from "@/Context/UserContext";
import { Box, Button } from "@mui/material";
import { useContext } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/router";

const LoginButton = ({ ...rest }) => {
	const userCtx = useContext(UserContext);
	const router = useRouter();

	function handleAccountButtonClick() {
		router.push(userCtx?.user ? "/account-control" : "/account-access");
	}

	return (
		<Box
			sx={{
				display: "flex",
				gap: "8px",
				justifyContent: "center",
				alignItems: "center",
				flexFlow: "row wrap",
			}}
		>
			<Button
				{...rest}
				onClick={handleAccountButtonClick}
				sx={{
					display: "flex",
					flexFlow: "row wrap",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<AccountCircleIcon sx={{ height: "48px", width: "48px" }} />
			</Button>
		</Box>
	);
};

export default LoginButton;
