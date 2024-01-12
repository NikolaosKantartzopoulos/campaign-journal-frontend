import { Box } from "@mui/material";
import Image from "next/image";

const CharacterImageBox = ({ imageFile }: { imageFile: string }) => {
  return (
    <Box sx={{ width: "160px", height: "240px", position: "relative" }}>
      <Image
        src={imageFile}
        alt="Character Image"
        fill={true}
        style={{
          objectFit: "cover",
        }}
      />
    </Box>
  );
};

export default CharacterImageBox;
