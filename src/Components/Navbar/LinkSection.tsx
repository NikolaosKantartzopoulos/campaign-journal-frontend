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

const LinkSection = ({ showText = true }: { showText?: boolean }) => {
  const theme = useTheme();
  const under600px = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns:
          showText && under600px
            ? "1fr"
            : {
                xs: "repeat(4, 1fr)",
                sm: "1fr 1fr 1fr  1fr",
                md: "repeat(4, 1fr)",
                lg: "repeat(4, 1fr)",
                xl: "repeat(8, 1fr)",
              },
        justifyContent: under600px ? "flex-start" : "center",
        alignItems: under600px ? "flex-start" : "center",
        flex: "1 1 0",
        width: "100%",
      }}
    >
      <LinkTo
        href="/"
        startIcon={<Home />}
        linkText={under600px ? "Home" : ""}
        showText={showText}
      />
      <LinkTo
        href="/characters"
        svgDefault={Helmet}
        svgHovered={HelmetWhite}
        linkText="Characters"
        showText={showText}
      />
      <LinkTo
        href="/locations"
        startIcon={
          <SignpostIcon sx={{ height: "25px", width: "26px", p: 0 }} />
        }
        linkText="Locations"
        showText={showText}
      />
      <LinkTo
        href="/items"
        svgDefault={Sword}
        svgHovered={SwordWhite}
        linkText="Items"
        showText={showText}
      />
      <LinkTo
        href="/factions"
        svgDefault={Fist}
        svgHovered={FistWhite}
        linkText="Factions"
        showText={showText}
      />
      <LinkTo
        href="/quests"
        svgDefault={Grail}
        svgHovered={GrailWhite}
        linkText="Quests"
        showText={showText}
      />
      <LinkTo
        href="/journal"
        svgDefault={Quill}
        svgHovered={QuillWhite}
        linkText="Journal"
        showText={showText}
      />
      <LinkTo
        href="/heroes"
        startIcon={<SecurityIcon />}
        linkText="Heroes"
        showText={showText}
      />
    </Box>
  );
};

export default LinkSection;
