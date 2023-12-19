import AccountEditScreen from "@/Components/Authentication/AccountEditScreen";
import { Box } from "@mui/material";

const AccountControl = () => {
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
			<AccountEditScreen />
		</Box>
	);
};

export default AccountControl;
