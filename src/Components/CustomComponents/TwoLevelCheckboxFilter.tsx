import { Box, Checkbox, Typography } from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { FlexBox } from "./FlexBox";
import {
  createNewLocationState,
  getSelectedLocations,
  getVisibleLocations,
  locationFilterState,
} from "@/utilities/helperFn/locations";

export interface TwoLevelCheckboxInterface {
  availableOptions: locationFilterState[];
  selectedOptions: locationFilterState[];
  setSelectedOptions: Dispatch<SetStateAction<locationFilterState[]>>;
  boxTitle: string;
  childState?: locationFilterState[];
  setChildState?: Dispatch<SetStateAction<locationFilterState[]>>;
}

const TwoLevelCheckboxFilter = ({
  availableOptions,
  selectedOptions,
  setSelectedOptions,
  boxTitle,
  childState,
  setChildState,
}: TwoLevelCheckboxInterface) => {
  function handlePrimaryCheckbox() {
    const newState = [...availableOptions].map((el) => ({
      ...el,
      isSelected: getSelectedLocations(selectedOptions).length === 0,
    }));
    setSelectedOptions(newState);
    if (setChildState) {
      setChildState((p) =>
        createNewLocationState(getSelectedLocations(newState), p)
      );
    }
  }

  function handleSecondaryCheckbox(
    e: ChangeEvent<HTMLInputElement>,
    location: locationFilterState
  ) {
    const newLocationValue = {
      ...location,
      isSelected: !location.isSelected,
    };

    const restItems = selectedOptions.filter(
      (el) => el.location_id !== location.location_id
    );

    const newState = [...restItems, newLocationValue];

    setSelectedOptions(newState);

    if (setChildState) {
      setChildState((p) =>
        createNewLocationState(getSelectedLocations(newState), p)
      );
    }
  }

  if (getVisibleLocations(selectedOptions).length === 0) {
    return null;
  }
  return (
    <Box sx={{ minWidth: "150px" }}>
      <FlexBox sx={{ justifyContent: "flex-start", gap: 0 }}>
        <Checkbox
          checked={selectedOptions.filter((el) => el.isSelected).length !== 0}
          onChange={handlePrimaryCheckbox}
          inputProps={{ "aria-label": "controlled" }}
          disabled={
            childState ? getSelectedLocations(childState).length > 0 : false
          }
        />
        <Typography variant="body1">{boxTitle}</Typography>
      </FlexBox>

      <Box sx={{ marginLeft: "1rem", overflow: "auto", maxHeight: "150px" }}>
        {selectedOptions
          .filter((el) => el.isVisible)
          .sort((a, b) => a.location_name.localeCompare(b.location_name))
          .map((el) => (
            <FlexBox
              sx={{ justifyContent: "flex-start", gap: 0 }}
              key={el.location_id}
            >
              <Checkbox
                checked={el.isSelected}
                onChange={(e) => handleSecondaryCheckbox(e, el)}
                inputProps={{ "aria-label": "controlled" }}
                disabled={
                  childState
                    ? getSelectedLocations(childState).length > 0
                    : false
                }
              />
              <Typography variant="body1">{el.location_name} </Typography>
            </FlexBox>
          ))}
      </Box>
    </Box>
  );
};

export default TwoLevelCheckboxFilter;
