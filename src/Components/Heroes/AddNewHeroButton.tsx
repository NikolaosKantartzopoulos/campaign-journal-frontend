import { Button } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

const AddNewHeroButton = ({
  setAddHeroOption,
}: {
  setAddHeroOption: Dispatch<SetStateAction<"new" | "existing" | null>>;
}) => {
  return (
    <Button
      sx={{ height: "2rem" }}
      variant="contained"
      onClick={() => {
        setAddHeroOption((p) =>
          p == null ? "new" : p === "existing" ? "new" : null
        );
      }}
    >
      Add new
    </Button>
  );
};

export default AddNewHeroButton;
