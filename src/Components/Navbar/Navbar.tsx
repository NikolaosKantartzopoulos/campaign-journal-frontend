import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LoginButton from "../Authentication/AccountButton";
import SignpostIcon from "@mui/icons-material/Signpost";
import LinkTo from "../CustomComponents/LinkTo";
import { Home } from "@mui/icons-material";
import Helmet from "../../../public/media/svg/helmet.svg";
import HelmetWhite from "../../../public/media/svg/helmet-white.svg";
import Fist from "../../../public/media/svg/fist.svg";
import FistWhite from "../../../public/media/svg/fist-white.svg";
import Sword from "../../../public/media/svg/sword.svg";
import SwordWhite from "../../../public/media/svg/sword-white.svg";
import Grail from "../../../public/media/svg/grail.svg";
import GrailWhite from "../../../public/media/svg/grail-white.svg";
import Quill from "../../../public/media/svg/quill.svg";
import QuillWhite from "../../../public/media/svg/quill-white.svg";
import SecurityIcon from "@mui/icons-material/Security";

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
						alignContent: "stretch",
					}}
				>
					<LinkTo href="/" startIcon={<Home />}>
						Home
					</LinkTo>
					<LinkTo
						href="/characters"
						svgDefault={Helmet}
						svgHovered={HelmetWhite}
					>
						Characters
					</LinkTo>
					<LinkTo href="/locations" startIcon={<SignpostIcon />}>
						Locations
					</LinkTo>
					<LinkTo href="/items" svgDefault={Sword} svgHovered={SwordWhite}>
						Items
					</LinkTo>
					<LinkTo
						href="/organizations"
						svgDefault={Fist}
						svgHovered={FistWhite}
					>
						Organizations
					</LinkTo>
					<LinkTo href="/quests" svgDefault={Grail} svgHovered={GrailWhite}>
						Quests
					</LinkTo>
					<LinkTo href="/journal" svgDefault={Quill} svgHovered={QuillWhite}>
						Journal
					</LinkTo>
					<LinkTo href="/my-hero" startIcon={<SecurityIcon />}>
						My hero
					</LinkTo>
				</Box>
				<LoginButton color="inherit" />
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
