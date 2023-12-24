import { Button, Typography, styled } from "@mui/material";
import Link from "next/link";
import { ReactNode, useState } from "react";
import ControlledSvg from "./svg/ControlledSvg";
import { usePathname } from "next/navigation";

const LinkButton = styled(Button)({
  textDecoration: "none",
  fontSize: "1.5rem",
  padding: "0.5 1rem",
  flexGrow: 1,
  flexBasis: 1,
  textAlign: "center",
  justifySelf: "center",
  whiteSpace: "nowrap",
  gap: "0.5rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textDecorationLine: "none",
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

const LinkTo = ({
  href,
  startIcon,
  svgDefault,
  svgHovered,
  linkText,
}: {
  href: string;
  startIcon?: ReactNode;
  svgDefault?: any;
  svgHovered?: any;
  linkText: string;
}) => {
  const [hovered, setHovered] = useState(false);
  const pathname = usePathname();

  const isActiveLink = pathname === href;

  return (
    <Link
      href={href}
      style={{
        border: isActiveLink ? "1px solid white" : "1px solid rgba(0,0,0,0)",
        color: isActiveLink ? "white" : "red",
      }}
    >
      <LinkButton
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          color: isActiveLink ? "white" : "#ddd",
          fontWeight: isActiveLink ? "bold" : "none",
        }}
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
        <Typography variant="body1">{linkText}</Typography>
      </LinkButton>
    </Link>
  );
};

export default LinkTo;
