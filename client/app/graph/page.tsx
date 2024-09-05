"use client";

import CytoscapeComponent from "react-cytoscapejs";
import { useState } from "react";
import { Button, InputGroup } from "@blueprintjs/core";
import {
  addDependencies,
  extractDependencyNames,
  makeNodeGraph,
} from "./parse";
import { calculateGraph } from "./calc";
import { FormGroup } from "@blueprintjs/core";

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
  dependencies: NodeCache[];
  dependencyNames: string[];
  description: string;
  is_visited: boolean;
}

export interface Node {
  group: "nodes";
  data: Data;
  position?: { x: number; y: number };
  additional?: Additional;
}

interface Additional {
  expression: string;
  value: number;
  name: string;
  viewName: string;
  dependencyNames: string[];
  unit: string;
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

const formatNodefromCache = (node: NodeCache): Node => {
  const label = `${node.name}\n \n${node.expression} = ${node.current_value} \n${node.expected}`;
  const newNode: Node = {
    group: "nodes",
    data: {
      id: node.id,
      label: label,
      info: `Expression: ${node.expression}\nExpected: ${node.expected}`,
      additional: {
        expression: node.expression,
        value: node.current_value ? node.current_value : node.init_value,
        viewName: node.view_name,
        dependencyNames: node.dependencyNames,
        unit: node.unit,
      },
    },
    position: { x: 100, y: 100 },
  };
  return newNode;
};

const formatNodefromCacheTree = (node: NodeCache): Node[] => {
  let serialNode: Node[] = [];
  serialNode.push(formatNodefromCache(node));
  for (const dependency of node.dependencies) {
    if (dependency.dependencies.length === 0) {
      const tmpNode = formatNodefromCache(dependency);
      serialNode.push(tmpNode);
    } else {
      const tmpNodes = formatNodefromCacheTree(dependency);
      serialNode = [...serialNode, ...tmpNodes];
    }
  }

  return serialNode;
};

const searchTargetNode = (node: NodeCache): NodeCache | null => {
  return node;
};

const EXAMPLE_DATA: NodeCache[] = [
  {
    id: "0",
    name: "result",
    view_name: "Top Node",
    expression: "a + b",
    unit: "-",
    status: "calc",
    init_value: 0,
    expected: 9,
    dependencies: [],
    dependencyNames: [],
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
    expected: 7,
    dependencies: [],
    dependencyNames: [],
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
    dependencyNames: [],
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
    dependencyNames: [],
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
    dependencyNames: [],
    description: "",
    is_visited: false,
  },
];

const Graph: React.FC = () => {
  const [name, setName] = useState("");
  const [viewName, setViewName] = useState("");
  const [value, setValue] = useState("");
  const [expression, setExpression] = useState("");

  const handleNodeSelection = (e: any) => {
    const node = e.target;
    setName(node.data.id);
    setViewName(node.data("additional").viewName);
    setValue(node.data("additional").value);
    setExpression(node.data("additional").expression);
  };

  // Make tree construction from the nodes.
  const exampleNodes: NodeCache[] = EXAMPLE_DATA;

  const addedDependencyNamesNodes: NodeCache[] = [];
  for (const node of exampleNodes) {
    const dependencyNames: string[] = extractDependencyNames(node);
    const newNode = { ...node, dependencyNames: dependencyNames };
    addedDependencyNamesNodes.push(newNode);
  }

  const addedDependenciesNodes: NodeCache[] = addDependencies(
    addedDependencyNamesNodes,
  );

  const edges: Edge[] = [];
  for (const node of addedDependenciesNodes) {
    const edges_tmp = createEdge(node);
    for (const edge of edges_tmp) {
      edges.push(edge);
    }
  }

  // TODO: targetNode should be selected by user.
  const targetNode = addedDependenciesNodes[0];
  const graphNodes: NodeCache = makeNodeGraph(
    targetNode,
    addedDependenciesNodes,
  );
  console.log("---graphNodes---");
  console.log(graphNodes);

  const calculateadNode = calculateGraph(graphNodes);
  console.log("---calculateadNodes---");
  console.log(calculateadNode);

  const handleUpdateButtonClick = () => {
    const node = searchTargetNode();
    if (false) {
    } else {
      alert("No node selected");
    }
  };

  // const nodes: Node[] = [];
  // for (const node of addedDependenciesNodes) {
  //   nodes.push(formatNodefromCache(node));
  // }
  // console.log("---serialNodes---");
  // console.log(nodes);

  const nodesFromGraph: Node[] = formatNodefromCacheTree(calculateadNode);
  console.log("---nodesFromGraph---");
  console.log(nodesFromGraph);

  const elements = [];

  for (const node of nodesFromGraph) {
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
    {
      selector: "node:selected",
      style: {
        "border-width": "4px",
        "border-color": "#FF5733",
        "background-color": "#FFB6C1",
        "text-outline-color": "#FF5733",
      },
    },
  ];

  return (
    <>
      <div style={{ width: "2000px", height: "600px" }}>
        <h1>GraphView</h1>
        <CytoscapeComponent
          elements={elements}
          style={{ width: "2000px", height: "600px" }}
          cy={(cy) => {
            cy.on("select", "node", handleNodeSelection);
          }}
          stylesheet={style}
        />
        <div className="items-center justify-center min-h-screen">
          <FormGroup className="p-8 by-gray-100 rounded-md">
            <div className="mb-4">
              <label>name</label>
              <InputGroup
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></InputGroup>
            </div>
            <div className="mb-4">
              <label>view name</label>
              <InputGroup
                value={viewName}
                onChange={(e) => setViewName(e.target.value)}
              ></InputGroup>
            </div>
            <div className="mb-4">
              <label>value</label>
              <InputGroup
                value={value}
                onChange={(e) => setValue(e.target.value)}
              ></InputGroup>
            </div>
            <div className="mb-4">
              <label>expression</label>
              <InputGroup
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
              ></InputGroup>
            </div>
            <Button
              intent="success"
              onClick={handleUpdateButtonClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit
            </Button>
          </FormGroup>
        </div>
      </div>
    </>
  );
};

export default Graph;
