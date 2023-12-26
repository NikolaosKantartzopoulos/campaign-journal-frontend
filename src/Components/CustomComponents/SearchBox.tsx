import { Box, Button, InputAdornment, TextField } from "@mui/material";
import { ChangeEvent } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface SearchBoxProps {
  handleSearchFieldKeyStroke: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSearch: () => void;
  searchFieldState: string;
  clearSearchField: () => void;
}

const SearchBox = ({
  handleSearchFieldKeyStroke,
  searchFieldState,
  clearSearchField,
  handleSearch,
}: SearchBoxProps) => {
  return (
    <Box sx={{ display: "flex", gap: "0px" }}>
      <TextField
        size="small"
        onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          handleSearchFieldKeyStroke(e)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (searchFieldState === "") {
              clearSearchField();
              return;
            }
            handleSearch();
          }
        }}
        value={searchFieldState}
        InputProps={{
          autoComplete: "off",
          endAdornment: (
            <InputAdornment
              position="end"
              onClick={clearSearchField}
              sx={{
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              <ClearIcon />
            </InputAdornment>
          ),
        }}
        sx={{ margin: "auto" }}
      />
      <Button variant="contained" onClick={handleSearch}>
        <SearchIcon />
      </Button>
    </Box>
  );
};

export default SearchBox;
