"use client";

import * as React from "react";
import { useState } from "react";

import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery } from '@apollo/client';
import { Cell, Column, ColumnHeaderCell, Table2 } from "@blueprintjs/table";
import './style.css'

// Apollo client setup
const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
  cache: new InMemoryCache()
});

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

const TestTable: React.FC<{ quadrantType: string }> = ({ quadrantType }) => {

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
  const filteredRecords = data.getAllRecords.filter((record) =>
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
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>Blueprint.js Table Example</h1>
        <TestTable quadrantType="top-left" /> {/* IDを必要に応じて変更 */}
      </div>
    </ApolloProvider>
  );
}

export default Tables;
