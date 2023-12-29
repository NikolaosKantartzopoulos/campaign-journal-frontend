import { Box } from "@mui/material";
import { GetServerSideProps } from "next";
import { prisma } from "../../prisma/prisma";
import { user } from "@prisma/client";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { getAllWorlds } from "@/services/data-fetching/getWorlds";

const Worlds = ({ user }: { user: user }) => {
  return <Box>{user.user_name}</Box>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = (await prisma.user.findUnique({
    where: {
      user_id: Number(ctx.query.user_id),
    },
  })) as user;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["allWorlds"],
    queryFn: () => getAllWorlds(user),
  });

  return { props: { user, dehydratedState: dehydrate(queryClient) } };
};

export default Worlds;
