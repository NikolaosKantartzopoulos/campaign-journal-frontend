import { Card } from "@mui/material";
import Image from "next/image";

const ItemImageBox = ({
  imageFile,
  altText,
}: {
  imageFile: string;
  altText: string;
}) => {
  return (
    <Card sx={{ width: "160px", height: "240px", position: "relative" }}>
      <Image
        src={imageFile}
        alt={altText}
        fill={true}
        style={{
          objectFit: "cover",
        }}
      />
    </Card>
  );
};

export default ItemImageBox;
