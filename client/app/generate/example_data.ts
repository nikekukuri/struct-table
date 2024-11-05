import { columnData } from "./page";

export const EXAMPLE_PARENT_ROW_HEADER = ["A-1", "A-2", "A-3", "A-4", "A-5"];
export const EXAMPLE_CHILD_ROW_HEADER = ["C-1", "C-2", "C-3", "C-4", "C-5"];

export const LIST_A: columnData = {
  header: "foo",
  data: ["A-1", "hoge", "A-3", "fuga", "baz"],
};
export const LIST_B: columnData = {
  header: "bar",
  data: ["B-1", "hoge", "B-3", "", "baz"],
};
export const LIST_C: columnData = {
  header: "baz",
  data: ["C-1", "fuga", "C-3", "", "baz"],
};

export const EXAMPLE_RELATION = [
  ["○", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-"],
  ["-", "○", "-", "-", "-"],
  ["-", "-", "-", "○", "-"],
];

export const EXAMPLE_ROW_DATA = [
  { header: "C-1", isCheck: true },
  { header: "C-2", isCheck: true },
  { header: "C-3", isCheck: false },
  { header: "C-4", isCheck: false },
  { header: "C-5", isCheck: false },
];

export const EXAMPLE_CHILD_COLUMN_HEADER: string[] = [
  "col-1",
  "col-2",
  "col-3",
  "col-4",
  "col-5",
  "col-6",
  "col-7",
  "col-8",
  "col-9",
  "col-10",
];

export interface Data {
  row: string[];
  color: string;
}
export interface childData {
  header: string;
  data: Data;
}

export const EXAMPLE_CHILD_DATA: Data[] = [];
EXAMPLE_CHILD_ROW_HEADER.map((row) => {
  const data: string[] = [];
  EXAMPLE_CHILD_COLUMN_HEADER.map((col) => {
    const item: string = `${row}-${col}`;
    data.push(item);
  });
  EXAMPLE_CHILD_DATA.push({
    row: data,
    color: "",
  });
});
