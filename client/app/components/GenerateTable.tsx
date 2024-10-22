import React, { useState, useEffect } from "react";
import { childData } from "../generate/page";

export interface GenerateTableProps {
  rowData: childData[];
  colHeader: string[];
  data: { row: string[]; color: string }[];
}

export const GenerateTableView: React.FC<GenerateTableProps> = ({
  rowData,
  colHeader,
  data,
}) => {
  const rowHeader = rowData.map((row) => {
    return row.header;
  });
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse table-auto border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 bg-blue-500 px-4 py-2 text-left text-sm font-medium text-white">
              Items
            </th>
            {colHeader.map((col, index) => (
              <th
                key={index}
                className="border border-gray-300 bg-blue-500 px-4 py-2 text-left text-sm font-medium text-white"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((dataRow, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${
                rowData[rowIndex] ? "bg-yellow-200" : "bg-gray-100"
              }`}
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

export default GenerateTableView;
