import axios from "axios";
import { ChangeEvent, useState } from "react";

// interface GenericObject {
//   [key: string]: any;
// }

export default function useTableSort<GenericObject>(
  initialState: GenericObject[]
) {
  const [tableState, setTableState] = useState(initialState);
  const [searchFieldState, setSearchFieldState] = useState<string>("");

  async function handleSearchFieldKeyStroke(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setSearchFieldState(e.currentTarget.value);
  }

  async function handleSearch() {
    if (searchFieldState === "") {
      await clearSearchBar();
    }
    setTableState([]);
    checkIfPropertyExists(searchFieldState, tableState);
  }

  function checkIfPropertyExists(
    searchValue: string,
    targetArray: GenericObject[]
  ) {
    for (const item of targetArray) {
      const values = Object.values(item as GenericObject[]);
      for (const word of values) {
        if (
          word &&
          searchValue.toString().toLocaleLowerCase() ==
            word.toString().toLocaleLowerCase()
        ) {
          setTableState((old) => [...old, item]);
        }
      }
    }
  }

  const clearSearchBar = async () => {
    setSearchFieldState("");
    const { data: sentients } = await axios("/api/sentients/");
    setTableState(sentients);
    return;
  };

  const [selectedOrder, setSelectedOrder] = useState<
    "ascending" | "descending"
  >("ascending");

  function sortTableColumn(e: React.MouseEvent, columnName: string = "") {
    const ordered = [...tableState].sort((a, b) => {
      //@ts-expect-error Column name does not exist
      if (!a[columnName] || !b[columnName]) {
        return 0;
      }
      return selectedOrder === "ascending"
        ? //@ts-expect-error Column name does not exist
          a[columnName].localeCompare(b[columnName])
        : //@ts-expect-error Column name does not exist
          b[columnName].localeCompare(a[columnName]);
    });
    setSelectedOrder(
      selectedOrder === "ascending" ? "descending" : "ascending"
    );
    setTableState(() => ordered);
  }

  return {
    tableState,
    sortTableColumn,
    searchFieldState,
    setTableState,
    setSearchFieldState,
    handleSearch,
    clearSearchBar,
    handleSearchFieldKeyStroke,
  };
}
