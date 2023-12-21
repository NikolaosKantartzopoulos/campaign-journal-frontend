import Image from "next/image";

const ControlledSvg = ({ svgDefault, svgHovered, hovered }: any) => {
	return (
		<Image
			src={hovered ? svgHovered : svgDefault}
			width={22}
			height={22}
			alt="some text"
		/>
	);
};

export default ControlledSvg;
