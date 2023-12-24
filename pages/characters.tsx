import CharactersTable from "@/Components/Characters/CharactersTable";
import { Box } from "@mui/material";
import { GetServerSideProps } from "next";
import { prisma } from "../prisma/prisma";
import { sentients } from "@prisma/client";

const Characters = ({ sentients }: { sentients: sentients[] }) => {
  return (
    <Box>
      <CharactersTable sentients={sentients} />
    </Box>
  );
};

export const getServerSideProps = (async (ctx) => {
  // Fetch data from external API
  // Pass data to the page via props
  const sentients = await prisma.sentients.findMany();

  return { props: { sentients } };
}) satisfies GetServerSideProps;

export default Characters;
