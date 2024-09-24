"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import _ from "lodash";
import { Cell, Column, ColumnHeaderCell, Table2 } from "@blueprintjs/table";

import "./style.css";
import { AppNavBar } from "../../components/AppNavbar";

interface TableViewProps {
  tableName: string;
}

const TableView: React.FC<TableViewProps> = ({ tableName }) => {
  const [data, setData] = useState<any>(null);
  const [cols, setCols] = useState<string[]>([]);

  return (
    <Table2 numRows={data.getExampleRecords.length}>
      {cols.map((column: string, index) => (
        <Column
          key={index}
          name={column}
          cellRenderer={(rowIndex) => (
            <Cell>{data.getExampleRecords[rowIndex][column]}</Cell>
          )}
        />
      ))}
    </Table2>
  );
};

const Tables: React.FC = () => {
  return (
    <div className="table-view">
      <AppNavBar />
      <h1 className="text-center text-xl font-bold mb-4">Table Viewer</h1>
      <TableView tableName="titanic_table" />
    </div>
  );
};

export default Tables;
