import CharactersTable from "@/Components/Characters/CharactersTable";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { getAllSentients } from "@/services/data-fetching/getSentients";
import { sentient } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { Box, Button } from "@mui/material";
import { isUserGameMaster } from "@/utilities/helperFn/isUserGameMaster";
import { useRouter } from "next/router";

const Characters = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const { data: sentients } = useQuery({
    queryKey: [
      "allSentients",
      { user_id: user?.user_id },
      { world_id: user?.selectedWorld?.location_id },
    ],
    queryFn: async () => {
      const { data: sentient } = await axios("/api/sentients/");
      return sentient;
    },
    enabled: !!user,
  });

  return (
    <Box>
      {isUserGameMaster(session) && (
        <Button
          variant="outlined"
          onClick={() => {
            router.push(`/character/manage-sentient/`);
          }}
        >
          Create
        </Button>
      )}
      <CharactersTable sentients={sentients as sentient[]} />;
    </Box>
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

  await queryClient.prefetchQuery({
    queryKey: [
      "allSentients",
      { user_id: user?.user_id },
      { world_id: user?.selectedWorld?.location_id },
    ],
    queryFn: getAllSentients,
  });

  return { props: { dehydratedState: dehydrate(queryClient) } };
};

export default Characters;
