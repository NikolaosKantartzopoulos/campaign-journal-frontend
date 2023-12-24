export function sortTableColumn<T>(e, columnName: string, arr: T[]) {
  console.log(arr);
  console.log(columnName);
  return [...arr].sort((a, b) =>
    a[`${columnName}`].localeCompare(b[`${columnName}]`])
  );
}
