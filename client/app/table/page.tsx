"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import _ from 'lodash';
import { Cell, Column, ColumnHeaderCell, Table2 } from "@blueprintjs/table";
import './style.css'

const ExampleTableView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [cols, setCols] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tableName: string = "titanic_table";
        const queryCols = `
        query {
          getTableColumns(tableName: "${tableName}")
        }
        `;
        const url = "http://localhost:8000/graphql";

        const resCol = await fetch(url, {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: queryCols }),
          method: "POST",
        });

        const jsonCol = await resCol.json();
        setCols(jsonCol.data.getTableColumns.map(str => _.camelCase(str)))
        console.log(jsonCol.data.getTableColumns);

        const query = `
        query {
          getExampleRecords {
            ${jsonCol.data.getTableColumns.map(str => _.camelCase(str)).join("\n")}
          }
        }
        `;
        console.log(query);

        const res = await fetch(url, {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
          method: "POST",
        });

        const json = await res.json();
        setData(json.data);
        console.log(json.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  
  if (!data) {
    return <div>Loading...</div>; // データがロードされる前に「Loading」を表示
  }

  // FIXME: filter process
  // const [filter, setFilter] = useState<{ [key: string]: string }>({});

  // const filteredRecords = data.getExampleRecords.filter((record: any) =>
  //   cols.every((cols) => {
  //     const recordValue = record[cols]?.toString() || "";
  //     const filterValue = filter[cols] || "";
  //     return recordValue.includes(filterValue);
  //   })
  // );

  // return (
  //   <div>
  //     <h1>Table Data</h1>
  //     <pre>{JSON.stringify(data, null, 2)}</pre>
  //   </div>
  // );

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


  

  // FIXME: filter process
  // return (
  //   <Table2 numRows={filteredRecords.length}>
  //     {cols.map((column: string, index) => (
  //       <Column
  //         key={index}
  //         name={column}
  //         columnHeaderCellRenderer={() => (
  //           <ColumnHeaderCell name={column}>
  //             <input
  //               type="text"
  //               value={filter[column] || ''}
  //               onChange={(e) => setFilter({ ...filter, [column]: e.target.value })}
  //               placeholder={`Filter ${column} `}
  //             />
  //           </ColumnHeaderCell>
  //         )}
  //         cellRenderer={(rowIndex) => (
  //           <Cell>{filteredRecords[rowIndex][column]}</Cell>
  //         )}
  //       />
  //     ))}
  //   </Table2>
  // );
};

const Tables: React.FC = () => {
  // const [selectedTable, setSelectedTable] = useState<'testTable' | 'exampleTable'>('exampleTable');
  return (
    <div className="App">
      <h1 className="text-center text-xl font-bold mb-4">Table Viewer</h1>
        <ExampleTableView />
    </div>
  );
}

export default Tables;