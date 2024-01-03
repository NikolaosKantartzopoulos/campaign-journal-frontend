import { FlexBox } from "../CustomComponents/FlexBox";
import { Box, Chip } from "@mui/material";
import getSentientFullName from "@/utilities/helperFn/getSentientFullName";
import { sentient } from "@prisma/client";
import EmptyDataMessage from "../CustomComponents/EmptyData";
import SearchBox from "../CustomComponents/SearchBox";
import useFilterContent from "@/utilities/functions/hooks/useFilterContent";
import { MouseEvent, useContext } from "react";
import AddHeroContext, { AddHeroContextInterface } from "./AddHeroContext";

const AddExistingHero = ({
  sentientsNOTInUsersVanguard,
}: {
  sentientsNOTInUsersVanguard: sentient[];
}) => {
  const {
    filterContentState,
    searchFieldState,
    handleSearch,
    resetFilterContent,
    handleSearchFieldKeyStroke,
  } = useFilterContent(sentientsNOTInUsersVanguard);

  const { handleProceedToHeroConfirmation } = useContext(
    AddHeroContext
  ) as AddHeroContextInterface;

  if (!sentientsNOTInUsersVanguard) {
    return <EmptyDataMessage data="heroes" />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <SearchBox
        handleSearchFieldKeyStroke={handleSearchFieldKeyStroke}
        searchFieldState={searchFieldState}
        clearSearchField={resetFilterContent}
        handleSearch={handleSearch}
      />
      <FlexBox sx={{ flexFlow: "row wrap" }}>
        {filterContentState?.map((sentient) => (
          <Chip
            variant="outlined"
            key={sentient.sentient_id}
            label={getSentientFullName(sentient)}
            clickable
            onClick={(e: MouseEvent) =>
              handleProceedToHeroConfirmation(e, sentient)
            }
          />
        ))}
      </FlexBox>
    </Box>
  );
};

export default AddExistingHero;
