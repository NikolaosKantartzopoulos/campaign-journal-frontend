import { Paper } from "@mui/material";
import Image from "next/image";

const ItemImageBox = ({
  imageFile,
  altText,
}: {
  imageFile: string;
  altText: string;
}) => {
  return (
    <Paper
      sx={{ width: "160px", height: "240px", position: "relative" }}
      elevation={3}
    >
      <Image
        src={imageFile}
        alt={altText}
        fill={true}
        style={{
          objectFit: "cover",
        }}
      />
    </Paper>
  );
};

export default ItemImageBox;
