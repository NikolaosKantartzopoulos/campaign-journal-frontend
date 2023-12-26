import Image from "next/image";

const ControlledSvg = ({
  svgDefault,
  svgHovered,
  hovered,
  isActiveLink,
}: // eslint-disable-next-line
any) => {
  return (
    <Image
      src={isActiveLink || hovered ? svgHovered : svgDefault}
      width={22}
      height={22}
      alt="some text"
    />
  );
};

export default ControlledSvg;
