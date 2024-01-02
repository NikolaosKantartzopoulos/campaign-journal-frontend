import { AddHeroContextProvider } from "@/Components/Heroes/AddHeroContext";
import AddHeroPage from "@/Components/Heroes/AddHeroPage";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { authOptions } from "./api/auth/[...nextauth]";
import { Session, getServerSession } from "next-auth";
import { getAllSentientsNotInUsersVanguard } from "@/services/heroes/handleHeroes";
import { useSession } from "next-auth/react";
import { sentient } from "@prisma/client";
import LoadingSpinner from "@/Components/CustomComponents/LoadingSpinner";

const Heroes = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const { data: sentients } = useQuery<sentient[], Error>({
    queryKey: ["getAllSentientsNotInUsersVanguard"],

    queryFn: async () => {
      const { data: sentient } = await axios.get(
        `/api/getAllSentientsNotInUsersVanguard/${user?.user_id}`
      );
      return sentient;
    },
  });

  if (!sentients) {
    return <LoadingSpinner />;
  }

  return (
    <AddHeroContextProvider>
      <AddHeroPage sentients={sentients} />
    </AddHeroContextProvider>
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
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const user = session?.user;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["getAllSentientsNotInUsersVanguard"],
    queryFn: () => getAllSentientsNotInUsersVanguard(Number(user.user_id)),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Heroes;
