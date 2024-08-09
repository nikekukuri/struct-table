"use client";

import * as React from "react";

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

const TestTable: React.FC<{ id: number, quadrantType: string }> = ({ id, quadrantType }) => {

  if (quadrantType !== "top-left") {
    return null;
  }

  const { loading, error, data } = useQuery(GET_ONE_RECORD, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error {error.message}</p>;


  if (data === undefined) {
    return <p> No data available</p>;
  }

  return (
    <Table2 numRows={1}>
      <Column
        name="col1"
        columnHeaderCellRenderer={() => <ColumnHeaderCell name="col1" />}
        cellRenderer={() => <Cell>{data.getAllColumns.col1}</Cell>}
      />
      <Column
        name="col2"
        columnHeaderCellRenderer={() => <ColumnHeaderCell name="col2" />}
        cellRenderer={() => <Cell>{data.getAllColumns.col2}</Cell>}
      />
      <Column
        name="col3"
        columnHeaderCellRenderer={() => <ColumnHeaderCell name="col3" />}
        cellRenderer={() => <Cell>{data.getAllColumns.col3}</Cell>}
      />
      <Column
        name="col4"
        columnHeaderCellRenderer={() => <ColumnHeaderCell name="col4" />}
        cellRenderer={() => <Cell>{data.getAllColumns.col4}</Cell>}
      />
    </Table2>
  );
}

const Tables: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>Blueprint.js Table Example</h1>
        <TestTable id={3} quadrantType="top-left" /> {/* IDを必要に応じて変更 */}
      </div>
    </ApolloProvider>
  );
}

export default Tables;
