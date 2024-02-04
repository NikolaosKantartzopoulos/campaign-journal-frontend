import { Button } from "@mui/material";
import axios from "axios";
import { QueryFunction, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FlexBox } from "@/Components/CustomComponents/FlexBox";
import { toastMessage } from "@/Components/CustomComponents/Toastify/Toast";
import { useState } from "react";
import { FileUploadOutlined } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import ItemImageBox from "@/Components/PresentItem/ItemImage";

interface ImageUploaderProps<T> {
  currentImageFile: string;
  queryKey: any[];
  queryFn: QueryFunction<T>;
  postUrl: string;
  deleteUrl: string;
}

const ImageUploader = <T,>({
  currentImageFile,
  queryFn,
  queryKey,
  postUrl,
  deleteUrl,
}: ImageUploaderProps<T>) => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const { data: image } = useQuery<T>({
    queryKey,
    queryFn,
    enabled: !!user,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageFile, setImageFile] = useState<string | null>(
    currentImageFile ? `data:image/png;base64,${currentImageFile}` : null
  );

  const handleFileChange = (event: any) => {
    // Get the selected file from the input
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!image) {
      toastMessage("Error: non existent character", "error");
      router.replace("/");
    }
    try {
      if (!selectedFile) {
        toastMessage("No image file", "error");
        return;
      }
      const formData = new FormData();
      formData.append("imageFile", selectedFile);

      await axios.post(postUrl, formData);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event?.target?.result;
        setImageFile(result as string);
        setSelectedFile(null); // Move it here to ensure it's called after reading is complete
      };

      reader.readAsDataURL(selectedFile);
    } catch (error: any) {
      console.log(error.response?.data);
    }
  };

  async function handleDeleteImagePicture() {
    try {
      const { data } = await axios.delete(deleteUrl);
      toastMessage(data.message, "success");
      setImageFile(null);
      setSelectedFile(null);
    } catch (err) {
      toastMessage("Image not deleted. Please try again", "error");
    }
  }

  return (
    <FlexBox
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1,
        alignItems: "flex-start",
        marginTop: "2rem",
      }}
    >
      {imageFile && (
        <ItemImageBox imageFile={imageFile} altText="Character Image" />
      )}
      <FlexBox
        sx={{
          flexFlow: imageFile ? "column" : "row",
          justifyContent: "center",
        }}
      >
        <FlexBox
          sx={{
            display: "column",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "center",
            width: imageFile ? "100px" : "120px",
          }}
        >
          {!selectedFile && (
            <Button
              component="label"
              sx={(theme) => ({
                border: `1px solid ${theme.palette.primary.main}`,
                color: theme.palette.primary.main,
                borderRadius: "4px",
                fontSize: "14px",
                textTransform: "uppercase",
                width: "100px",
                display: "flex",
                justifyContent: "space-between",
                height: "36px",
              })}
              startIcon={
                <FileUploadOutlined sx={{ height: "20px", width: "20px" }} />
              }
            >
              <input
                style={{ display: "none" }}
                type="file"
                hidden
                onChange={handleFileChange}
                name="[licenseFile]"
                accept=".jpeg, .jpg, .webp, .png"
              />
              image
            </Button>
          )}
          {selectedFile && (
            <Button
              onClick={handleUpload}
              variant="outlined"
              disabled={!selectedFile}
              startIcon={
                <FileUploadOutlined sx={{ height: "20px", width: "20px" }} />
              }
            >
              UPLOAD
            </Button>
          )}
          {imageFile && (
            <Button
              onClick={handleDeleteImagePicture}
              color="error"
              variant="outlined"
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          )}
        </FlexBox>
      </FlexBox>
    </FlexBox>
  );
};

export default ImageUploader;
