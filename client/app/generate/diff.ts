export interface rowData {
  parent: string;
  row: string[];
  color: string;
  hasDiff: boolean;
}

// return [array1, array2], color: "yellow" if different
// TODO: color should be enum
// TODO: validate array1 and array2 have the same length
export const diffList = (
  array1: string[],
  array2: string[],
  parentList: string[]
): rowData[] => {
  const diff: rowData[] = [];
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      diff.push({
        parent: parentList[i],
        row: [array1[i], array2[i]],
        color: "yellow",
        hasDiff: true,
      });
    } else {
      diff.push({
        parent: parentList[i],
        row: [array1[i], array2[i]],
        color: "",
        hasDiff: false,
      });
    }
  }
  return diff;
};
