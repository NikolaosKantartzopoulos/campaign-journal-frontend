import { FlexBox } from "@/Components/CustomComponents/FlexBox";
import { toastMessage } from "@/Components/CustomComponents/Toastify/Toast";
import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  NativeSelect,
  TextField,
  Typography,
} from "@mui/material";
import { sentient } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function CreateSentient() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [race, setRace] = useState("");
  const [shortTitle, setShortTitle] = useState("");
  const [vitality, setVitality] = useState("alive");

  async function handleCreateSentient() {
    try {
      const { data: sentientCreated } = await axios.post<sentient>(
        "/api/sentients/unique",
        {
          first_name: firstName,
          last_name: lastName,
          race_name: race,
          short_title: shortTitle,
          state: vitality,
        }
      );
      queryClient.invalidateQueries({ queryKey: ["allSentients"] });
      router.push(`/character/manage-sentient/${sentientCreated.sentient_id}`);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toastMessage("There was an error", "error");
    }
  }

  return (
    <Card sx={{ m: "1rem auto", p: 1, maxWidth: "456px" }}>
      <Typography variant="h4" align="center" sx={{ mb: 1 }}>
        Create character
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <FlexBox>
          <TextField
            placeholder="Thor"
            size="small"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            label="First Name"
          />
          <TextField
            placeholder="Odinson"
            size="small"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            label="Last Name"
          />
        </FlexBox>
        <TextField
          placeholder="god of Thunder"
          size="small"
          value={shortTitle}
          onChange={(e) => setShortTitle(e.target.value)}
          label="Short Title"
        />
        <FlexBox>
          <TextField
            placeholder="Norse God"
            size="small"
            value={race}
            onChange={(e) => setRace(e.target.value)}
            label="Race"
          />
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              State
            </InputLabel>
            <NativeSelect
              size="small"
              defaultValue={"alive"}
              inputProps={{
                name: "age",
              }}
              onChange={(e) => setVitality(e.target.value)}
            >
              <option value={"alive"}>Alive</option>
              <option value={"dead"}>Dead</option>
              <option value={"undead"}>Undead</option>
              <option value={"missing"}>Missing</option>
            </NativeSelect>
          </FormControl>
        </FlexBox>
        <Button variant="contained" onClick={handleCreateSentient}>
          Create
        </Button>
      </Box>
    </Card>
  );
}
