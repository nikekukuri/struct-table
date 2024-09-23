import React, { useState } from "react";

export interface TableViewProps {
  parentCols: string[];
  childCols: string[];
  data: string[][];
}

export const TableView: React.FC<TableViewProps> = ({ parentCols, childCols, data }) => {
  const [tableData, setTableData] = useState<string[][]>(data);

  const options = ['◎', '-', '○'];

  const handleChange = (rowIndex: number, colIndex: number, value: string) => {
    const updatedData = tableData.map((row, index) =>
      index === rowIndex
        ? row.map((cell, i) => (i === colIndex ? value : cell)) // 特定のセルの値を更新
        : row
    );
    setTableData(updatedData);
  };


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse table-auto border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left text-sm font-medium text-gray-700">
              Key
            </th>
            {childCols.map((col, index) => (
              <th
                key={index}
                className="border border-gray-300 bg-gray-100 px-4 py-2 text-left text-sm font-medium text-gray-700"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex} className="even:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                {parentCols[rowIndex]}
              </td>
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  className="border border-gray-300 px-4 py-2 text-sm text-gray-700"
                >
                  <select
                    className="w-full p-1 border border-gray-300 rounded"
                    value={cell} // 各セルの現在の値
                    onChange={(e) =>
                      handleChange(rowIndex, colIndex, e.target.value)
                    }
                  >
                    {options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );};


export default TableView;
