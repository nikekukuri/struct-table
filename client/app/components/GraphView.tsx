"use client";

import CytoscapeComponent from "react-cytoscapejs";
import { useState, useEffect } from "react";
import { Button, InputGroup } from "@blueprintjs/core";
import { FormGroup } from "@blueprintjs/core";
import { addDependsOnParams } from "./parse";
import { calculateGraph, getNodeByName } from "./calc";
import { CsvReader } from "../components/ImportCsv";
import { EXAMPLE_DATA } from "./GraphExample";
import { ELEMENT_STYLE } from "./GraphStyle";
import { Data, Node, Edge, Csv } from "./types";

const createEdge = (nodes: Node[]): Edge[] => {
  const edges: Edge[] = [];
  for (const node of nodes) {
    const params = node.data.dependsOnParams;
    if (params !== undefined) {
      const tmpEdges = params.map(param => {
        const depNode = getNodeByName(nodes, param);
        if (depNode.data.dependsOnParams !== undefined) {
          return {
            group: "edges",
            data: {
              id: `${node.data.name}-${depNode.data.name}`,
              source: node.data.id,
              target: depNode.data.id,
            },
          };
        }
      })
      tmpEdges.map(edge => edges.push(edge));
    }
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

const addPosition = (node: Node): Node => {
  return {
    ...node,
    position: {
      x: 100,
      y: 200 * node.data.depth,
    },
  };
};

const addLabel = (node: Node, isDebug: boolean): Node => {
  let label, value;
  if (node.data.currentValue !== undefined) {
    value = "error";
  } else {
    value = node.data.currentValue.toFixed(2);
  }

  if (isDebug) {
    label = `${node.data.name}\n${node.data.viewName}\n${node.data.expression} = ${node.data.currentValue} ${node.data.unit}`;
  } else {
    label = `${node.data.viewName}\n${node.data.currentValue} ${node.data.unit}`;
  }

  return {
    ...node,
    data: {
      ...node.data,
      label: label,
    },
  };
};

const createElements = (nodes: Node[], isDebug: boolean) => {
  // Dependency variables of node names are updated.
  const addedDependsOnParamsNodes: Node[] = addDependsOnParams(nodes);

  console.log("addedDependsOnParamsNodes", addedDependsOnParamsNodes);
  const startIds = ["0"];
  const calcNodes = calculateGraph(addedDependsOnParamsNodes, startIds[0]);
  const edges = createEdge(calcNodes);

  const elements: (Node | Edge)[] = [];
  calcNodes.map(node => elements.push(addLabel(addPosition(node), isDebug)));
  edges.map(edge => elements.push(edge));

  return elements;
};

export const Graph: React.FC = () => {
  // for internal debug
  const [isDebug, setIsDebug] = useState(false);
  const handleDebugToggle = () => {
    setIsDebug(prev => !prev);
  };

  const [name, setName] = useState("");
  const [viewName, setViewName] = useState<string>("");
  const [initValue, setInitValue] = useState<number>(0);
  const [expression, setExpression] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [desc, setDesc] = useState<string>("");

  const [elements, setElements] = useState<(Node | Edge)[]>([]);
  const [nodesData, setNodesData] = useState<Data[]>(EXAMPLE_DATA);

  const deepEqual = (obj1: any, obj2: any) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  useEffect(() => {
    const nodes: Node[] = nodesData.map(data => ({
      group: "nodes",
      data: data,
    }));
    console.log("nodesData", nodesData);

    const newElements = createElements(nodes, isDebug);

    // if NOT updated element, don't render.
    if (!deepEqual(newElements, elements)) {
      setElements(newElements);
    }
  }, [nodesData, isDebug]);

  const handleNodeSelection = (e: any) => {
    const selectedNode = e.target._private.data;
    console.log("---selectedNode---");
    console.log(selectedNode);
    setName(selectedNode.name);
    setViewName(selectedNode.viewName);
    setInitValue(selectedNode.initValue);
    setUnit(selectedNode.unit);
    setExpression(selectedNode.expression);
    setDesc(selectedNode.description);
  };

  const handleEditNodeButtonClick = () => {
    const targetName = name;
    const targetNodeIdx = nodesData.findIndex(
      (data) => data.name === targetName,
    );

    if (targetNodeIdx !== -1) {
      const updatedNodesData = [...nodesData];
      updatedNodesData[targetNodeIdx].name = name;
      updatedNodesData[targetNodeIdx].viewName = viewName;
      updatedNodesData[targetNodeIdx].initValue = initValue;
      updatedNodesData[targetNodeIdx].unit = unit;
      updatedNodesData[targetNodeIdx].expression = expression;
      updatedNodesData[targetNodeIdx].description = desc;
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
      name: name,
      viewName: viewName,
      expression: expression,
      unit: unit,
      status: "calc",
      initValue: 0,
      expected: 0,
      dependsOnParams: [],
      depth: 0,
      description: desc,
      isVisited: false,
    };

    const updatedData = [...nodesData, newData];
    setNodesData(updatedData);
  };

  const handleCsvData = (data: Csv[]) => {
    const newNodesData: Data[] = [];
    for (const d of data) {
      const newData: Data = {
        id: d.id.toString(),
        name: d.name,
        viewName: d.viewName,
        expression: d.expression ? d.expression : "",
        unit: d.unit,
        status: d.status,
        initValue: d.initValue,
        expected: d.expected,
        dependsOnParams: d.dependsOnParams,
        depth: d.depth,
        description: d.description,
        isVisited: false,
      };
      newNodesData.push(newData);
    }

    // if NOT updated data, don't render.
    if (!deepEqual(newNodesData, nodesData)) {
      setNodesData(newNodesData);
    }
  };

  return (
    <>
      <div>
        <Button
          onClick={handleDebugToggle}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isDebug ? 'ON' : 'OFF'}
        </Button>
      </div>
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
