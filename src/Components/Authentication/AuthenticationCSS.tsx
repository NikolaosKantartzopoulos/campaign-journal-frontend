import { Box } from "@mui/material";
import { ReactNode } from "react";

export const UserControlScreenBox = ({ children }: { children: ReactNode }) => {
	return (
		<Box
			sx={{
				display: "flex",
				flexFlow: "row wrap",
				gap: "64px",
				alignItems: "center",
				justifyContent: "center",
				maxWidth: "375px",
				margin: "auto",
				marginTop: "150px",
				padding: "32px",
			}}
		>
			{children}
		</Box>
	);
};
