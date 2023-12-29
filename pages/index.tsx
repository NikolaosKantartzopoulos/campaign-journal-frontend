import { Typography } from "@mui/material";
import { useSession } from "next-auth/react";

export default function Home() {
  // const userCtx = useLoggedInUser();
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
