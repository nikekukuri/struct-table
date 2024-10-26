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

export const EXAMPLE_CHILD_COLUMN_HEADERS = [
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
]

const EXAMPLE_CHILD_DATA = [];
// EXAMPLE_CHILD_COLUMN_HEADERS.map((col) => {
//   
// })

