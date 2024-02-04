import { GetServerSideProps } from "next";
import { Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { withServerSessionGuard } from "@/utilities/functions/getServerSideSession";

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
  const { session } = await withServerSessionGuard(context);

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
