import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Box, Button, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import fs from "fs/promises";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { sentient } from "@prisma/client";
import { toastMessage } from "@/Components/CustomComponents/Toastify/Toast";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Home({ image }: { image: string }) {
  const { data: session } = useSession();

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event: any) => {
    // Get the selected file from the input
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    try {
      if (!selectedFile) {
        toastMessage("Enter an image File", "error");
        return;
      }
      const formData = new FormData();
      formData.append("characterProfileImage", selectedFile);

      const { data: newSentientData }: { data: sentient } = await axios.post(
        "/api/sentients/unique/",
        {
          first_name: "Strahd",
          last_name: "von Zarovich",
          race_name: "Vampire",
          short_title: "Dark Lord",
        }
      );
      console.log("sentientCreated with id", newSentientData.sentient_id);
      const { data } = await axios.post(
        `/api/files/sentients/${newSentientData.sentient_id}`,
        formData
      );
      console.log(data);
    } catch (error: any) {
      console.log(error.response?.data);
    }
  };

  return (
    <main>
      <Typography variant="h3">Homepage</Typography>
      <Typography variant="h3">With tests</Typography>
      {session && (
        <Typography variant="h5">Welcome {session?.user?.user_name}</Typography>
      )}

      <Button variant="contained" component="label" onClick={handleUpload}>
        Upload File
      </Button>
      <input type="file" onChange={handleFileChange} />
      <button onClick={() => console.log(selectedFile)}>asdf</button>
      <Box sx={{ width: "350px", height: "400px", position: "relative" }}>
        <Image
          src={`data:image/png;base64,${image}`}
          alt="Your Image"
          fill={true}
        />
      </Box>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = (await getServerSession(
    context.req,
    context.res,
    authOptions
  )) as Session;

  if (!session) {
    return {
      redirect: {
        destination: "/account/access",
        permanent: false,
      },
    };
  }

  const imageBuffer = await fs.readFile("/home/nik/sambashare/vox.png");
  const base64Image = imageBuffer.toString("base64");
  return {
    props: {
      image: base64Image,
    },
  };
};
