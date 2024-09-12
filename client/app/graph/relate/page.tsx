"use client";

import React, { useState, useEffect } from "react";
import { CsvReader } from "../../components/ImportCsv";
import CytoscapeComponent from "react-cytoscapejs";
import { Edge, EdgeData } from "../page";

interface Node {
  group: "nodes";
  data: Data;
  position?: { x: number; y: number };
}

interface Data {
  id: string;
  label?: string;
}

const ELEMENT_STYLE = [
  {
    selector: "node",
    style: {
      shape: "rectangle", // Set shape to rectangle (square when width equals height)
      width: "100px", // Set width of the node
      height: "100px", // Set height of the node
      "background-color": "#6FB1FC",
      label: "data(label)",
      "text-valign": "center",
      "text-halign": "center",
      "font-size": "14px",
      color: "#ffffff",
      "text-wrap": "wrap", // Allow text to wrap within the node
      "text-max-width": "80px", // Set maximum width for text wrapping
    },
  },
  {
    selector: "edge",
    style: {
      "label": "data(label)",
      "text-rotation": "autorotate",
      "text-margin-y": -10,
      "font-size": "12px",
      "color": "#000",
      width: 3,
      "line-color": "#ccc",
      "target-arrow-color": "#ccc",
      "target-arrow-shape": "triangle",
    },
  },
  {
    selector: "node:selected",
    style: {
      "border-width": "4px",
      "border-color": "#FF5733",
      "background-color": "#FFB6C1",
      "text-outline-color": "#FF5733",
    },
  },
  {
    selector: ".highlighted",
    style: {
      "background-color": "#FF5733",
      "line-color": "#61bffc",
      "target-arrow-color": "#61bffc",
      "source-arrow-color": "#61bffc",
      "transition-property": "background-color, line-color, target-arrow-color, source-arrow-color",
      "transition-duration": "0.5s",
    },
  }
];

const extractNodes = (edges: EdgeData[]): string[] => {
  const edgeNames = [];
  for (const edge of edges) {
    edgeNames.push(edge.source);
    edgeNames.push(edge.target);
  }

  return Array.from(new Set(edgeNames));
};

const Relate: React.FC = () => {
  const [csvData, setCsvData] = useState<EdgeData[]>([]);
  const [elements, setElements] = useState<(Edge | Node)[]>([]);

  const handleCsvData = (data: EdgeData[]) => {
    setCsvData(data);
  };

  useEffect(() => {
    const newElements: (Edge | Node)[] = [];

    const nodeNames = extractNodes(csvData);
    for (const nodeName of nodeNames) {
      const node: Node = {
        group: "nodes",
        data: {
          id: nodeName,
          label: nodeName,
        },
        position: {
          x: 100,
          y: 100,
        }
      }
      newElements.push(node);
    }
    for (const data of csvData) {
      const edge: Edge = {
        group: "edges",
        data: {
          id: data["id"],
          source: data["source"],
          target: data["target"],
          label: data["value"],
        },
      };
      newElements.push(edge);
    }
    console.log("--- useEffect ---");
    console.log(newElements);
    setElements(newElements);
  }, [csvData]);

  return (
    <>
      <div>
        <p>select csv file</p>
        <CsvReader onDataLoad={handleCsvData} />
      </div>
      <div>
        <h1>GraphView</h1>
        <CytoscapeComponent
          elements={elements}
          style={{ width: "2000px", height: "600px" }}
          cy={(cy) => {
            cy.on("tap", "node", (evt) => {
              const node = evt.target;
              
              cy.elements().removeClass("highlighted");

              const connectedEdges = node.connectedEdges();
              connectedEdges.addClass("highlighted");

              const connectedNodes = connectedEdges.connectedNodes();
              connectedNodes.addClass("highlighted");
            });
          }}
          stylesheet={ELEMENT_STYLE}
        />
        <pre>{JSON.stringify(csvData, null, 2)}</pre>
      </div>
    </>
  );
};

export default Relate;
