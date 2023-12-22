import { useLoggedInUser } from "@/Components/Authentication/useLoggedInUser";
import UserContext, { User } from "@/Context/UserContext";
import { Typography } from "@mui/material";
import { useContext, useEffect } from "react";

export default function Home() {
  // const userCtx = useLoggedInUser();

  return (
    <main>
      <Typography variant="h3">Homepage</Typography>
    </main>
  );
}
