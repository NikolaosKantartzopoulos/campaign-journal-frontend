import { ChangeEvent, useState } from "react";

// interface GenericObject {
//   [key: string]: any;
// }

export default function useTableSort<GenericObject>(
  initialState: GenericObject[]
) {
  const [tableState, setTableState] = useState(initialState);
  const [searchFieldState, setSearchFieldState] = useState<string>("");

  function handleSearchFieldKeyStroke(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setSearchFieldState(e.currentTarget.value);
  }

  function handleSearch() {
    if (searchFieldState === "") {
      resetTable();
    }
    setTableState(() => []);
    checkIfPropertyExists(searchFieldState, initialState);
  }

  function checkIfPropertyExists(
    searchValue: string,
    targetArray: GenericObject[]
  ) {
    for (const item of targetArray) {
      const values: (string | number | Date)[] = Object.values(
        item as GenericObject[]
      ) as (string | number | Date)[];
      const separatedValues = [];
      for (let i = 0; i < values.length; i++) {
        if (values[i]) {
          const wordStr = values[i].toString() as string;
          const splittedArray: string[] = wordStr.split(" ");
          separatedValues.push(...splittedArray);
        }
      }
      // example: separatedValues = [ "2","Bryan","Oldcastle","Mighty","three","Human"]
      for (const word of separatedValues) {
        const normalizedWord = word.toLocaleLowerCase();
        const normalizedSearchString = searchValue
          .toString()
          .trim()
          .toLocaleLowerCase();
        for (let i = 0; i < normalizedSearchString.length; i++) {
          if (normalizedWord[i] === normalizedSearchString[i]) {
            if (i === normalizedSearchString.length - 1) {
              setTableState((old) => [...old, item]);
            }
          } else break;
        }
      }
    }
  }

  const resetTable = () => {
    setSearchFieldState("");
    setTableState(initialState);
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
    resetTable,
    handleSearchFieldKeyStroke,
  };
}
