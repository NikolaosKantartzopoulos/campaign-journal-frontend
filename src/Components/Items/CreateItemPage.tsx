import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  NativeSelect,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { FlexBox } from "../CustomComponents/FlexBox";
import axios, { AxiosError } from "axios";
import { toastMessage } from "../CustomComponents/Toastify/Toast";
import { useQueryClient } from "@tanstack/react-query";
import { sentientFullNameAndId } from "@/services/data-fetching/getSentients";
import { locationFullNameAndIdInterface } from "@/clients/Locations/locationsClient";

export function CreateItemPage({
  sentientNamesAndIds,
  locationNamesAndIds,
}: {
  sentientNamesAndIds: sentientFullNameAndId[];
  locationNamesAndIds: locationFullNameAndIdInterface[];
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [item_name, setItem_name] = useState<string>("");
  const [item_description, setItem_description] = useState<string>("");
  const [item_state, setItem_state] = useState("missing");
  const [custom_location_text, setCustom_location_text] = useState<string>("");

  async function handleCreateItem() {
    try {
      const { data: createdItem } = await axios.post("/api/items/", {
        item_name,
        item_description,
        item_state,
      });
      toastMessage("Item created", "success");

      queryClient.invalidateQueries({
        queryKey: ["allItems"],
      });

      router.push(`/item/manage-item/${createdItem?.item_id}`);
    } catch (error) {
      const err = error as AxiosError;
      toastMessage(
        // @ts-expect-error Error
        err?.response?.data?.message || "Try again",
        "error"
      );
    }
  }

  return (
    <Box
      sx={(theme) => ({
        m: 2,
        [theme.breakpoints.up("md")]: {
          width: "70%",
          mx: "auto",
        },
      })}
    >
      <Typography variant="h5" align="center">
        Create new item
      </Typography>

      <FlexBox sx={{ flexFlow: "column", alignItems: "center" }}>
        <TextField
          placeholder="Name"
          size="small"
          value={item_name}
          onChange={(e) => setItem_name(e.target.value)}
          label="Name"
          sx={{ margin: "2rem auto" }}
        />
        <FlexBox
          sx={{
            width: "100%",
            height: "48px",
            alignItems: "canter",
            justifyContent: "center",
          }}
        >
          <FormControl fullWidth sx={{ maxWidth: "150px" }}>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              State
            </InputLabel>
            <NativeSelect
              size="small"
              defaultValue={"missing"}
              inputProps={{
                name: "age",
              }}
              onChange={(e) => setItem_state(e.target.value)}
            >
              <option value={"on person"}>On person</option>
              <option value={"in place"}>At location</option>
              <option value={"missing"}>Missing</option>
            </NativeSelect>
          </FormControl>
          {item_state === "on person" && (
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={sentientNamesAndIds}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Character" />
              )}
            />
          )}
          {item_state === "in place" && (
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={locationNamesAndIds}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Location" />
              )}
            />
          )}
          {item_state === "missing" && (
            <TextField
              placeholder="at space"
              size="small"
              value={custom_location_text}
              onChange={(e) => setItem_name(e.target.value)}
              label="Custom Location"
              sx={{ width: "300px" }}
            />
          )}
        </FlexBox>
        <Typography variant="h5" align="center">
          Info
        </Typography>
        <TextareaAutosize
          style={{
            width: "100%",
            minHeight: "4rem",
            padding: "1rem",
          }}
          value={item_description}
          onChange={(e) => setItem_description(e.target.value)}
        />
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Button variant="outlined" onClick={() => router.push("/locations")}>
            Back
          </Button>
          <Button variant="outlined" onClick={handleCreateItem}>
            Create
          </Button>
        </Box>
      </FlexBox>
    </Box>
  );
}
