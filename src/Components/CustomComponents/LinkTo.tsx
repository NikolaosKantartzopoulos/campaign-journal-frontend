import { Button, Typography, styled } from "@mui/material";
import Link from "next/link";
import { ReactNode, useState } from "react";
import ControlledSvg from "./svg/ControlledSvg";

const LinkButton = styled(Button)({
	textDecoration: "none",
	fontSize: "1.5rem",
	color: "#ddd",
	padding: "0px 0.5rem",
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
	children,
	startIcon,
	svgDefault,
	svgHovered,
}: {
	href: string;
	children: ReactNode;
	startIcon?: ReactNode;
	svgDefault?: any;
	svgHovered?: any;
}) => {
	const [hovered, setHovered] = useState(false);

	return (
		<Link href={href}>
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
				<Typography variant="body1">{children}</Typography>
			</LinkButton>
		</Link>
	);
};

export default LinkTo;
