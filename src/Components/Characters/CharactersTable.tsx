import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";
import React from "react";
import useTableSort from "@/utilities/functions/hooks/useTableSort";
import { Typography } from "@mui/material";
import { FlexBox } from "../CustomComponents/FlexBox";
import { sentient } from "@prisma/client";
import SearchBox from "../CustomComponents/SearchBox";

export default function CharactersTable({
  sentients,
}: {
  sentients: sentient[];
}) {
  const router = useRouter();
  const {
    tableState,
    searchFieldState,
    sortTableColumn,
    handleSearchFieldKeyStroke,
    handleSearch,
    resetTable,
  } = useTableSort(sentients);

  function handleCharacterRowClick(e: React.MouseEvent, character: sentient) {
    router.push(`/character/${character.sentient_id}`);
  }

  if (!sentients) {
    return <Typography variant="h5">No characters added!</Typography>;
  }

  return (
    <FlexBox sx={{ flexDirection: "column", paddingTop: "1rem" }}>
      <SearchBox
        handleSearchFieldKeyStroke={handleSearchFieldKeyStroke}
        handleSearch={handleSearch}
        searchFieldState={searchFieldState}
        resetTable={resetTable}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#eee" }}>
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
            {tableState.map((character) => (
              <TableRow
                key={character.sentient_id}
                hover
                onClick={(e: React.MouseEvent<HTMLElement>) =>
                  handleCharacterRowClick(e, character)
                }
              >
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
