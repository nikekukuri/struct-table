"use client";

import CytoscapeComponent from "react-cytoscapejs";
import { useState } from "react";
import { Button } from "@blueprintjs/core";
import { extractDependencies } from "./parse";
import { evaluate } from "mathjs";

// Why not Node.dependencies is not Node[]? => It is not a good for future extension if occures closed loop.
export interface NodeCache {
  id: string;
  name: string;
  view_name: string;
  expression: string;
  unit: string;
  status: string;
  current_value?: number;
  init_value: number;
  expected: number;
  dependencies: Dependency[];
  description: string;
  is_visited: boolean;
}

export interface Dependency {
  id: string;
  name: string;
  value?: number;
}

export interface Node {
  group: "nodes";
  data: Data;
  position?: { x: number; y: number };
}

export interface Edge {
  group: "edges";
  data: Data;
}

export interface Data {
  id: string;
  label?: string;
  info?: string;
  source?: string;
  target?: string;
}

const createEdge = (node: NodeCache): Edge[] => {
  const edges: Edge[] = [];
  for (const dependency of node.dependencies) {
    const edge: Edge = {
      group: "edges",
      data: {
        id: `${node.name}-${dependency.name}`,
        source: node.id,
        target: dependency.id,
      },
    };
    edges.push(edge);
  }
  return edges;
};

// TODO: error handling
const calculateExpression = (node: NodeCache): number => {
  let exp = node.expression;
  for (const dependency of node.dependencies) {
    if (dependency.value !== undefined) {
      exp = exp.replace(dependency.name, dependency.value.toString());
    }
  }
  return evaluate(exp);
};

const formatNodefromCache = (node: NodeCache): Node => {
  const newNode: Node = {
    group: "nodes",
    data: {
      id: node.id,
      label: node.name,
      info: `Expression: ${node.expression}\nExpected: ${node.expected}`,
    },
    position: { x: 100, y: 100 },
  };
  return newNode;
};

const EXAMPLE_DATA: NodeCache[] = [
  {
    id: "0",
    name: "result",
    view_name: "View 0",
    expression: "a + b",
    unit: "-",
    status: "calc",
    init_value: 0,
    expected: 3,
    dependencies: [],
    description: "",
    is_visited: false,
  },
  {
    id: "1",
    name: "a",
    view_name: "View a",
    expression: "c + d",
    unit: "-",
    status: "calc",
    init_value: 1,
    expected: 1,
    dependencies: [],
    description: "",
    is_visited: false,
  },
  {
    id: "2",
    name: "b",
    view_name: "View b",
    expression: "",
    unit: "-",
    status: "calc",
    init_value: 2,
    expected: 2,
    dependencies: [],
    description: "",
    is_visited: false,
  },
  {
    id: "3",
    name: "c",
    view_name: "View c",
    expression: "",
    unit: "-",
    status: "input",
    init_value: 3,
    expected: 3,
    dependencies: [],
    description: "",
    is_visited: false,
  },
  {
    id: "4",
    name: "d",
    view_name: "View d",
    expression: "",
    unit: "-",
    status: "input",
    init_value: 4,
    expected: 4,
    dependencies: [],
    description: "",
    is_visited: false,
  },
];

const Graph: React.FC = () => {
  const [selectedNode, setSelectedTable] = useState(null);

  // Make tree construction from the nodes.
  const exampleNodes: NodeCache[] = EXAMPLE_DATA;
  const addedDependenciesNodes = [];
  // TODO: three times loop is not good.
  for (const node of exampleNodes) {
    const dependencies: Dependency[] = [];
    const dependencyNames: string[] = extractDependencies(node);
    for (const dependencyName of dependencyNames) {
      for (const tmpNode of exampleNodes) {
        if (tmpNode.name === dependencyName) {
          dependencies.push({ id: tmpNode.id, name: tmpNode.name });
        }
      }
    }

    addedDependenciesNodes.push({
      ...node,
      dependencies: dependencies,
    });
  }
  console.log(addedDependenciesNodes);

  // Create edge from dependencies.
  const edges: Edge[] = [];
  for (const node of addedDependenciesNodes) {
    const edges_tmp = createEdge(node);
    for (const edge of edges_tmp) {
      edges.push(edge);
    }
  }
  console.log(edges);

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

  // TODO: startNode should be found by the status.

  const nodes: Node[] = [];
  for (const node of addedDependenciesNodes) {
    nodes.push(formatNodefromCache(node));
  }

  const elements = [];
  for (const node of nodes) {
    elements.push(node);
  }
  for (const edge of edges) {
    elements.push(edge);
  }

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
