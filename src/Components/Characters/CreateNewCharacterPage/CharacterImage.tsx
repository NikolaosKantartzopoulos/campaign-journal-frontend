import { Box, Button } from "@mui/material";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { FlexBox } from "@/Components/CustomComponents/FlexBox";

const CharacterImage = ({ characterImage }: { characterImage: string }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const { data: sentient } = useQuery({
    queryKey: [
      "sentient",
      { user_id: user?.user_id },
      { world_id: user?.selectedWorld?.location_id },
      { sentient_id: router.query.sentient_id },
    ],
    queryFn: async () => {
      const { data: sentient } = await axios(
        `/api/sentients/unique/${router.query.sentient_id}`
      );
      return sentient;
    },
    enabled: !!user,
  });

  // async function handleAddSentientPicture() {
  //   console.log(sentient);
  //   // try {
  //   //   const { data: sentientCreated } = await axios.post<sentient>(
  //   //     "/api/sentients/unique",
  //   //     {
  //   //       first_name: firstName,
  //   //       last_name: lastName,
  //   //       race_name: race,
  //   //       short_title: shortTitle,
  //   //       state: vitality,
  //   //     }
  //   //   );
  //   // } catch (error) {
  //   //   const err = error as AxiosError<{ message: string }>;
  //   //   console.log(err);
  //   //   toastMessage("There was an error", "error");
  //   // }
  // }

  async function handleEditSentientPicture() {
    console.log(sentient);
    // try {
    //   const { data } = await axios.post("/api/sentients/unique", {
    //     first_name: firstName,
    //     last_name: lastName,
    //     race_name: race,
    //     short_title: shortTitle,
    //     state: vitality,
    //   });
    //   // setCharacterCreated(true);
    // } catch (error) {
    //   const err = error as AxiosError<{ message: string }>;
    //   console.log(err);
    //   toastMessage("There was an error", "error");
    // }
  }

  async function handleDeleteSentientPicture() {
    console.log(sentient);
  }

  const dataUrl = `data:image/png;base64,${characterImage}`;
  return (
    <FlexBox
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1,
        alignItems: "flex-start",
        marginTop: "1rem",
      }}
    >
      <Box sx={{ width: "240px", height: "320px", position: "relative" }}>
        <Image
          src={dataUrl}
          alt="Character Image"
          fill={true}
          style={{
            objectFit: "cover",
          }}
        />
      </Box>
      <FlexBox sx={{ flexFlow: "column" }}>
        <Button
          onClick={() => {
            handleEditSentientPicture();
            console.log("TODO Change image");
          }}
          variant="outlined"
        >
          Change
        </Button>
        <Button
          onClick={() => {
            handleDeleteSentientPicture();
            console.log("TODO Delete image");
          }}
          color="error"
          variant="outlined"
        >
          Delete
        </Button>
      </FlexBox>
    </FlexBox>
  );
};

export default CharacterImage;
