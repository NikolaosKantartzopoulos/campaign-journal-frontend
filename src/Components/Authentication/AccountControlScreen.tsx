import UserContext from "@/Context/UserContext";
import { useContext } from "react";
import { Box } from "@mui/material";

const AccountControlScreen = () => {
	const userCtx = useContext(UserContext);

	return (
		<Box
			sx={{
				margin: "1rem",
				display: "flex",
				flexDirection: "column",
				gap: "1rem",
				alignItems: "center",
			}}
		></Box>
	);
};

export default AccountControlScreen;
