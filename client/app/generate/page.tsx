"use client";

import { useEffect, useState } from "react";

import { TableView } from "../components/TableView";
import { AppNavBar } from "../components/AppNavbar";
import { CsvReader } from "../components/ImportCsv";

import { diffList, rowData } from "./diff";
import { extractTargetChildByRelation } from "./relation";
import { Button, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import GenerateTableView from "../components/GenerateTable";

interface columnData {
  header: string;
  data: string[];
}

export interface childData {
  header: string;
  isCheck: boolean;
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

const EXAMPLE_PARENT_ROW_HEADER = ["A-1", "A-2", "A-3", "A-4", "A-5"];
const EXAMPLE_CHILD_ROW_HEADER = ["C-1", "C-2", "C-3", "C-4", "C-5"];

const EXAMPLE_RELATION = [
  ["○", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-"],
  ["-", "○", "-", "-", "-"],
  ["-", "-", "-", "○", "-"],
];

const generateTable = () => {
  const [contentTable, setContentTable] = useState<string[][]>([]);
  const handleContentsCsvData = (data: string[][]) => {
    setContentTable(data);
    // 読み込みデータから親項目parentListを取得して更新
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

  const [parentList, setParentList] = useState<string[]>(
    EXAMPLE_PARENT_ROW_HEADER
  );
  const [diffData, setDiffData] = useState<rowData[]>(
    diffList(LIST_A.data, LIST_B.data, parentList)
  );

  const allColumns = [LIST_A, LIST_B, LIST_C];
  const [tableData, setTableData] = useState({
    rowHeader: EXAMPLE_PARENT_ROW_HEADER,
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
      allColumns[colNumbers[1]].data,
      EXAMPLE_PARENT_ROW_HEADER
    );

    setDiffData(newDiffData);
    setTableData({
      rowHeader: EXAMPLE_PARENT_ROW_HEADER,
      colHeader: allColumns.map((col) => col.header),
      data: newDiffData,
    });
  }, [selectedColHeader]);

  const [childList, setChildList] = useState(
    extractTargetChildByRelation(
      diffData,
      EXAMPLE_CHILD_ROW_HEADER, // ファイルから取得する
      EXAMPLE_RELATION // ファイルから取得する
    )
  );

  const [childData, setChildData] = useState<childData[]>([]);
  useEffect(() => {
    const newChildData: childData[] = [];
    childList.flags.map((flag: boolean, i: number) => {
      newChildData.push({ header: childList.headers[i], isCheck: flag });
    });
    setChildData(newChildData);
    console.log(newChildData);
  }, [childList]);

  // ここでchildListを更新して上のuseEffectでchildDataを更新する（かなり微妙なので直したい）
  const handleGenerateButtonClicked = () => {
    // selectedHeaderの差分からextractTargetChildByRelation()を実行
    const newChildList = extractTargetChildByRelation(
      diffData,
      EXAMPLE_CHILD_ROW_HEADER, // TODO: ファイルから取得する
      EXAMPLE_RELATION // TODO: ファイルから取得する
    );
    setChildList(newChildList);
  };

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
      <div className="py-2">
        <Button
          minimal
          className="cursor-pointer bg-green-500 hover:bg-green-700 rounded-lg py-2 px-4 text-white inline-flex items-center"
          onClick={handleGenerateButtonClicked}
          icon={IconNames.GENERATE}
        >
          <span className="ml-2">Generate</span>
        </Button>
      </div>
      <GenerateTableView
        rowData={childData}
        colHeader={tableData.colHeader}
        data={tableData.data}
      />
    </>
  );
};

export default generateTable;
