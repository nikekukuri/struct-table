"use client";

import * as React from "react";
import { useState } from "react";

import { Classes } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery } from '@apollo/client';
import { Cell, Column, ColumnHeaderCell, Table2 } from "@blueprintjs/table";
import './style.css'

/// this will obviously get outdated, it's valid only as of August 2021
const USD_TO_EURO_CONVERSION = 0.85;

export class TableDollarExample extends React.PureComponent<ExampleProps> {
  public render() {
    const dollarCellRenderer = (rowIndex: number) => <Cell>{`$${(rowIndex * 10).toFixed(2)}`}</Cell>;
    const euroCellRenderer = (rowIndex: number) => (
      <Cell>{`€${(rowIndex * 10 * USD_TO_EURO_CONVERSION).toFixed(2)}`}</Cell>
    );
    return (
      <Example options={false} showOptionsBelowExample={true} {...this.props}>
        <Table2 numRows={20} enableGhostCells={true} enableFocusedCell={true}>
          <Column cellRenderer={dollarCellRenderer} columnHeaderCellRenderer={renderColumnHeader} />
          <Column cellRenderer={euroCellRenderer} columnHeaderCellRenderer={renderColumnHeader} />
        </Table2>
      </Example>
    );
  }
}

function renderColumnHeader(index: number) {
  const name = ["Dollars", "Euros"][index]!;
  return <ColumnHeaderCell name={name} index={index} nameRenderer={renderName} />;
}

function renderName(name: string) {
  return (
    <div style={{ lineHeight: "24px" }}>
      <div className={Classes.TEXT_LARGE}>
        <strong>{name}</strong>
      </div>
      <div className={Classes.MONOSPACE_TEXT}>Number</div>
    </div>
  );
}

// Test
//export default function TableExample() {
//  return <TableDollarExample />;
//}

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
  const filteredRecords = data.getAllRecords.filter(record =>
    record.col1.includes(col1Filter) &&
    record.col2.includes(col2Filter) &&
    record.col3.toString().includes(col3Filter) &&
    record.col4.toString().includes(col4Filter)
  );


  //const records = data.getAllRecords;
  //console.log(records);

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
}

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
