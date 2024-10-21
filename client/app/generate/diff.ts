export interface rowData {
  row: string[];
  color: string;
}

// return [array1, array2], color: "yellow" if different
// TODO: color should be enum
// TODO: validate array1 and array2 have the same length
export const diffList = (array1: string[], array2: string[]): rowData[] => {
  const diff: rowData[] = [];
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      diff.push({ row: [array1[i], array2[i]], color: "yellow" });
    } else {
      diff.push({ row: [array1[i], array2[i]], color: "" });
    }
  }
  return diff;
};
