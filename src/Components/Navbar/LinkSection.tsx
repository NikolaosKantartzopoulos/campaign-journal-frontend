import { Home } from "@mui/icons-material";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import LinkTo from "../CustomComponents/LinkTo";
import SignpostIcon from "@mui/icons-material/Signpost";
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

const LinkSection = () => {
  const theme = useTheme();
  const under600px = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexFlow: "row wrap",
        gap: "0.5rem",
        justifyContent: under600px ? "flex-start" : "center",
      }}
    >
      <LinkTo href="/" startIcon={<Home />} linkText="Home" />
      <LinkTo
        href="/characters"
        svgDefault={Helmet}
        svgHovered={HelmetWhite}
        linkText="Characters"
      />
      <LinkTo
        href="/locations"
        startIcon={<SignpostIcon />}
        linkText="Locations"
      />
      <LinkTo
        href="/items"
        svgDefault={Sword}
        svgHovered={SwordWhite}
        linkText="Items"
      />
      <LinkTo
        href="/factions"
        svgDefault={Fist}
        svgHovered={FistWhite}
        linkText="Factions"
      />
      <LinkTo
        href="/quests"
        svgDefault={Grail}
        svgHovered={GrailWhite}
        linkText="Quests"
      />
      <LinkTo
        href="/journal"
        svgDefault={Quill}
        svgHovered={QuillWhite}
        linkText="Journal"
      />
      <LinkTo href="/heroes" startIcon={<SecurityIcon />} linkText="Heroes" />
    </Box>
  );
};

export default LinkSection;
