"use client";

import * as React from "react";

import { Classes } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";
import { Cell, Column, ColumnHeaderCell, Table2 } from "@blueprintjs/table";
import './style.css'

// this will obviously get outdated, it's valid only as of August 2021
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

export default function TableExample() {
  return <TableDollarExample />;
}
