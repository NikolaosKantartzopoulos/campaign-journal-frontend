import { Button, Typography, styled } from "@mui/material";
import Link from "next/link";
import { ReactNode, useState } from "react";
import ControlledSvg from "./svg/ControlledSvg";
import { usePathname } from "next/navigation";

const LinkButton = styled(Button)({
  textDecoration: "none",
  fontSize: "1.5rem",
  color: "#ddd",
  padding: "0.5 1rem",
  flexGrow: 1,
  flexBasis: 1,
  textAlign: "center",
  justifySelf: "center",
  whiteSpace: "nowrap",
  gap: "0.5rem",
  "&:hover": {
    color: "white",
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

  return (
    <Link
      href={href}
      style={{
        border:
          pathname === href ? "1px solid white" : "1px solid rgba(0,0,0,0)",
      }}
    >
      <LinkButton
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {startIcon && startIcon}
        {svgDefault && svgHovered && (
          <ControlledSvg
            hovered={hovered}
            svgDefault={svgDefault}
            svgHovered={svgHovered}
          />
        )}
        <Typography variant="body1">{linkText}</Typography>
      </LinkButton>
    </Link>
  );
};

export default LinkTo;
