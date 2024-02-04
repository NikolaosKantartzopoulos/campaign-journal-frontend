import { Box } from "@mui/material";
import { GetServerSideProps } from "next";
import { prisma } from "../../prisma/prisma";
import { user } from "@prisma/client";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { getAllWorldsWhereUserIsGameMaster } from "@/services/data-fetching/getWorlds";
import { withServerSessionGuard } from "@/utilities/functions/getServerSideSession";

const Worlds = ({ user }: { user: user }) => {
  return <Box>{user.user_name}</Box>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {} = await withServerSessionGuard(ctx);

  const user = (await prisma.user.findUnique({
    where: {
      user_id: Number(ctx.query.user_id),
    },
  })) as user;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["allWorlds"],
    queryFn: () => getAllWorldsWhereUserIsGameMaster(Number(user?.user_id)),
  });

  return { props: { user, dehydratedState: dehydrate(queryClient) } };
};

export default Worlds;
