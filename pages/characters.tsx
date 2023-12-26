import CharactersTable from "@/Components/Characters/CharactersTable";
import { GetServerSideProps } from "next";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { getAllSentients } from "@/services/data-fetching/getSentients";
import { sentient } from "@prisma/client";
import axios from "axios";

const Characters = () => {
  const { data: sentients } = useQuery({
    queryKey: ["allSentients"],
    queryFn: async () => {
      const { data: sentient } = await axios("/api/sentients/");
      return sentient;
    },
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
