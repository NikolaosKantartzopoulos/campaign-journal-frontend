import CharactersTable from "@/Components/Characters/CharactersTable";
import { GetServerSideProps } from "next";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { getAllSentients } from "@/services/data-fetching/getSentients";
import { sentient } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";

const Characters = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const { data: sentients } = useQuery({
    queryKey: [
      "allSentients",
      session?.selectedWorld?.location_id,
      user?.user_id,
    ],
    queryFn: async () => {
      const { data: sentient } = await axios("/api/sentients/");
      return sentient;
    },
    enabled: !!session,
  });

  return <CharactersTable sentients={sentients as sentient[]} />;
};

export const getServerSideProps = (async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["allSentients"],
    queryFn: getAllSentients,
  });

  return { props: { dehydratedState: dehydrate(queryClient) } };
}) satisfies GetServerSideProps;

export default Characters;
