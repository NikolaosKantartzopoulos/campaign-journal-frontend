import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LoginButton from "../Authentication/AccountButton";
import { MyLink } from "../CustomComponents/Link";

const Navbar = () => {
	return (
		<AppBar position="static">
			<Toolbar
				sx={{
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<IconButton
					size="large"
					edge="start"
					color="inherit"
					aria-label="menu"
					sx={{ mr: 2 }}
				>
					<MenuIcon />
				</IconButton>
				<Box
					sx={{
						display: "flex",
						flexFlow: "row wrap",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<MyLink to="/">Home</MyLink>
					<MyLink to="/character">Character</MyLink>
					<MyLink to="/character">Character</MyLink>
					<MyLink to="/character">Character</MyLink>
				</Box>
				<LoginButton color="inherit" />
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
