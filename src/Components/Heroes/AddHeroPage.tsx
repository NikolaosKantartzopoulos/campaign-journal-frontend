import { useContext } from "react";
import AddHeroContext, { AddHeroContextInterface } from "./AddHeroContext";
import { Box, Typography } from "@mui/material";
import { FlexBox } from "../CustomComponents/FlexBox";
import AddExistingHero from "./AddExistingHero";
import AddExistingHeroButton from "./AddExistingHeroButton";
import AddNewHero from "./AddNewHero";
import AddNewHeroButton from "./AddNewHeroButton";
import { sentient } from "@prisma/client";
import AddHeroConfirmation from "./AddHeroConfirmation";

const AddHeroPage = ({ sentients }: { sentients: sentient[] }) => {
  const { setAddHeroOption, addHeroOption }: AddHeroContextInterface =
    useContext(AddHeroContext) as AddHeroContextInterface;

  return (
    <FlexBox sx={{ flexDirection: "column" }}>
      <Typography variant="h4">Your Heroes</Typography>
      <FlexBox
        sx={{
          "& button": {
            flex: "1 1 0",
            whiteSpace: "nowrap",
            padding: "1rem",
          },
        }}
      >
        <AddNewHeroButton setAddHeroOption={setAddHeroOption} />
        <AddExistingHeroButton setAddHeroOption={setAddHeroOption} />
      </FlexBox>

      {addHeroOption && (
        <Box>
          {addHeroOption === "new" && <AddNewHero />}
          {addHeroOption === "existing" && (
            <AddExistingHero existingHeroes={sentients} />
          )}
        </Box>
      )}
      <AddHeroConfirmation />
    </FlexBox>
  );
};

export default AddHeroPage;
