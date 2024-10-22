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