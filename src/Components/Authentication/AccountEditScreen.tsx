import UserContext from "@/Context/UserContext";
import { Box, Button } from "@mui/material";
import { useContext } from "react";

const AccountEditScreen = () => {
	const userCtx = useContext(UserContext);

	return (
		<Box>
			<Button
				variant="contained"
				size="small"
				sx={{ height: "32px", color: "white" }}
				onClick={userCtx?.logoutUser}
			>
				Logout
			</Button>
		</Box>
	);
};

export default AccountEditScreen;
