"use client";

import * as React from "react";
import { useState } from "react";

import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery } from '@apollo/client';
import { Cell, Column, ColumnHeaderCell, Table2 } from "@blueprintjs/table";
import './style.css'
import { Tab, Tabs } from "@blueprintjs/core";
import { Button } from "@blueprintjs/core";

// Apollo client setup
const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
  cache: new InMemoryCache()
});

const GET_COLUMN_NAMES = gql`
  query {
    getTableColumns(tableName: "child_table")
  }
`

const ToggleViewColumn: React.FC = () => {
  const { loading, error, data } = useQuery(GET_COLUMN_NAMES);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error {error.message}</p>;
  const column_names: string[] = data.getTableColumns;
  console.log(column_names);
}

const GET_ONE_RECORD = gql`
  query getAllColumns($id: Int!) {
    getAllColumns(id: $id) {
      col1
      col2
      col3
      col4
    }
  }
`;

const GET_ALL_RECORD = gql`
  query {
    getAllRecords {
      col1
      col2
      col3
      col4
    }
  }
`;

const GET_EXAMPLE_RECORD = gql`
query {
  getExampleRecords {
    passengerId
    survived
    pclass
    name
    sex
    age
    sibsp
    parch
    ticket
    fare
    cabin
    embarked
  }
}
`;


const ExampleTable: React.FC<{ quadrantType: string }> = ({ quadrantType }) => {

  if (quadrantType !== "top-left") {
    return null;
  }

  const { loading, error, data } = useQuery(GET_EXAMPLE_RECORD);

  const [filter, setFilter] = useState<{ [key: string]: string }>({});

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error {error.message}</p>;


  if (!data || !data.getExampleRecords || !Array.isArray(data.getExampleRecords)) {
    return <p> No data available</p>;
  }

  const columns = Object.keys(data.getExampleRecords[0] || {});

  const filteredRecords = data.getExampleRecords.filter((record: any) =>
    columns.every((column) => {
      const recordValue = record[column]?.toString() || "";
      const filterValue = filter[column] || "";
      return recordValue.includes(filterValue);
    })
  );


  return (
    <Table2 numRows={filteredRecords.length}>
      {columns.map((column, index) => (
        <Column
          key={index}
          name={column}
          columnHeaderCellRenderer={() => (
            <ColumnHeaderCell name={column}>
              <input
                type="text"
                value={filter[column] || ''}
                onChange={(e) => setFilter({ ...filter, [column]: e.target.value })}
                placeholder={`Filter ${column}`}
              />
            </ColumnHeaderCell>
          )}
          cellRenderer={(rowIndex) => (
            <Cell>{filteredRecords[rowIndex][column]}</Cell>
          )}
        />
      ))}
    </Table2>
  );
};


/*
const ExampleTables: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>Blueprint.js Table Example</h1>
        <ExampleTables quadrantType="top-left" /> {}
      </div>
    </ApolloProvider>
  );
}
*/

