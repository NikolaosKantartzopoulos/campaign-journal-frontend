import Button from "@mui/material/Button";
import { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  NativeSelect,
  TextField,
} from "@mui/material";
import { FlexBox } from "@/Components/CustomComponents/FlexBox";
import { toastMessage } from "@/Components/CustomComponents/Toastify/Toast";
import axios, { AxiosError } from "axios";
import { sentient } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const CharacterBasicInfo = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: sentient } = useQuery<sentient>({
    queryKey: [
      "sentient",
      { user_id: user?.user_id },
      { world_id: user?.selectedWorld?.location_id },
      { sentient_id: router.query.sentient_id },
    ],
    queryFn: async () => {
      const { data: sentient } = await axios(
        `/api/sentients/unique/${router.query.sentient_id}`
      );
      return sentient;
    },
    enabled: !!user,
  });

  const [firstName, setFirstName] = useState(sentient?.first_name || "");
  const [lastName, setLastName] = useState(sentient?.last_name || "");
  const [race, setRace] = useState(sentient?.race_name || "");
  const [shortTitle, setShortTitle] = useState(sentient?.short_title || "");
  const [vitality, setVitality] = useState(sentient?.state || "alive");

  async function handleCreateSentient() {
    try {
      await axios.post<sentient>("/api/sentients/unique", {
        first_name: firstName,
        last_name: lastName,
        race_name: race,
        short_title: shortTitle,
        state: vitality,
      });
      queryClient.invalidateQueries({
        queryKey: [
          "allSentients",
          { user_id: user?.user_id },
          { world_id: session?.selectedWorld?.location_id },
        ],
      });
      toastMessage("Character created", "success");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      toastMessage("There was an error", "error");
    }
  }

  async function handleEditSentient() {
    try {
      const { data } = await axios.patch("/api/sentients/unique", {
        sentient_id: sentient?.sentient_id,
        first_name: firstName,
        last_name: lastName,
        race_name: race,
        short_title: shortTitle,
        state: vitality,
      });
      queryClient.invalidateQueries({
        queryKey: [
          "sentient",
          { user_id: user?.user_id },
          { world_id: user?.selectedWorld?.location_id },
          { sentient_id: router.query.sentient_id },
        ],
      });
      toastMessage(data.message, "success");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toastMessage("There was an error", "error");
    }
  }

  return (
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
            defaultValue={sentient?.state || "alive"}
            inputProps={{
              name: "age",
            }}
            onChange={(e: any) => setVitality(e.target.value)}
          >
            <option value={"alive"}>Alive</option>
            <option value={"dead"}>Dead</option>
            <option value={"undead"}>Undead</option>
            <option value={"missing"}>Missing</option>
          </NativeSelect>
        </FormControl>
      </FlexBox>
      {!sentient && (
        <Button variant="contained" onClick={handleCreateSentient}>
          Create
        </Button>
      )}
      {sentient && (
        <Button
          variant="contained"
          onClick={() => {
            handleEditSentient();
            console.log("TODO edit character");
          }}
          disabled={
            firstName === sentient?.first_name &&
            lastName === sentient?.last_name &&
            race === sentient?.race_name &&
            shortTitle === sentient?.short_title &&
            vitality === sentient?.state
          }
        >
          Edit
        </Button>
      )}
    </Box>
  );
};

export default CharacterBasicInfo;
