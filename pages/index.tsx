import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main>
      <Typography variant="h3">Homepage</Typography>
      {session && (
        <Typography variant="h5">Welcome {session?.user?.user_name}</Typography>
      )}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = (await getServerSession(
    context.req,
    context.res,
    authOptions
  )) as Session;

  if (!session) {
    return {
      redirect: {
        destination: "/account/access",
        permanent: false,
      },
    };
  }
  return { props: {} };
};