const TestTable: React.FC<{ quadrantType: string }> = ({ quadrantType }) => {

  // const { loading_tmp, error_tmp, data_tmp } = useQuery(GET_COLUMN_NAMES);
  // if (loading_tmp) return <p>Loading...</p>;
  // if (error_tmp) return  <p>Error {error_tmp.message}</p>;
  //const column_names: string[] = data_tmp.getTableColumns;
  // console.log(data_tmp);

  if (quadrantType !== "top-left") {
    return null;
  }

  const { loading, error, data } = useQuery(GET_ALL_RECORD);

  // State for column filter
  const [col1Filter, setCol1Filter] = useState('');
  const [col2Filter, setCol2Filter] = useState('');
  const [col3Filter, setCol3Filter] = useState('');
  const [col4Filter, setCol4Filter] = useState('');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error {error.message}</p>;


  if (!data || !data.getAllRecords || !Array.isArray(data.getAllRecords)) {
    return <p> No data available</p>;
  }

  // Filtering logic
  const filteredRecords = data.getAllRecords.filter((record: any) =>
    record.col1.includes(col1Filter) &&
    record.col2.includes(col2Filter) &&
    record.col3.toString().includes(col3Filter) &&
    record.col4.toString().includes(col4Filter)
  );


  return (
    <Table2 numRows={filteredRecords.length}>
      <Column
        name="col1"
        columnHeaderCellRenderer={() => (
          <ColumnHeaderCell name="col1">
            <input
              type="text"
              value={col1Filter}
              onChange={(e) => setCol1Filter(e.target.value)}
              placeholder="Filter col1"
            />
          </ColumnHeaderCell>
        )}
        cellRenderer={(rowIndex) => <Cell>{filteredRecords[rowIndex].col1}</Cell>}
      />
      <Column
        name="col2"
        columnHeaderCellRenderer={() => (
          <ColumnHeaderCell name="col2">
            <input
              type="text"
              value={col2Filter}
              onChange={(e) => setCol2Filter(e.target.value)}
              placeholder="Filter col2"
            />
          </ColumnHeaderCell>
        )}
        cellRenderer={(rowIndex) => <Cell>{filteredRecords[rowIndex].col2}</Cell>}
      />
      <Column
        name="col3"
        columnHeaderCellRenderer={() => (
          <ColumnHeaderCell name="col3">
            <input
              type="text"
              value={col3Filter}
              onChange={(e) => setCol3Filter(e.target.value)}
              placeholder="Filter col3"
            />
          </ColumnHeaderCell>
        )}
        cellRenderer={(rowIndex) => <Cell>{filteredRecords[rowIndex].col3}</Cell>}
      />
      <Column
        name="col4"
        columnHeaderCellRenderer={() => (
          <ColumnHeaderCell name="col4">
            <input
              type="text"
              value={col4Filter}
              onChange={(e) => setCol4Filter(e.target.value)}
              placeholder="Filter col4"
            />
          </ColumnHeaderCell>
        )}
        cellRenderer={(rowIndex) => <Cell>{filteredRecords[rowIndex].col4}</Cell>}
      />
    </Table2>
  );
};

const Tables: React.FC = () => {
  //const [selectedTab, setSelectedTab] = useState<string>("testTable");
  const [selectedTable, setSelectedTable] = useState<'testTable' | 'exampleTable'>('testTable');

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1 className="text-center text-xl font-bold mb-4">Blueprint.js Table Example</h1>
        <div className="flex justify-center mb-4">
          <div className="flex space-x-4">
            <label className={`${selectedTable === "testTable"
              ? "bg-blue-400 text-white font-bold"
              : "text-slate-400 hover:bg-blue-100 transition"
              } border border-slate-100 border-r-0 text-blue rounded-l-lg p-2 `}
            >
              <input
                type="radio"
                name="table"
                value="testTable"
                checked={selectedTable === 'testTable'}
                onChange={() => setSelectedTable('testTable')}
                className="hidden"
              />
              <span className="ml-2">TestTable</span>
            </label>
            <label className={`${selectedTable === "exampleTable"
              ? "bg-blue-400 text-white font-bold"
              : "text-slate-400 hover:bg-blue-100 transition"
              } border border-slate-100 border-l-0 text-blue rounded-r-lg p-2 `}>
              <input
                type="radio"
                name="table"
                value="exampleTable"
                checked={selectedTable === 'exampleTable'}
                onChange={() => setSelectedTable('exampleTable')}
                className="hidden"
              />
              <span className="ml-2">ExampleTable</span>
            </label>
          </div>
        </div>
        {selectedTable === 'testTable' && <TestTable quadrantType="top-left" />}
        {selectedTable === 'exampleTable' && <ExampleTable quadrantType="top-left" />}
      </div>

    </ApolloProvider >
  );
}

export default Tables;
