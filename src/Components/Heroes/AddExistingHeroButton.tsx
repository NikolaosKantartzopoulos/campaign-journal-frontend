import { Button } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

const AddExistingHeroButton = ({
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
          p == null ? "existing" : p === "new" ? "existing" : null
        );
      }}
    >
      Add existing
    </Button>
  );
};

export default AddExistingHeroButton;
