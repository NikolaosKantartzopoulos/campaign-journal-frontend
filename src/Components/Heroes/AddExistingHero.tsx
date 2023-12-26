import { FlexBox } from "../CustomComponents/FlexBox";
import { Box, Chip } from "@mui/material";
import getSentientFullName from "@/utilities/helperFn/getSentientFullName";
import { sentient } from "@prisma/client";
import EmptyDataMessage from "../CustomComponents/EmptyData";
import SearchBox from "../CustomComponents/SearchBox";
import useFilterContent from "@/utilities/functions/hooks/useFilterContent";

const AddExistingHero = ({
  existingHeroes,
}: {
  existingHeroes: sentient[];
}) => {
  const {
    filterContentState,
    searchFieldState,
    handleSearch,
    resetFilterContent,
    handleSearchFieldKeyStroke,
  } = useFilterContent(existingHeroes);

  if (!existingHeroes) {
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
        {filterContentState?.map((el) => (
          <Chip
            variant="outlined"
            key={el.sentient_id}
            label={getSentientFullName(el)}
            clickable
          />
        ))}
      </FlexBox>
    </Box>
  );
};

export default AddExistingHero;
