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
import { item, sentient } from "@prisma/client";
import SearchBox from "../CustomComponents/SearchBox";
import { isUserGameMaster } from "@/utilities/helperFn/isUserGameMaster";
import { useSession } from "next-auth/react";
import BuildIcon from "@mui/icons-material/Build";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../CustomComponents/LoadingSpinner";

export default function ItemsTable({ items }: { items: item[] }) {
  const { data: session } = useSession();
  const user = session?.user;
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    filterContentState,
    searchFieldState,
    sortTableColumn,
    setFilterContentState,
    handleSearchFieldKeyStroke,
    handleSearch,
    resetFilterContent,
  } = useFilterContent(items || []);

  useEffect(() => {
    setFilterContentState(items || []);
  }, [items, setFilterContentState]);

  function handleItemRowClick(e: React.MouseEvent, item: item) {
    router.push(`/item/${item.item_id}`);
  }

  function handleEditItemClick(e: React.MouseEvent, item: item) {
    router.push(`/item/manage-item/${item.item_id}`);
  }

  async function handleDeleteItemClick(e: React.MouseEvent, item: item) {
    try {
      await axios.delete(`/api/items/${item.item_id}`);
      queryClient.invalidateQueries({
        queryKey: [
          "allItems",
          { user_id: session?.user?.user_id },
          { world_id: session?.selectedWorld?.location_id },
        ],
      });
    } catch (err) {
      console.log(err);
    }
  }

  if (!items) {
    return <Typography variant="h5">No items added!</Typography>;
  }

  return (
    <FlexBox
      sx={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FlexBox
        sx={(theme) => ({
          flexDirection: "row",
          alignItems: "center",
          [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "center",
            maxWidth: "331px",
          },
        })}
      >
        {isUserGameMaster(session) && (
          <Button
            variant="outlined"
            onClick={() => {
              router.push(`/item/manage-item/`);
            }}
            sx={{ height: "40px" }}
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
                  sortTableColumn(e, "item_name")
                }
              >
                Name
              </TableCell>
              <TableCell
                align="left"
                onClick={(e) => sortTableColumn(e, "item_owner")}
              >
                Owner
              </TableCell>
              <TableCell
                align="left"
                onClick={(e) => sortTableColumn(e, "item_location")}
              >
                Location
              </TableCell>
              <TableCell
                align="left"
                onClick={(e) => sortTableColumn(e, "item_state")}
              >
                State
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterContentState &&
              filterContentState.map((item) => (
                <TableRow
                  key={item.item_id}
                  hover
                  onClick={(e: React.MouseEvent<HTMLElement>) =>
                    handleItemRowClick(e, item)
                  }
                >
                  {isUserGameMaster(session) && (
                    <TableCell align="left" sx={{ width: "68px" }}>
                      <IconButton
                        onClickCapture={(e: React.MouseEvent<HTMLElement>) => {
                          e.stopPropagation();
                          handleEditItemClick(e, item);
                        }}
                        size="small"
                      >
                        <BuildIcon />
                      </IconButton>
                      <IconButton
                        onClickCapture={(e: React.MouseEvent<HTMLElement>) => {
                          e.stopPropagation();
                          handleDeleteItemClick(e, item);
                        }}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  )}
                  <TableCell align="left">{item.item_name}</TableCell>
                  <TableCell align="left">{item.item_owner}</TableCell>
                  <TableCell align="left">{item.item_location}</TableCell>
                  <TableCell align="left">{item.item_state}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </FlexBox>
  );
}
