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
  viewName: string;
  expression: string;
  unit: string;
  status: string;
  currentValue?: number;
  initValue: number;
  expected: number;
  dependencies: NodeCache[];
  dependencyNames: string[];
  description: string;
  isVisited: boolean;
}

export interface Node {
  group: "nodes";
  data: Data;
  position?: { x: number; y: number };
  additional?: Additional;
}

interface Additional {
  viewName: string;
  expression: string;
  unit: string;
  status: string;
  currentValue?: number;
  initValue: number;
  expected: number;
  dependencyNames: string[];
  description: string;
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

const formatNodefromCache = (nodeCache: NodeCache): Node => {
  const label = `${nodeCache.name}\n \n${nodeCache.expression} = ${nodeCache.currentValue} \nexpected: ${nodeCache.expected}`;
  const newNode: Node = {
    group: "nodes",
    data: {
      id: nodeCache.id,
      label: label,
      info: `Expression: ${nodeCache.expression}\nExpected: ${nodeCache.expected}`,
    },
    position: { x: 100, y: 100 },
    additional: {
      viewName: nodeCache.viewName,
      expression: nodeCache.expression,
      unit: nodeCache.unit,
      status: nodeCache.status,
      currentValue: nodeCache.currentValue,
      initValue: nodeCache.initValue,
      expected: nodeCache.expected,
      dependencyNames: nodeCache.dependencyNames,
      description: nodeCache.description,
    },
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

// Unique ID generator
const getUniqueNodeID = (nodes: NodeCache): string => {};

const EXAMPLE_DATA: NodeCache[] = [
  {
    id: "0",
    name: "result",
    viewName: "Top Node",
    expression: "a + b",
    unit: "-",
    status: "calc",
    initValue: 0,
    expected: 9,
    dependencies: [],
    dependencyNames: [],
    description: "",
    isVisited: false,
  },
  {
    id: "1",
    name: "a",
    viewName: "View a",
    expression: "c + d",
    unit: "-",
    status: "calc",
    initValue: 1,
    expected: 7,
    dependencies: [],
    dependencyNames: [],
    description: "",
    isVisited: false,
  },
  {
    id: "2",
    name: "b",
    viewName: "View b",
    expression: "",
    unit: "-",
    status: "calc",
    initValue: 2,
    expected: 2,
    dependencies: [],
    dependencyNames: [],
    description: "",
    isVisited: false,
  },
  {
    id: "3",
    name: "c",
    viewName: "View c",
    expression: "",
    unit: "-",
    status: "input",
    initValue: 3,
    expected: 3,
    dependencies: [],
    dependencyNames: [],
    description: "",
    isVisited: false,
  },
  {
    id: "4",
    name: "d",
    viewName: "View d",
    expression: "",
    unit: "-",
    status: "input",
    initValue: 4,
    expected: 4,
    dependencies: [],
    dependencyNames: [],
    description: "",
    isVisited: false,
  },
];

const Graph: React.FC = () => {
  const [newNode, setNewNode] = useState<NodeCache | null>(null);
  const [name, setName] = useState("");
  const [viewName, setViewName] = useState<string | undefined>("");
  const [unit, setUnit] = useState<string | undefined>("");
  const [expression, setExpression] = useState<string | undefined>("");
  const [desc, setDesc] = useState<string | undefined>("");

  const handleNodeSelection = (e: any) => {
    const selectedNode: Node = e.target;
    setName(selectedNode.data.id);
    setViewName(selectedNode.additional?.viewName);
    setUnit(selectedNode.additional?.unit);
    setExpression(selectedNode.additional?.expression);
    setDesc(selectedNode.additional?.description);
  };

  // Make tree construction from the nodes.
  let exampleNodes: NodeCache[] = EXAMPLE_DATA;

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

  const handleAddNodeButtonClick = () => {
    if (newNode === null) {
      return null;
    }

    const newId = getUniqueNodeID();
    const dependencyNames = extractDependencyNames(newNode);
    const node: NodeCache = {
      id: newId,
      name: name,
      viewName: viewName ? viewName : "",
      expression: expression ? expression : "",
      unit: unit ? unit : "",
      status: "",
      initValue: 0, // TODO: automatically calculated
      expected: 0, // TODO: if user input
      dependencies: [], // TODO: calculated after
      dependencyNames: dependencyNames,
      description: desc ? desc : "",
      isVisited: false,
    };
    if (newNode.currentValue !== undefined) {
      node.currentValue = newNode.currentValue;
    }
    return node;
  };

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
        "font-size": "14px",
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
              <label>expression</label>
              <InputGroup
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
              ></InputGroup>
            </div>
            <div className="mb-4">
              <label>unit</label>
              <InputGroup
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              ></InputGroup>
            </div>
            <div className="mb-4">
              <label>Description</label>
              <InputGroup
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              ></InputGroup>
            </div>
            <Button
              intent="success"
              onClick={handleAddNodeButtonClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add
            </Button>
          </FormGroup>
        </div>
      </div>
    </>
  );
};

export default Graph;
