import { rowData } from "./diff";

const EXAMPLE_RELATION = [
  ["○", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-"],
  ["-", "○", "-", "-", "-"],
  ["-", "-", "-", "○", "-"],
];

interface childData {
  headers: string[];
  flags: boolean[];
}

// TODO: return match number of columns
export const extractTargetChildByRelation = (
  parentDiff: rowData[],
  childHeaders: string[],
  relationData: string[][]
) => {
  const parentHeaders: string[] = parentDiff.map((row) => {
    return row.parent;
  });

  if (!validateRelationData(parentHeaders, childHeaders, relationData)) {
    return [];
  }

  const flags = new Array(childHeaders.length).fill(false);
  relationData.map((row, i) => {
    row.map((value, j) => {
      if (parentDiff[i].hasDiff === true && value === "○") {
        flags[j] = true;
      }
    });
  });

  return { headers: childHeaders, flags: flags };
};

const validateRelationData = (
  parentHeader: string[],
  childHeader: string[],
  relationData: string[][]
) => {
  if (parentHeader.length !== relationData.length) {
    console.error("Parent header and relation data row length is different");
    return false;
  }

  if (childHeader.length !== relationData[0].length) {
    console.error("Child header and relation data column length is different");
    return false;
  }

  return true;
};
