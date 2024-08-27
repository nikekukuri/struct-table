"use client";

import CytoscapeComponent from "react-cytoscapejs";
import { calcExpression } from "./calc";

const Graph: React.FC = () => {
  const exp = "1 + 2 + 3";
  const result = calcExpression(exp);
  const elements = [
    { data: { id: "one", label: "Node 1" }, position: { x: 100, y: 100 } },
    { data: { id: "two", label: "Node 2" }, position: { x: 200, y: 200 } },
    {
      data: { source: "one", target: "two", label: "Edge from Node1 to Node2" },
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
        />
      </div>
    </>
  );
};

export default Graph;
