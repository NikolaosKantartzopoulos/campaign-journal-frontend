import { FlexBox } from "@/Components/CustomComponents/FlexBox";
import AddExistingHero from "@/Components/Heroes/AddExistingHero";
import AddNewHero from "@/Components/Heroes/AddNewHero";
import { getAllSentients } from "@/services/data-fetching/getSentients";
import { Box, Button, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useState } from "react";

const Heroes = () => {
  const { data: sentients } = useQuery({
    queryKey: ["allSentients"],
    queryFn: getAllSentients,
  });

  const [addHeroOption, setAddHeroOption] = useState<"new" | "existing" | null>(
    null
  );

  return (
    <FlexBox sx={{ flexDirection: "column" }}>
      <Typography variant="h4">Heroes</Typography>
      <FlexBox
        sx={{
          "& button": {
            flex: "1 1 0",
            whiteSpace: "nowrap",
            padding: "1rem",
          },
        }}
      >
        <Button
          variant="contained"
          onClick={() => setAddHeroOption((p) => (p ? null : "new"))}
        >
          Add new
        </Button>
        <Button
          variant="contained"
          onClick={() => setAddHeroOption((p) => (p ? null : "existing"))}
        >
          Add existing
        </Button>
      </FlexBox>
      {addHeroOption && (
        <Box>
          {addHeroOption === "new" && <AddNewHero />}
          {addHeroOption === "existing" && sentients && (
            <AddExistingHero existingHeroes={sentients} />
          )}
        </Box>
      )}
    </FlexBox>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default Heroes;
