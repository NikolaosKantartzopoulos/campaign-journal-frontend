import { Box, Button } from "@mui/material";
import { GetServerSideProps } from "next";
import { signIn, useSession } from "next-auth/react";

const Quests = () => {
  const { data: session, status } = useSession();
  if (status === "authenticated") {
    return <p>Signed in as {session?.user?.user_name}</p>;
  }

  return (
    <Box>
      <h3>Quests</h3>
      <Button variant="contained" onClick={() => signIn()}>
        Sign In
      </Button>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default Quests;
