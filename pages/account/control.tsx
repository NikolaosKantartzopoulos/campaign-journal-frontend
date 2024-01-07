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
import { getPlayersSubscribedToWorld } from "@/services/data-fetching/getPlayers";
import { getWorldsHeroFactions } from "@/services/data-fetching/getFactions";

const AccountControl = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const { data: playerLocations, isLoading } = useQuery<location[]>({
    queryKey: [`getAllWorldsThatUserHasAccess-${user?.user_id}`],
    queryFn: async () => {
      const { data } = await axios(
        `/api/worlds/get-all-worlds-that-user-has-access/${user?.user_id}`
      );
      return data;
    },
    enabled: !!user,
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

  await queryClient.prefetchQuery({
    queryKey: [
      "playersSubscribedToWorld",
      user?.selectedWorld?.location_id,
      user?.user_id,
    ],
    queryFn: () =>
      getPlayersSubscribedToWorld(
        user?.selectedWorld as location,
        Number(user.user_id)
      ),
  });

  console.log("98098709870987", session?.selectedWorld?.location_id);
  console.log(session);
  await queryClient.prefetchQuery({
    queryKey: [
      "worldsHeroFactions",
      user?.selectedWorld?.location_id,
      user?.user_id,
    ],
    queryFn: () => getWorldsHeroFactions(user?.selectedWorld as location),
  });

  return {
    props: {
      session,
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};

export default AccountControl;
