"use client";

import CytoscapeComponent from "react-cytoscapejs";
import { calcExpression } from "./calc";
import { useState } from "react";
import { Button } from "@blueprintjs/core";

const Graph: React.FC = () => {
  const [selectedNode, setSelectedTable] = useState(null);

  const handleNodeSelection = (e: any) => {
    const node = e.target;
    setSelectedTable({
      id: node.id(),
      label: node.data("label"),
      info: node.data("info"),
    });
  };

  const handleEditButtonClick = () => {
    if (selectedNode) {
      // Navigate to the edit screen (implement according to your routing/navigation setup)
      console.log("Navigating to edit screen for:", selectedNode);
      // Example: navigate(`/edit/${selectedNode.id}`, { state: { nodeData: selectedNode } });
    } else {
      alert("No node selected");
    }
  };

  const exp = "1 + 2 + 3";
  const result = calcExpression(exp);
  const elements = [
    {
      data: { id: "one", label: "Node 1", info: "info1" },
      position: { x: 100, y: 100 },
    },
    {
      data: { id: "two", label: "Node 2", info: "info2" },
      position: { x: 200, y: 200 },
    },
    {
      data: { source: "one", target: "two", label: "Edge from Node1 to Node2" },
    },
  ];

  const style = [
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
        "font-size": "12px",
        color: "#ffffff",
        "text-wrap": "wrap", // Allow text to wrap within the node
        "text-max-width": "80px", // Set maximum width for text wrapping
      },
    },
    {
      selector: "edge",
      style: {
        width: 3,
        "line-color": "#ccc",
        "target-arrow-color": "#ccc",
        "target-arrow-shape": "triangle",
      },
    },
  ];

  return (
    <>
      <div className="align-center">result = {result}</div>
      <div style={{ width: "500px", height: "500px" }}>
        <h1>GraphView</h1>
        <CytoscapeComponent
          elements={elements}
          style={{ width: "600px", height: "600px" }}
          cy={(cy) => {
            cy.on("select", "node", handleNodeSelection);
          }}
          stylesheet={style}
        />
        <Button
          intent="success"
          onClick={handleEditButtonClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Edit
        </Button>
      </div>
    </>
  );
};

export default Graph;
