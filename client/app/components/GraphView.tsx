"use client";

import CytoscapeComponent from "react-cytoscapejs";
import { useState, useEffect } from "react";
import { Button, InputGroup } from "@blueprintjs/core";
import { FormGroup } from "@blueprintjs/core";
import {
  addDependencies,
  extractDependencyNames,
  makeNodeGraph,
} from "./parse";
import { calculateGraph } from "./calc";
import { CsvReader } from "../components/ImportCsv";
import { EXAMPLE_DATA } from "./GraphExample";
import { ELEMENT_STYLE } from "./GraphStyle";
import { Data, Node, Edge, Csv } from "./types";

const createEdge = (node: Node): Edge[] => {
  const edges: Edge[] = [];
  for (const dependency of node.data.info.dependencies) {
    const edge: Edge = {
      group: "edges",
      data: {
        id: `${node.data.info.name}-${dependency.data.info.name}`,
        source: node.data.id,
        target: dependency.data.id,
      },
    };
    edges.push(edge);
  }
  return edges;
};

const getUniqueNodeID = (data: Data[]): string => {
  const ids = [];
  for (const d of data) {
    ids.push(parseInt(d.id));
  }
  let maxId = 0;
  for (const id of ids) {
    if (id > maxId) {
      maxId = id;
    }
  }

  return (maxId + 1).toString();
};

const serializeNode = (node: Node): Node[] => {
  const deps = node.data.info?.dependencies;
  const serialNodes: Node[] = [];
  if (deps?.length !== 0) {
    for (const dep of deps) {
      const tmpNode = serializeNode(dep);
      serialNodes.push(...tmpNode);
    }
  }

  serialNodes.push(node);
  return serialNodes;
};

const addPosition = (node: Node): Node => {
  return {
    ...node,
    position: {
      x: 100,
      y: 200 * node.data.info.depth,
    },
  };
};

const addLabel = (node: Node): Node => {
  //const lable = `${node.data.info.name}\n${node.data.info.viewName}\n${node.data.info.expression} = ${node.data.info.currentValue} ${node.data.info.unit}\nexpected: ${node.data.info?.expected} ${node.data.info.unit}`;
  const lable = `${node.data.info.name}\n${node.data.info.viewName}\n${node.data.info.expression} = ${node.data.info.currentValue} ${node.data.info.unit}`;
  return {
    ...node,
    data: {
      ...node.data,
      label: lable,
    },
  };
};

const createElements = (nodes: Node[]) => {
  const addedDependencyNamesNodes: Node[] = [];
  for (const node of nodes) {
    const dependencyNames: string[] = extractDependencyNames(node);
    const newNode: Node = {
      ...node,
      data: {
        ...node.data,
        label: "",
        info: {
          ...node.data.info,
          dependencyNames: dependencyNames,
        },
      },
    };
    addedDependencyNamesNodes.push(newNode);
  }

  const addedDependenciesNodes: Node[] = addDependencies(
    addedDependencyNamesNodes,
  );

  // TODO: targetNode should be selected by user.
  const targetNode = addedDependenciesNodes[0];
  const graphNodes: Node = makeNodeGraph(targetNode, addedDependenciesNodes);

  const calculatedNodes = calculateGraph(graphNodes);
  const serialNodes = serializeNode(calculatedNodes);

  const edges: Edge[] = [];
  for (const node of serialNodes) {
    const edges_tmp = createEdge(node);
    for (const edge of edges_tmp) {
      edges.push(edge);
    }
  }

  const elements = [];
  for (const node of serialNodes) {
    elements.push(addLabel(addPosition(node)));
  }
  for (const edge of edges) {
    elements.push(edge);
  }

  return elements;
};

