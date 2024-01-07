import { getUniqueSentientById } from "@/services/data-fetching/getSentients";
import getSentientFullName from "@/utilities/helperFn/getSentientFullName";
import { Box, Typography } from "@mui/material";
import { sentient } from "@prisma/client";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Character = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const { data: sentient } = useQuery({
    queryKey: [`sentient-${router.query.sentient_id}`],
    queryFn: () => getUniqueSentientById(Number(router.query.sentient_id)),
    enabled: !!session,
  });

  return (
    <Box>
      <Typography variant="h3">Character page </Typography>
      <Typography variant="h4">
        {getSentientFullName(sentient as sentient)}
      </Typography>
    </Box>
  );
};

export const getServerSideProps = (async (ctx) => {
  // Fetch data from external API
  // Pass data to the page via props
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [`sentient-${ctx.query.sentient_id}`],
    queryFn: () => getUniqueSentientById(Number(ctx.query.sentient_id)),
  });

  return { props: { dehydratedState: dehydrate(queryClient) } };
}) satisfies GetServerSideProps;

export default Character;
