import { Box, Checkbox, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { FlexBox } from "./FlexBox";

interface TwoLevelCheckboxStateInterface {
  viewAll: boolean;
  selected: string[];
}

interface TwoLevelCheckboxInterface {
  availableOptions: string[];
  selectedOptions: TwoLevelCheckboxStateInterface;
  setSelectedOptions: Dispatch<SetStateAction<TwoLevelCheckboxStateInterface>>;
}

const TwoLevelCheckboxFilter = ({
  availableOptions,
  selectedOptions,
  setSelectedOptions,
}: TwoLevelCheckboxInterface) => {
  return (
    <Box>
      <FlexBox sx={{ justifyContent: "flex-start", gap: 0, height: "2rem" }}>
        <Checkbox
          checked={selectedOptions.viewAll}
          onChange={() =>
            setSelectedOptions((p) => ({
              viewAll: !p.viewAll,
              selected: p.viewAll ? [] : [...availableOptions],
            }))
          }
          inputProps={{ "aria-label": "controlled" }}
        />
        <Typography variant="body1">Continents</Typography>
      </FlexBox>

      <Box sx={{ marginLeft: "1rem" }}>
        {availableOptions.map((el) => (
          <FlexBox
            sx={{ justifyContent: "flex-start", gap: 0, height: "2rem" }}
            key={el}
          >
            <Checkbox
              checked={selectedOptions.selected.includes(el)}
              onChange={() => {
                const hasOptionAlreadySelected =
                  selectedOptions.selected.includes(el);
                setSelectedOptions((p) => ({
                  viewAll:
                    !hasOptionAlreadySelected &&
                    selectedOptions.selected.length ===
                      availableOptions.length - 1
                      ? true
                      : hasOptionAlreadySelected &&
                        selectedOptions.selected.length === 1
                      ? false
                      : p.viewAll,
                  selected: hasOptionAlreadySelected
                    ? [...selectedOptions.selected.filter((a) => a !== el)]
                    : [...selectedOptions.selected, el],
                }));
              }}
              inputProps={{ "aria-label": "controlled" }}
            />
            <Typography variant="body1">{el}</Typography>
          </FlexBox>
        ))}
      </Box>
    </Box>
  );
};

export default TwoLevelCheckboxFilter;