export const Graph: React.FC = () => {
  const [name, setName] = useState("");
  const [viewName, setViewName] = useState<string>("");
  const [initValue, setInitValue] = useState<number>(0);
  const [expression, setExpression] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [desc, setDesc] = useState<string>("");

  const [elements, setElements] = useState<(Node | Edge)[]>([]);
  const [nodesData, setNodesData] = useState<Data[]>(EXAMPLE_DATA);

  const handleNodeSelection = (e: any) => {
    const selectedNode = e.target._private.data;
    console.log("---selectedNode---");
    console.log(selectedNode);
    setName(selectedNode.info.name);
    setViewName(selectedNode.info.viewName);
    setInitValue(selectedNode.info.initValue);
    setUnit(selectedNode.info.unit);
    setExpression(selectedNode.info.expression);
    setDesc(selectedNode.info.description);
  };

  const nodes: Node[] = [];
  for (const data of nodesData) {
    const node: Node = {
      group: "nodes",
      data: data,
    };
    nodes.push(node);
  }

  const elementFromNode = () => {
    const nodes: Node[] = [];
    for (const data of nodesData) {
      const node: Node = {
        group: "nodes",
        data: data,
      };
      nodes.push(node);
    }

    const elements = createElements(nodes);
    setElements(elements);
  };

  useEffect(elementFromNode, []);
  useEffect(elementFromNode, [nodesData]);

  const handleEditNodeButtonClick = () => {
    const targetName = name;
    const targetNodeIdx = nodesData.findIndex(
      (data) => data.info.name === targetName,
    );

    if (targetNodeIdx !== -1) {
      const updatedNodesData = [...nodesData];
      updatedNodesData[targetNodeIdx].info.name = name;
      updatedNodesData[targetNodeIdx].info.viewName = viewName;
      updatedNodesData[targetNodeIdx].info.initValue = initValue;
      updatedNodesData[targetNodeIdx].info.unit = unit;
      updatedNodesData[targetNodeIdx].info.expression = expression;
      updatedNodesData[targetNodeIdx].info.description = desc;
      setNodesData(updatedNodesData);
    }
    console.log("nodesData");
    console.log(nodesData);
  };

  const handleAddNodeButtonClick = () => {
    const id = getUniqueNodeID(nodesData);
    // TODO: properties should be selected by user.
    const newData: Data = {
      id: id,
      info: {
        name: name,
        viewName: viewName,
        expression: expression,
        unit: unit,
        status: "calc",
        initValue: 0,
        expected: 0,
        dependencies: [],
        dependencyNames: [],
        depth: 0,
        description: desc,
        isVisited: false,
      },
    };

    const updatedData = [...nodesData, newData];
    setNodesData(updatedData);
  };

  const handleCsvData = (data: Csv[]) => {
    const newNodesData: Data[] = [];
    for (const d of data) {
      const newData: Data = {
        id: d.id,
        info: {
          name: d.name,
          viewName: d.viewName,
          expression: d.expression ? d.expression : "",
          unit: d.unit,
          status: d.status,
          initValue: d.initValue,
          expected: d.expected,
          dependencies: d.dependencies,
          dependencyNames: d.dependencyNames,
          depth: d.depth,
          description: d.description,
          isVisited: false,
        },
      };
      newNodesData.push(newData);
    }
    setNodesData(newNodesData);
  };

  return (
    <>
      <div>
        <CsvReader onDataLoad={handleCsvData} />
      </div>
      <h1>GraphView</h1>
      <div
        style={{ width: "1200px", height: "600px" }}
        className="border border-black rounded-lg p-4"
      >
        <CytoscapeComponent
          elements={elements}
          style={{ width: "1200px", height: "600px" }}
          cy={(cy) => {
            cy.on("select", "node", handleNodeSelection);
          }}
          stylesheet={ELEMENT_STYLE}
        />
        <div className="items-center justify-center min-h-screen">
          <FormGroup className="p-8 by-gray-100 rounded-md">
            <div className="mb-4">
              <label>name</label>
              <InputGroup
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 border-gray-300 rounded"
              ></InputGroup>
            </div>
            <div className="mb-4">
              <label>view name</label>
              <InputGroup
                value={viewName}
                onChange={(e) => setViewName(e.target.value)}
                className="border-2 border-gray-300 rounded"
              ></InputGroup>
            </div>
            <div className="mb-4">
              <label>initial value</label>
              <InputGroup
                value={initValue}
                onChange={(e) => setInitValue(e.target.value)}
                className="border-2 border-gray-300 rounded"
              ></InputGroup>
            </div>
            <div className="mb-4">
              <label>expression</label>
              <InputGroup
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                className="border-2 border-gray-300 rounded"
              ></InputGroup>
            </div>{" "}
            <div className="mb-4">
              <label>unit</label>
              <InputGroup
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="border-2 border-gray-300 rounded"
              ></InputGroup>
            </div>
            <div className="mb-4">
              <label>Description</label>
              <InputGroup
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="border-2 border-gray-300 rounded"
              ></InputGroup>
            </div>
            <div className="flex space-x-4">
              <Button
                intent="success"
                onClick={handleEditNodeButtonClick}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Edit
              </Button>
              <Button
                intent="success"
                onClick={handleAddNodeButtonClick}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add
              </Button>
            </div>
          </FormGroup>
        </div>
      </div>
    </>
  );
};

export default Graph;
