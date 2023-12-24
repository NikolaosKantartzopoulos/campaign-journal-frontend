import { ChangeEvent, useState } from "react";

interface GenericObject {
  [key: string]: any;
}

export default function useTableSort<GenericObject>(
  initialState: GenericObject[]
) {
  const [tableState, setTableState] = useState(initialState);
  const [searchFieldState, setSearchFieldState] = useState<string>("");

  function handleSearchFieldKeyStroke(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    //@ts-ignore
    if (e.key === "Enter") {
      handleSearch();
      return;
    }
    setSearchFieldState(e.currentTarget.value);
  }

  function handleSearch() {
    setTableState((old) => []);
    checkIfPropertyExists(searchFieldState, tableState);
  }

  function checkIfPropertyExists(
    searchValue: string,
    targetArray: GenericObject[]
  ) {
    for (let item of targetArray) {
      let values = Object.values(item as GenericObject[]);
      for (let word of values) {
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

  const [selectedOrder, setSelectedOrder] = useState<
    "ascending" | "descending"
  >("ascending");

  function sortTableColumn(e: React.MouseEvent, columnName: string = "") {
    let ordered = [...tableState].sort((a, b) => {
      //@ts-ignore
      if (!a[columnName] || !b[columnName]) {
        return 0;
      }
      return selectedOrder === "ascending"
        ? //@ts-ignore
          a[columnName].localeCompare(b[columnName])
        : //@ts-ignore
          b[columnName].localeCompare(a[columnName]);
    });
    setSelectedOrder(
      selectedOrder === "ascending" ? "descending" : "ascending"
    );
    setTableState((p) => ordered);
  }

  return {
    tableState,
    sortTableColumn,
    searchFieldState,
    setSearchFieldState,
    handleSearch,
    handleSearchFieldKeyStroke,
  };
}
