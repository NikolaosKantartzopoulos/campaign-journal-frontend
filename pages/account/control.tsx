import AccountEditScreen from "@/Components/Authentication/AccountEditScreen";
import { Box } from "@mui/material";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { getAllWorldsThatUserHasAccess } from "@/services/data-fetching/getWorlds";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/Components/CustomComponents/LoadingSpinner";
import axios from "axios";
import { location } from "@prisma/client";

const AccountControl = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const { data: playerLocations, isLoading } = useQuery<location[]>({
    queryKey: [`getAllWorldsThatUserHasAccess-${user?.user_id}`],
    queryFn: async () => {
      const { data } = await axios(
        `/api/worlds/get-all-worlds-that-user-has-access/${user?.user_id}`
      );
      console.log("control query", data);
      return data;
    },
  });

  if (isLoading || status === "loading" || !user) {
    return <LoadingSpinner />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <AccountEditScreen
        playerLocations={playerLocations ? playerLocations : []}
      />
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
    queryKey: [`getAllWorldsThatUserHasAccess-${user.user_id}`],
    queryFn: () => getAllWorldsThatUserHasAccess(Number(user.user_id)),
  });

  return {
    props: {
      session,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default AccountControl;
