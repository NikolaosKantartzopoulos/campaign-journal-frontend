import * as React from "react";
import Box from "@mui/material/Box";
import CharacterBasicInfo from "@/Components/Characters/CreateNewCharacterPage/CharacterBasicInfo";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Card } from "@mui/material";
import CharacterImage from "@/Components/Characters/CreateNewCharacterPage/CharacterImage";
import { readImageFromDrive } from "@/utilities/formidable";
import { sentient } from "@prisma/client";
import { withServerSessionGuard } from "@/utilities/functions/getServerSideSession";

export default function ManageCharacter({
  characterImage,
}: {
  characterImage: string;
}) {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const { isFetched } = useQuery<sentient>({
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

  return (
    <Box sx={{ width: "100%", maxWidth: "500px", margin: "auto" }}>
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
          {isFetched && (
            <Box>
              <CharacterBasicInfo />
              <CharacterImage characterImage={characterImage} />
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const { user } = await withServerSessionGuard(ctx);
  const queryClient = new QueryClient();
  const sentient_id = ctx?.params?.sentient_id;

  const characterImage = await readImageFromDrive(
    "characters",
    `${user?.selectedWorld?.location_id}_${sentient_id}`
  );

  return { props: { characterImage, dehydratedState: dehydrate(queryClient) } };
};
