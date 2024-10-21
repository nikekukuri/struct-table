"use client";

import { useEffect, useState } from "react";

import { TableView } from "../components/TableView";
import { AppNavBar } from "../components/AppNavbar";
import { CsvReader } from "../components/ImportCsv";

import { diffList, rowData } from "./diff";
import { extractTargetChildByRelation } from "./relation";
import { Button } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { all } from "mathjs";

// TODOs
// 1. csvファイルから項目をリード
// 2. 差分を取得するデータを選択

interface columnData {
  header: string;
  data: string[];
}

const LIST_A: columnData = {
  header: "foo",
  data: ["A-1", "hoge", "A-3", "fuga", "baz"],
};
const LIST_B: columnData = {
  header: "bar",
  data: ["B-1", "hoge", "B-3", "", "baz"],
};
const LIST_C: columnData = {
  header: "baz",
  data: ["C-1", "fuga", "C-3", "", "baz"],
};

const EXAMPLE_TABLE_DATA = {
  rowHeader: ["A-1", "A-2", "A-3", "A-4", "A-5"],
  colHeader: ["B-1", "B-2", "B-3", "B-4", "B-5"],
  data: [
    { row: ["○", "-", "○", "○", "○"], color: "yellow" },
    { row: ["○", "-", "○", "○", "○"], color: "" },
    { row: ["-", "○", "◎", "○", "○"], color: "yellow" },
    { row: ["○", "○", "○", "-", "○"], color: "" },
    { row: ["○", "◎", "○", "○", "○"], color: "" },
  ],
};

const EXAMPLE_ROW_HEADER = ["A-1", "A-2", "A-3", "A-4", "A-5"];

const EXAMPLE_RELATION = [
  ["○", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-"],
  ["-", "○", "-", "-", "-"],
  ["-", "-", "-", "○", "-"],
];

const getColNumber = (allColHeader: string[], targetCols: string[]) => {
  const colNumbers: number[] = [];
  targetCols.map((col) => {
    colNumbers.push(allColHeader.indexOf(col));
  });
};

const generateTable = () => {
  const [contentTable, setContentTable] = useState<string[][]>([]);
  const handleContentsCsvData = (data: string[][]) => {
    setContentTable(data);
    console.log(data);
  };

  const [relationTable, setRelationTable] = useState<string[][]>([]);
  const handleRelationCsvData = (data: string[][]) => {
    const newTable: string[][] = [];
    data.map((row, i) => {
      const newRow: string[] = [];
      Object.keys(row).map((key: any, j: number) => {
        if (j > 0) {
          newRow.push(row[key]);
        }
      });
      newTable.push(newRow);
    });

    setRelationTable(newTable);
    console.log(newTable);
  };

  const [selectedColHeader, setSelectedColHeader] = useState<string[]>([
    LIST_A.header,
    LIST_B.header,
  ]);
  const handleSetColHeader = (headers: string[]) => {
    setSelectedColHeader(headers);
  };

  const [diffData, setDiffData] = useState<rowData[]>(
    diffList(LIST_A.data, LIST_B.data)
  );

  const allColumns = [LIST_A, LIST_B, LIST_C];
  const [tableData, setTableData] = useState({
    rowHeader: EXAMPLE_ROW_HEADER,
    colHeader: allColumns.map((col) => col.header),
    data: diffData,
  });

  useEffect(() => {
    const colNumbers: number[] = [];
    selectedColHeader.map((selCol) => {
      allColumns.map((col, i) => {
        if (selCol === col.header) {
          colNumbers.push(i);
        }
      });
    });

    const newDiffData = diffList(
      allColumns[colNumbers[0]].data,
      allColumns[colNumbers[1]].data
    );

    setDiffData(newDiffData);
    setTableData({
      rowHeader: EXAMPLE_ROW_HEADER,
      colHeader: allColumns.map((col) => col.header),
      data: newDiffData,
    });
  }, [selectedColHeader]);

  const childList = extractTargetChildByRelation(
    EXAMPLE_TABLE_DATA.rowHeader,
    EXAMPLE_TABLE_DATA.colHeader,
    EXAMPLE_RELATION
  );

  const generatedChildData: string[] = [];
  childList.header.map((h: string, i: number) => {
    if (childList.flag[i]) {
      generatedChildData.push(h);
    }
  });

  return (
    <>
      <AppNavBar />
      <div className="py-2">
        <p>Parent data CSV</p>
        <CsvReader onDataLoad={handleContentsCsvData} />
        <p>Relation table data CSV</p>
        <CsvReader onDataLoad={handleRelationCsvData} />
      </div>
      <TableView
        rowHeader={tableData.rowHeader}
        colHeader={tableData.colHeader}
        selectedColHeader={selectedColHeader}
        data={tableData.data}
        sendSelectedColHeader={handleSetColHeader}
      />
      <Button
        minimal
        className="cursor-pointer bg-blue-500 hover:bg-blue-700 rounded-lg py-4 text-white"
        icon={IconNames.GENERATE}
      >
        Generate
      </Button>
      <TableView
        rowHeader={generatedChildData}
        colHeader={tableData.colHeader}
        selectedColHeader={selectedColHeader}
        data={tableData.data}
        sendSelectedColHeader={handleSetColHeader}
      />
    </>
  );
};

export default generateTable;
