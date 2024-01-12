import CharactersTable from "@/Components/Characters/CharactersTable";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { getAllSentients } from "@/services/data-fetching/getSentients";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

const Characters = () => {
  return <CharactersTable />;
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
  const world_id = user.selectedWorld?.location_id;

  if (!session || !user || !world_id) {
    return {
      redirect: {
        destination: "/account/access",
        permanent: false,
      },
    };
  }
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [
      "allSentients",
      { user_id: user?.user_id },
      { world_id: world_id },
    ],
    queryFn: () => getAllSentients({ world_id: world_id }),
  });

  return { props: { dehydratedState: dehydrate(queryClient) } };
};

export default Characters;
