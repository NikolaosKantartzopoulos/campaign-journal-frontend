import { Button, Typography, styled } from "@mui/material";
import Link from "next/link";
import { ReactNode, useState } from "react";
import ControlledSvg from "./svg/ControlledSvg";
import { usePathname } from "next/navigation";

const LinkTo = ({
  href,
  startIcon,
  svgDefault,
  svgHovered,
  linkText,
  showText = true,
}: {
  href: string;
  startIcon?: ReactNode;
  // eslint-disable-next-line
  svgDefault?: any;
  // eslint-disable-next-line
  svgHovered?: any;
  linkText: string;
  showText?: boolean;
}) => {
  const LinkButton = styled(Button)({
    textDecoration: "none",
    fontSize: "1.5rem",
    flexGrow: 1,
    flexBasis: 1,
    flexShrink: 0,
    textAlign: "center",
    justifySelf: "center",
    alignSelf: "center",
    whiteSpace: "nowrap",
    gap: "0.5rem",
    display: "flex",
    padding: "0.25rem",
    alignItems: "center",
    textDecorationLine: "none",
    width: "100%",
    // maxWidth: !showText ? "32px" : "150px",
    "&:hover": {
      color: "white",
    },
    "&:visited": {
      textDecoration: "none",
    },
    "&:active": {
      textDecoration: "none",
    },
  });

  const [hovered, setHovered] = useState(false);
  const pathname = usePathname();

  const isActiveLink = pathname === href;

  return (
    <Link
      href={href}
      style={{
        // border: isActiveLink ? "1px solid white" : "1px solid rgba(0,0,0,0)",
        color: isActiveLink ? "white" : "red",
      }}
    >
      <LinkButton
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          color: isActiveLink ? "white" : "#ddd",
          fontWeight: isActiveLink ? "bold" : "none",
          justifyContent: showText ? "flex-start" : "center",
          p: 1,
        }}
        size="small"
      >
        {startIcon && startIcon}
        {svgDefault && svgHovered && (
          <ControlledSvg
            hovered={hovered}
            svgDefault={svgDefault}
            svgHovered={svgHovered}
            isActiveLink={isActiveLink}
          />
        )}
        {showText && (
          <Typography variant="body1" sx={{ fontSize: "14px", pt: "2px" }}>
            {linkText}
          </Typography>
        )}
      </LinkButton>
    </Link>
  );
};

export default LinkTo;
