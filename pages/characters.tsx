import CharactersTable from "@/Components/Characters/CharactersTable";
import { GetServerSideProps } from "next";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { getAllSentients } from "@/services/data-fetching/getSentients";
import { sentients } from "@prisma/client";

const Characters = () => {
  const { data: sentients } = useQuery({
    queryKey: ["allSentients"],
    queryFn: getAllSentients,
  });

  return <CharactersTable sentients={sentients as sentients[]} />;
};

export const getServerSideProps = (async (ctx) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["allSentients"],
    queryFn: getAllSentients,
  });

  return { props: { dehydratedState: dehydrate(queryClient) } };
}) satisfies GetServerSideProps;

export default Characters;
