import LogInSignUpScreen from "@/Components/Authentication/LogInSignUpScreen";
import { Box } from "@mui/material";

const AccountAccess = () => {
	return (
		<Box
			sx={{
				margin: "1rem",
				display: "flex",
				flexDirection: "column",
				gap: "1rem",
				alignItems: "center",
			}}
		>
			<LogInSignUpScreen />
		</Box>
	);
};

export default AccountAccess;
