import React, { useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import Papa from "papaparse";

interface CsvData {
  [key: string]: string | number;
}

interface CsvReaderProps {
  onDataLoad: (data: CsvData[]) => void;
}

export const CsvReader: React.FC<CsvReaderProps> = ({ onDataLoad }) => {
  const [csvData, setCsvData] = useState<CsvData[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const text = event.target?.result as string;
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (result) => {
            const data = result.data as CsvData[];
            setCsvData(data);
            onDataLoad(data);
          },
        });
      };

      reader.readAsText(file);
    }
  };

  return (
    <>
      <div>
        <input type="file" accept=".csv" onChange={handleFileChange} />
      </div>
    </>
  );
};

export default CsvReader;
