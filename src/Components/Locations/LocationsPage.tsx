import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import LoadingSpinner from "../CustomComponents/LoadingSpinner";
import { location } from "@prisma/client";
import useFilterContent from "@/utilities/functions/hooks/useFilterContent";
import { isUserGameMaster } from "@/utilities/helperFn/isUserGameMaster";
import { Delete } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FlexBox } from "../CustomComponents/FlexBox";
import BuildIcon from "@mui/icons-material/Build";
import SearchBox from "../CustomComponents/SearchBox";
import { locationAndPartOfLocationIncluded } from "@/clients/Locations/locationsClient";
import TwoLevelCheckboxFilter from "../CustomComponents/TwoLevelCheckboxFilter";

const LocationsPage = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: worldLocations, isLoading } = useQuery<
    locationAndPartOfLocationIncluded[]
  >({
    queryKey: [
      `getAllLocationsInSelectedWorld`,
      { user_id: user?.user_id },
      { world_id: user?.selectedWorld?.location_id },
    ],
    queryFn: async () => {
      const { data } = await axios(
        `/api/worlds/locations/${user?.selectedWorld?.location_id}`
      );
      return data;
    },
    enabled: !!user,
  });

  function separateLocationScales(
    locationsArray: locationAndPartOfLocationIncluded[]
  ): {
    worldName: string;
    availableContinents: string[];
    availableKingdoms: string[];
    availableProvinces: string[];
    availableAreas: string[];
  } {
    const toRet: {
      worldName: string;
      availableContinents: string[];
      availableKingdoms: string[];
      availableProvinces: string[];
      availableAreas: string[];
    } = {
      worldName: "",
      availableContinents: [],
      availableKingdoms: [],
      availableProvinces: [],
      availableAreas: [],
    };
    for (const el of locationsArray) {
      switch (el.location_scale) {
        case "World":
          toRet.worldName = el.location_name;
          break;
        case "Continent":
          toRet.availableContinents.push(el.location_name);
          break;
        case "Kingdom":
          toRet.availableKingdoms.push(el.location_name);
          break;
        case "Province":
          toRet.availableProvinces.push(el.location_name);
          break;
        case "Area":
          toRet.availableAreas.push(el.location_name);
          break;
      }
    }
    return toRet;
  }

  const availableOptions = separateLocationScales(worldLocations || []);

  const [selectedContinentOptions, setSelectedContinentOptions] = useState(
    { viewAll: true, selected: availableOptions?.availableContinents } || {
      viewAll: true,
      selected: [],
    }
  );
  const [selectedKingdomOptions, setSelectedKingdomOptions] = useState(
    { viewAll: true, selected: availableOptions?.availableKingdoms } || {
      viewAll: true,
      selected: [],
    }
  );
  const [selectedProvinceOptions, setSelectedProvinceOptions] = useState(
    { viewAll: true, selected: availableOptions?.availableProvinces } || {
      viewAll: true,
      selected: [],
    }
  );
  const [selectedAreaOptions, setSelectedKAreaOptions] = useState(
    { viewAll: true, selected: availableOptions?.availableAreas } || {
      viewAll: true,
      selected: [],
    }
  );
  console.log(selectedContinentOptions);

  async function createLocationClickHandler() {}

  const {
    filterContentState,
    searchFieldState,
    sortTableColumn,
    setFilterContentState,
    handleSearchFieldKeyStroke,
    handleSearch,
    resetFilterContent,
  } = useFilterContent(worldLocations || []);

  useEffect(() => {
    setFilterContentState(worldLocations || []);
  }, [worldLocations, setFilterContentState]);

  function handleLocationRowClick(e: React.MouseEvent, location: location) {
    router.push(`/world/location/${location.location_id}`);
  }

  function handleEditLocationClick(e: React.MouseEvent, location: location) {
    router.push(`/world/location/${location.location_id}`);
  }

  async function handleDeleteLocationClick(
    e: React.MouseEvent,
    location: location
  ) {
    try {
      await axios.delete(`/api/world/location/${location.location_id}`);
      queryClient.invalidateQueries({
        queryKey: [
          "worldLocations",
          { user_id: session?.user?.user_id },
          { world_id: session?.selectedWorld?.location_id },
        ],
      });
    } catch (err) {
      console.log(err);
    }
  }

  if (!user || !session) {
    signOut();
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }
  console.log(availableOptions.availableContinents);
  return (
    <Box>
      Locations
      <Button onClick={createLocationClickHandler} variant="outlined">
        Create
      </Button>
      <FlexBox sx={{ flexDirection: "column", paddingTop: "1rem" }}>
        <FlexBox sx={{ gap: "0", alignItems: "stretch" }}>
          {isUserGameMaster(session) && (
            <Button
              variant="outlined"
              onClick={() => {
                router.push(`/location/manage-location/`);
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
        <TwoLevelCheckboxFilter
          availableOptions={availableOptions.availableContinents}
          selectedOptions={selectedContinentOptions}
          setSelectedOptions={setSelectedContinentOptions}
        />
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
                    sortTableColumn(e, "location_name")
                  }
                >
                  Name
                </TableCell>
                <TableCell
                  align="left"
                  onClick={(e) => sortTableColumn(e, "part_of")}
                >
                  Part of
                </TableCell>
                <TableCell
                  align="left"
                  onClick={(e) => sortTableColumn(e, "location_scale")}
                >
                  Scale
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterContentState &&
                filterContentState.map((location) => (
                  <TableRow
                    key={location.location_id}
                    hover
                    onClick={(e: React.MouseEvent<HTMLElement>) =>
                      handleLocationRowClick(e, location)
                    }
                  >
                    {isUserGameMaster(session) && (
                      <TableCell align="left" sx={{ width: "68px" }}>
                        <IconButton
                          onClickCapture={(
                            e: React.MouseEvent<HTMLElement>
                          ) => {
                            e.stopPropagation();
                            handleEditLocationClick(e, location);
                          }}
                          size="small"
                        >
                          <BuildIcon />
                        </IconButton>
                        <IconButton
                          onClickCapture={(
                            e: React.MouseEvent<HTMLElement>
                          ) => {
                            e.stopPropagation();
                            handleDeleteLocationClick(e, location);
                          }}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    )}
                    <TableCell align="left">{location.location_name}</TableCell>
                    <TableCell align="left">
                      {location?.location?.location_name}
                    </TableCell>
                    <TableCell align="left">
                      {location.location_scale}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </FlexBox>
    </Box>
  );
};

export default LocationsPage;
