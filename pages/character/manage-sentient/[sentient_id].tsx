import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import useHorizontalLinearStepper from "@/utilities/hooks/useCreateCharacterHorizontalLinearStepper";
import CharacterBasicInfo from "@/Components/Characters/CreateNewCharacterPage/CharacterBasicInfo";
import { authOptions } from "../../api/auth/[...nextauth]";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Session, getServerSession } from "next-auth";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Card, Input } from "@mui/material";
import CharacterImage from "@/Components/Characters/CreateNewCharacterPage/CharacterImage";
import { readImageFromDrive } from "@/utilities/formidable";
import { sentient } from "@prisma/client";
import { useState } from "react";
import { toastMessage } from "@/Components/CustomComponents/Toastify/Toast";

const steps = ["Create character", "Factions & Items"];

export default function ManageCharacter({
  characterImage,
}: {
  characterImage: string;
}) {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const { data: sentient, isFetched } = useQuery<sentient>({
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

  const {
    activeStep,
    isStepOptional,
    isStepSkipped,
    handleReset,
    handleBack,
    handleSkip,
    handleNext,
  } = useHorizontalLinearStepper(steps, sentient || null);

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
    <Box sx={{ width: "100%", maxWidth: "500px", margin: "auto" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <Card
          sx={{
            maxWidth: "500px",
            margin: "1rem auto",
            p: "1rem",
            minHeight: "405px",
            display: "flex",
            flexDirection: "column",
            alignItems: "space-between",
          }}
        >
          <Box sx={{ flexGrow: "1" }}>
            {activeStep === 0 && isFetched && (
              <Box>
                <CharacterBasicInfo />
                {sentient && sentient?.profile_image_path ? (
                  <CharacterImage characterImage={characterImage} />
                ) : (
                  <Box>
                    <Input type="file" onChange={handleFileChange} />
                    <Button
                      onClick={handleUpload}
                      variant="outlined"
                      sx={{ marginTop: "1rem" }}
                    >
                      Add Image
                    </Button>
                  </Box>
                )}
              </Box>
            )}
            {activeStep === 1 && <h1>Create character 2</h1>}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}
            <Button onClick={handleNext} disabled={!sentient}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </Card>
      )}
    </Box>
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
  const user = session?.user;
  if (!session || !user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const queryClient = new QueryClient();
  const sentient_id = context?.params?.sentient_id;

  // if (sentient_id) {
  //   await queryClient.prefetchQuery({
  //     queryKey: [
  //       "sentient",
  //       { user_id: user?.user_id },
  //       { world_id: user?.selectedWorld?.location_id },
  //       { sentient_id: sentient_id },
  //     ],
  //     queryFn: () => getSentientById(Number(sentient_id)),
  //   });
  //   await queryClient.prefetchQuery({
  //     queryKey: [
  //       "sentient",
  //       "sentientImage",
  //       { user_id: user?.user_id },
  //       { world_id: user?.selectedWorld?.location_id },
  //       { sentient_id: sentient_id },
  //     ],
  //     queryFn: () => readImageFromDrive(),
  //   });
  // }

  const characterImage = await readImageFromDrive(
    "characters",
    `${user.selectedWorld?.location_id}_${sentient_id}.jpg`
  );

  return { props: { characterImage, dehydratedState: dehydrate(queryClient) } };
};
