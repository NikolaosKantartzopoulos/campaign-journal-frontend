import { Typography } from "@mui/material";

export default function EmptyDataMessage({ data }: { data: string }) {
  return (
    <Typography variant="h4" sx={{ margin: "auto 2rem" }}>
      No {data} added
    </Typography>
  );
}
