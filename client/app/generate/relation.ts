const EXAMPLE_RELATION = [
  ["○", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-"],
  ["-", "○", "-", "-", "-"],
  ["-", "-", "-", "○", "-"],
];

interface childData {
  header: string[];
  flag: boolean[];
}

// TODO: return match number of columns
export const extractTargetChildByRelation = (
  parentHeader: string[],
  childHeader: string[],
  relationData: string[][]
) => {
  if (!validateRelationData(parentHeader, childHeader, relationData)) {
    return [];
  }

  const flags = new Array(childHeader.length).fill(false);
  relationData.map((row) => {
    row.map((value, i) => {
      if (value === "○") {
        flags[i] = true;
      }
    });
  });

  return { header: childHeader, flag: flags };
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
