"use client";

import { useEffect, useState } from "react";

import { TableView } from "../components/TableView";
import { AppNavBar } from "../components/AppNavbar";
import { CsvReader } from "../components/ImportCsv";

import { diffList, rowData } from "./diff";
import { extractTargetChildByRelation } from "./relation";
import { Button } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import GenerateTableView from "../components/GenerateTable";
import {
  EXAMPLE_PARENT_ROW_HEADER,
  EXAMPLE_CHILD_ROW_HEADER,
  LIST_A,
  LIST_B,
  LIST_C,
  EXAMPLE_RELATION,
  EXAMPLE_CHILD_DATA,
  EXAMPLE_CHILD_COLUMN_HEADER,
  EXAMPLE_ROW_DATA,
  Data,
} from "./example_data";

export interface columnData {
  header: string;
  data: string[];
}

export interface childData {
  header: string;
  isCheck: boolean;
}

const generateTable = () => {
  const handleContentsCsvData = (data: string[][]) => {
    console.log("Read csv data", data);

    // Get parent header
    const newParentHeader: string[] = [];
    data.map((row) => {
      newParentHeader.push(row.content); // TODO: temporary "content" key
    });
    console.log("parent header", newParentHeader);
    setParentHeaders(newParentHeader);

    const newColData: columnData[] = [];

    const newAllColHeader: string[] = [];
    Object.keys(data[0]).map((key, i) => {
      if (i > 0) {
        newAllColHeader.push(key);
      }
    });
    console.log("All column headers", newAllColHeader);

    newAllColHeader.map((header: string) => {
      const tdata: string[] = [];
      data.map((row) => {
        tdata.push(row[header]);
      });
      newColData.push({
        header: header,
        data: tdata,
      });
    });
    setAllColumns(newColData);
    console.log("newAllColData", newColData);
  };

  const [relationTable, setRelationTable] =
    useState<string[][]>(EXAMPLE_RELATION);
  const [parentHeaders, setParentHeaders] = useState<string[]>(
    EXAMPLE_PARENT_ROW_HEADER
  );
  const [childHeaders, setChildHeaders] = useState<string[]>(
    EXAMPLE_CHILD_ROW_HEADER
  );
  const handleRelationCsvData = (data: string[][]) => {
    console.log("Read csv data", data);

    // Get child header
    const newChildHeader: string[] = [];
    Object.keys(data[0]).map((key: string, i: number) => {
      if (i > 0) {
        newChildHeader.push(key);
      }
    });
    console.log("child header", newChildHeader);
    setChildHeaders(newChildHeader);

    // Get relation table
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
    console.log(newTable);
    setRelationTable(newTable);
  };

  //FIXME: bug
  const handleChildCsvData = (data: string[][]) => {
    console.log("Read csv data", data);

    // child row header
    const newChildHeader: string[] = [];
    Object.keys(data[0]).map((key: string, i: number) => {
      if (i > 0) {
        newChildHeader.push(key);
      }
    });
    console.log("Generated child header", newChildHeader);
    setGeneratedChildHeader(newChildHeader);

    // Get child table
    const newTable: Data[] = [];
    data.map((row) => {
      const tmpData: string[] = [];
      Object.keys(row).map((key: any, j: number) => {
        if (j > 0) {
          tmpData.push(row[key]);
        }
      });
      newTable.push({
        row: tmpData,
        color: "white", // TODO: ...
      });
    });
    console.log(newTable);
    setGeneratedData(newTable);
  };

  const [selectedColHeader, setSelectedColHeader] = useState<string[]>([
    LIST_A.header,
    LIST_B.header,
  ]);
  const handleSetColHeader = (headers: string[]) => {
    setSelectedColHeader(headers);
  };

  const [diffData, setDiffData] = useState<rowData[]>(
    diffList(LIST_A.data, LIST_B.data, parentHeaders)
  );

  const [allColumns, setAllColumns] = useState([LIST_A, LIST_B, LIST_C]);
  const [viewTableData, setViewTableData] = useState({
    rowHeader: parentHeaders,
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
      parentHeaders
    );

    setDiffData(newDiffData);
    setViewTableData({
      rowHeader: parentHeaders,
      colHeader: allColumns.map((col) => col.header),
      data: newDiffData,
    });
  }, [selectedColHeader, allColumns]);

  const [childList, setChildList] = useState(
    extractTargetChildByRelation(diffData, childHeaders, EXAMPLE_RELATION)
  );

  const [childData, setChildData] = useState<childData[]>(EXAMPLE_ROW_DATA);
  useEffect(() => {
    const newChildData: childData[] = [];
    childList.flags.map((flag: boolean, i: number) => {
      newChildData.push({ header: childList.headers[i], isCheck: flag });
    });
    setChildData(newChildData);
    console.log("newChildData", newChildData);
  }, [childList]);

  // ここでchildListを更新して上のuseEffectでchildDataを更新する（かなり微妙な連鎖状態なので直したい）
  const handleGenerateButtonClicked = () => {
    // selectedHeaderの差分からextractTargetChildByRelation()を実行
    const newChildList = extractTargetChildByRelation(
      diffData,
      childHeaders,
      relationTable
    );
    setChildList(newChildList);
  };

  const [generatedChildHeader, setGeneratedChildHeader] = useState(
    EXAMPLE_CHILD_COLUMN_HEADER
  );
  const [generatedData, setGeneratedData] = useState(EXAMPLE_CHILD_DATA);

  return (
    <>
      <AppNavBar />
      <div className="px-4">
        <div className="py-2">
          <p>Parent data CSV</p>
          <CsvReader onDataLoad={handleContentsCsvData} />
          <p>Relation table data CSV</p>
          <CsvReader onDataLoad={handleRelationCsvData} />
          <p>Child data CSV</p>
          <CsvReader onDataLoad={handleChildCsvData} />
        </div>
        <TableView
          rowHeader={viewTableData.rowHeader}
          colHeader={viewTableData.colHeader}
          selectedColHeader={selectedColHeader}
          data={viewTableData.data}
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
          colHeader={generatedChildHeader} // TODO: read from csv
          data={generatedData} // TODO: read from csv
        />
      </div>
    </>
  );
};

export default generateTable;
