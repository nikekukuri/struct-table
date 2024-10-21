import { send } from "process";
import React, { useState, useEffect } from "react";

export interface RelationTableProps {
  rowHeader: string[];
  colHeader: string[];
  selectedColHeader: string[];
  data: { row: string[]; color: string }[];
  sendSelectedColHeader: (colHeader: string[]) => void;
}

export const TableView: React.FC<RelationTableProps> = ({
  rowHeader,
  colHeader,
  selectedColHeader,
  data,
  sendSelectedColHeader,
}) => {
  const handleColHeaderChange = (index: number, value: string) => {
    const newColHeader = [...selectedColHeader];
    newColHeader[index] = value;
    sendSelectedColHeader(newColHeader);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse table-auto border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 bg-blue-500 px-4 py-2 text-left text-sm font-medium text-white">
              Items
            </th>
            {selectedColHeader.map((col, index) => (
              <th
                key={index}
                className="border border-gray-300 bg-blue-500 px-4 py-2 text-left text-sm font-medium text-white"
              >
                <select
                  value={col}
                  onChange={(e) => handleColHeaderChange(index, e.target.value)}
                  className="bg-blue-500 text-white text-sm"
                >
                  {colHeader.map((option, i) => (
                    <option key={i} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((dataRow, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${dataRow.color ? "bg-yellow-200" : "bg-gray-100"}`}
            >
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                {rowHeader[rowIndex]}
              </td>
              {dataRow.row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  className="border border-gray-300 px-4 py-2 text-sm text-gray-700"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
