import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import {
  availableOptions,
  getSelectedLocations,
  locationFilterState,
  separateLocationScales,
} from "@/utilities/helperFn/locations";

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

  const availableOptions: availableOptions = separateLocationScales(
    worldLocations || []
  );

  function selectAllLocations() {
    setContinents(availableOptions?.availableContinents);
    setKingdoms(availableOptions?.availableKingdoms);
    setProvinces(availableOptions?.availableProvinces);
    setAreas(availableOptions?.availableAreas);
  }

  function deselectAllLocations() {
    setContinents(() =>
      availableOptions?.availableContinents.map((el) => ({
        ...el,
        isSelected: false,
        isVisible: true,
      }))
    );
    setKingdoms(() =>
      availableOptions?.availableKingdoms.map((el) => ({
        ...el,
        isSelected: false,
        isVisible: false,
      }))
    );
    setProvinces(() =>
      availableOptions?.availableProvinces.map((el) => ({
        ...el,
        isSelected: false,
        isVisible: false,
      }))
    );
    setAreas(() =>
      availableOptions?.availableAreas.map((el) => ({
        ...el,
        isSelected: false,
        isVisible: false,
      }))
    );
  }

  const [continents, setContinents] = useState<locationFilterState[]>(
    availableOptions?.availableContinents
  );
  const [kingdoms, setKingdoms] = useState<locationFilterState[]>(
    availableOptions?.availableKingdoms
  );
  const [provinces, setProvinces] = useState<locationFilterState[]>(
    availableOptions?.availableProvinces
  );
  const [areas, setAreas] = useState<locationFilterState[]>(
    availableOptions?.availableAreas
  );

  const [selectedLocations, setSelectedLocations] = useState(worldLocations);
  async function createLocationClickHandler() {}

  const {
    filterContentState,
    searchFieldState,
    sortTableColumn,
    setFilterContentState,
    handleSearchFieldKeyStroke,
    handleSearch,
    resetFilterContent,
  } = useFilterContent(selectedLocations || []);

  useEffect(() => {
    const newSelectedLocations = [
      ...getSelectedLocations(continents),
      ...getSelectedLocations(kingdoms),
      ...getSelectedLocations(provinces),
      ...getSelectedLocations(areas),
    ];
    setSelectedLocations(newSelectedLocations);
    setFilterContentState(newSelectedLocations || []);
  }, [
    worldLocations,
    continents,
    kingdoms,
    provinces,
    areas,
    searchFieldState,
  ]);

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
    } catch (err) {}
  }

  if (!user || !session) {
    signOut();
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <Box
      sx={{
        maxWidth: "900px",
        margin: "auto",
      }}
    >
      <FlexBox
        sx={{
          alignItems: "flex-start",
          justifyContent: "flex-start",
          width: "100%",
          p: 1,
        }}
      >
        <FlexBox sx={{ flexDirection: "column", alignItems: "stretch" }}>
          <Button variant="outlined" onClick={selectAllLocations}>
            SelectAll
          </Button>
          <Button variant="outlined" onClick={deselectAllLocations}>
            None
          </Button>
        </FlexBox>
        <TwoLevelCheckboxFilter
          availableOptions={availableOptions.availableContinents}
          selectedOptions={continents}
          setSelectedOptions={setContinents}
          boxTitle="Continents"
          childState={kingdoms}
          setChildState={setKingdoms}
        />
        {getSelectedLocations(continents).length > 0 && (
          <TwoLevelCheckboxFilter
            availableOptions={availableOptions.availableKingdoms}
            selectedOptions={kingdoms}
            setSelectedOptions={setKingdoms}
            boxTitle="Kingdoms"
            childState={provinces}
            setChildState={setProvinces}
          />
        )}
        {getSelectedLocations(kingdoms).length > 0 && (
          <TwoLevelCheckboxFilter
            availableOptions={availableOptions.availableProvinces}
            selectedOptions={provinces}
            setSelectedOptions={setProvinces}
            boxTitle="Provinces"
            childState={areas}
            setChildState={setAreas}
          />
        )}
        {getSelectedLocations(provinces).length > 0 && (
          <TwoLevelCheckboxFilter
            availableOptions={availableOptions.availableAreas}
            selectedOptions={areas}
            setSelectedOptions={setAreas}
            boxTitle="Areas"
          />
        )}
      </FlexBox>

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

        <TableContainer component={Paper}>
          <Table
            sx={{
              maxWidth: "900px",
            }}
            aria-label="simple table"
            size="small"
          >
            <TableHead>
              <TableRow>
                {isUserGameMaster(session) && (
                  <>
                    <TableCell align="left"></TableCell>
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
                filterContentState?.map((location) => (
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
