import { getUniqueSentientById } from "@/services/data-fetching/getSentients";
import { readImageFromDrive } from "@/utilities/formidable";
import getSentientFullName from "@/utilities/helperFn/getSentientFullName";
import { Box, Card, Typography } from "@mui/material";
import { sentient } from "@prisma/client";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Session, getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { authOptions } from "../api/auth/[...nextauth]";
import CharacterImageBox from "@/Components/Characters/CharacterImageBox";

const Character = ({ characterImage }: { characterImage: string }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const characterImageUrl = characterImage
    ? `data:image/png;base64,${characterImage}`
    : null;

  const { data: sentient } = useQuery({
    queryKey: [
      "sentient",
      { user_id: user?.user_id },
      { world_id: user?.selectedWorld?.location_id },
      { sentient_id: router.query.sentient_id },
    ],

    queryFn: () => getUniqueSentientById(Number(router.query.sentient_id)),
    enabled: !!user,
  });

  return (
    <Card sx={{ m: 1, p: 1 }}>
      <Box>
        <Typography variant="h5">
          {getSentientFullName(sentient as sentient)}
        </Typography>
        <Typography
          variant="caption"
          sx={(theme) => ({ color: theme.palette.text.secondary })}
        >
          {sentient?.short_title}
        </Typography>
      </Box>
      {characterImageUrl && <CharacterImageBox imageFile={characterImageUrl} />}
    </Card>
  );
};

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

  await queryClient.prefetchQuery({
    queryKey: [
      "sentient",
      { user_id: user?.user_id },
      { world_id: user?.selectedWorld?.location_id },
      { sentient_id: context.query.sentient_id },
    ],
    queryFn: () => getUniqueSentientById(Number(context.query.sentient_id)),
  });

  const characterImage = await readImageFromDrive(
    "characters",
    `${user.selectedWorld?.location_id}_${sentient_id}`
  );

  return { props: { characterImage, dehydratedState: dehydrate(queryClient) } };
};

export default Character;
