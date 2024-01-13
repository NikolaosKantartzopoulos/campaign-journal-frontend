import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useFilterContent from "@/utilities/functions/hooks/useFilterContent";
import { Button, IconButton, Typography } from "@mui/material";
import { FlexBox } from "../CustomComponents/FlexBox";
import { sentient } from "@prisma/client";
import SearchBox from "../CustomComponents/SearchBox";
import { isUserGameMaster } from "@/utilities/helperFn/isUserGameMaster";
import { useSession } from "next-auth/react";
import BuildIcon from "@mui/icons-material/Build";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../CustomComponents/LoadingSpinner";

export default function CharactersTable() {
  const { data: session } = useSession();
  const user = session?.user;
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: sentients, isLoading } = useQuery<sentient[]>({
    queryKey: [
      "allSentients",
      { user_id: user?.user_id },
      { world_id: user?.selectedWorld?.location_id },
    ],
    queryFn: async () => {
      const { data: sentients } = await axios("/api/sentients/");
      return sentients;
    },
    enabled: !!user,
  });

  const {
    filterContentState,
    searchFieldState,
    sortTableColumn,
    setFilterContentState,
    handleSearchFieldKeyStroke,
    handleSearch,
    resetFilterContent,
  } = useFilterContent(sentients || []);

  useEffect(() => {
    setFilterContentState(sentients || []);
  }, [sentients, setFilterContentState]);

  function handleCharacterRowClick(e: React.MouseEvent, character: sentient) {
    router.push(`/character/${character.sentient_id}`);
  }

  function handleEditCharacterClick(e: React.MouseEvent, character: sentient) {
    router.push(`/character/manage-sentient/${character.sentient_id}`);
  }

  async function handleDeleteCharacterClick(
    e: React.MouseEvent,
    character: sentient
  ) {
    try {
      await axios.delete(`/api/sentients/unique/${character.sentient_id}`);
      queryClient.invalidateQueries({
        queryKey: [
          "allSentients",
          { user_id: session?.user?.user_id },
          { world_id: session?.selectedWorld?.location_id },
        ],
      });
    } catch (err) {
      console.log(err);
    }
  }
  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (!sentients) {
    return <Typography variant="h5">No characters added!</Typography>;
  }

  return (
    <FlexBox sx={{ flexDirection: "column", paddingTop: "1rem" }}>
      <FlexBox sx={{ gap: "0", alignItems: "stretch" }}>
        {isUserGameMaster(session) && (
          <Button
            variant="outlined"
            onClick={() => {
              router.push(`/character/manage-sentient/`);
            }}
          >
            Create
          </Button>
        )}
        <SearchBox
          handleSearchFieldKeyStroke={handleSearchFieldKeyStroke}
          handleSearch={handleSearch}
          searchFieldState={searchFieldState}
          clearSearchField={resetFilterContent}
        />
      </FlexBox>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              {isUserGameMaster(session) && (
                <>
                  <TableCell align="left" sx={{ width: "34px" }}></TableCell>
                </>
              )}
              <TableCell
                align="left"
                onClick={(e: React.MouseEvent) =>
                  sortTableColumn(e, "first_name")
                }
              >
                First Name
              </TableCell>
              <TableCell
                align="left"
                onClick={(e) => sortTableColumn(e, "last_name")}
              >
                Last Name
              </TableCell>
              <TableCell
                align="left"
                onClick={(e) => sortTableColumn(e, "short_title")}
              >
                Title
              </TableCell>
              <TableCell
                align="left"
                onClick={(e) => sortTableColumn(e, "race_name")}
              >
                Race
              </TableCell>
              <TableCell
                align="left"
                onClick={(e) => sortTableColumn(e, "state")}
              >
                State
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterContentState &&
              filterContentState.map((character) => (
                <TableRow
                  key={character.sentient_id}
                  hover
                  onClick={(e: React.MouseEvent<HTMLElement>) =>
                    handleCharacterRowClick(e, character)
                  }
                >
                  {isUserGameMaster(session) && (
                    <TableCell align="left" sx={{ width: "68px" }}>
                      <IconButton
                        onClickCapture={(e: React.MouseEvent<HTMLElement>) => {
                          e.stopPropagation();
                          handleEditCharacterClick(e, character);
                        }}
                        size="small"
                      >
                        <BuildIcon />
                      </IconButton>
                      <IconButton
                        onClickCapture={(e: React.MouseEvent<HTMLElement>) => {
                          e.stopPropagation();
                          handleDeleteCharacterClick(e, character);
                        }}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  )}
                  <TableCell align="left">{character.first_name}</TableCell>
                  <TableCell align="left">{character.last_name}</TableCell>
                  <TableCell align="left">{character.short_title}</TableCell>
                  <TableCell align="left">{character.race_name}</TableCell>
                  <TableCell align="left">{character.state}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </FlexBox>
  );
}
