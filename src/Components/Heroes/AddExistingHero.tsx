import { FlexBox } from "../CustomComponents/FlexBox";
import { Chip } from "@mui/material";
import getSentientFullName from "@/utilities/helperFn/getSentientFullName";
import { sentient } from "@prisma/client";
import EmptyDataMessage from "../CustomComponents/EmptyData";

const AddExistingHero = ({
  existingHeroes,
}: {
  existingHeroes: sentient[];
}) => {
  if (!existingHeroes) {
    return <EmptyDataMessage data="heroes" />;
  }

  return (
    <FlexBox>
      <FlexBox sx={{ flexFlow: "row wrap" }}>
        {existingHeroes?.map((el) => (
          <Chip
            variant="outlined"
            key={el.sentient_id}
            label={getSentientFullName(el)}
            clickable
          />
        ))}
      </FlexBox>
    </FlexBox>
  );
};

export default AddExistingHero;
