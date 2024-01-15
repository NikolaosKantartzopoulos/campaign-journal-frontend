import {
  Box,
  FormControl,
  InputLabel,
  NativeSelect,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { useState } from "react";

const CreateLocationPage = () => {
  const [locationName, setLocationName] = useState<string>("");
  const [locationScale, setLocationScale] = useState<string>("");
  const [locationDescription, setLocationDescription] =
    useState<string>("Area");

  async function _createNewLocation() {
    console.log(locationName, locationScale, locationDescription);
  }

  return (
    <Box>
      Create Location Page
      <TextField
        label="Name"
        value={locationName}
        onChange={(e) => setLocationName(e.target.value)}
      />
      <Typography variant="h6">Description</Typography>
      <TextareaAutosize
        style={{
          width: "100%",
          minHeight: "4rem",
          padding: "1rem",
        }}
        value={locationDescription}
        onChange={(e) => setLocationDescription(e.target.value)}
      />
      <FormControl fullWidth>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
          State
        </InputLabel>
        <NativeSelect
          size="small"
          defaultValue={"Area"}
          inputProps={{
            name: "age",
          }}
          onChange={(e) => setLocationScale(e.target.value)}
        >
          <option value={"Continent"}>Continent</option>
          <option value={"Kingdom"}>Kingdom</option>
          <option value={"Province"}>Province</option>
          <option value={"Area"}>Area</option>
        </NativeSelect>
      </FormControl>
    </Box>
  );
};

export default CreateLocationPage;
