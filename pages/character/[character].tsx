import { Box, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

const Character = () => {
  const router = useRouter();
  const query = router.query;

  return (
    <Box>
      <Typography variant="h3">Character page </Typography>
      <Typography variant="h4"></Typography>
    </Box>
  );
};

export const getServerSideProps = (async (ctx) => {
  // Fetch data from external API
  // Pass data to the page via props
  return { props: {} };
}) satisfies GetServerSideProps;

export default Character;
