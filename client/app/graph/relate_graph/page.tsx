"use client";

import CytoscapeComponent from "react-cytoscapejs";
import { useState, useEffect } from "react";
import { Button, InputGroup } from "@blueprintjs/core";
import { FormGroup } from "@blueprintjs/core";
import { CsvReader } from "../../components/ImportCsv";

export interface Node {
  group: "nodes";
  data: Record;
  position?: { x: number; y: number };
}

export interface Edge {
  group: "edges";
  data: Relation;
}

interface Record {
  id: string,
  label: string,
  layer: number,
  criteria: Criteria,
  description: string,
  conditions?: Condition,
}

interface Csv {
  id: string,
  label: string,
  layer: number,
  criteriaValue: number,
  criteriaJudge: string,
  description: string,
  conditions?: Condition,
}

interface Criteria {
  value: number,
  judge: Judge,
}

enum Judge {
  Greater,
  Less,
}

interface Condition {
  foo: string,
}

interface Relation {
  id: string,
  label?: string,
  source: string,
  target: string,
}

const EX_PARENT_TABLE: Record[] = [
  {
    id: "p0",
    label: "foo",
    layer: 1,
    criteria: {
      value: 1,
      judge: Judge.Greater,
    }, 
    description: "This is a test",
    conditions: {
      foo: "bar",
    },
  },
  {
    id: "p1",
    label: "bar",
    layer: 1,
    criteria: {
      value: 1,
      judge: Judge.Greater,
    }, 
    description: "This is a test",
    conditions: {
      foo: "bar",
    },
  },
  {
    id: "p2",
    label: "baz",
    layer: 1,
    criteria: {
      value: 1,
      judge: Judge.Greater,
    }, 
    description: "This is a test",
    conditions: {
      foo: "bar",
    },
  },
  {
    id: "p3",
    label: "hoge",
    layer: 1,
    criteria: {
      value: 1,
      judge: Judge.Greater,
    }, 
    description: "This is a test",
    conditions: {
      foo: "bar",
    },
  },
];

const EX_CHILD_TABLE: Record[] = [
  {
    id: "c0",
    label: "child foo",
    layer: 2,
    criteria: {
      value: 1,
      judge: Judge.Greater,
    }, 
    description: "This is a test",
    conditions: {
      foo: "bar",
    },
  },
  {
    id: "c1",
    label: "child bar",
    layer: 2,
    criteria: {
      value: 1,
      judge: Judge.Greater,
    }, 
    description: "This is a test",
    conditions: {
      foo: "bar",
    },
  },
  {
    id: "c2",
    label: "child baz",
    layer: 2,
    criteria: {
      value: 1,
      judge: Judge.Greater,
    }, 
    description: "This is a test",
    conditions: {
      foo: "bar",
    },
  },
  {
    id: "c3",
    label: "child hoge",
    layer: 2,
    criteria: {
      value: 1,
      judge: Judge.Greater,
    }, 
    description: "This is a test",
    conditions: {
      foo: "bar",
    },
  },
];

const EX_RELATION: Relation[] = [
  {
    id: "e0",
    label: "foo -> foo",
    source: "p0",
    target: "c0",
  },
  {
    id: "e1",
    label: "foo -> bar",
    source: "p0",
    target: "c1",
  },
  {
    id: "e2",
    label: "foo -> baz",
    source: "p0",
    target: "c2",
  },
  {
    id: "e3",
    label: "foo -> hoge",
    source: "p0",
    target: "c3",
  },
]

const ELEMENT_STYLE = [
  {
    selector: "node",
    style: {
      shape: "rectangle", // Set shape to rectangle (square when width equals height)
      "border-width": "2px",
      "border-color": "gray",
      "border-cap": "round",
      width: "200px", // Set width of the node
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

const createElementsByRecord = (table: Record[]) => {
  const elements = [];
  for (const t of table) {
    const node: Node = {
      group: "nodes",
      data: t,
      position: setPosition(t.id, t.layer),
    };
    elements.push(node);
  }

  return elements;
}

const OFFSET_X = 300;
const OFFSET_Y = 150;
const setPosition = (id: string, layer: number) => {
  const x = layer * OFFSET_X
  const y = extractNumbers(id) * OFFSET_Y;
  return { x, y };
}

const extractNumbers = (input: string): number => {
  return parseInt(input.replace(/\D/g, ''));
}

const createElementsByRelation = (relations: Relation[]) => {
  const elements = [];
  for (const r of relations) {
    const edge: Edge = {
      group: "edges",
      data: r,
    };
    elements.push(edge);
  }

  return elements;
}

const TableRelation: React.FC = () => {
  const [record, setRecord] = useState<Record[]>([]);

  const elements = [];
  elements.push(...createElementsByRecord(EX_PARENT_TABLE));
  elements.push(...createElementsByRecord(EX_CHILD_TABLE));
  elements.push(...createElementsByRelation(EX_RELATION));

  const handleNodeSelection = (e: any) => {
    const selectedNode = e.target._private.data;
    console.log("---selectedNode---");
    console.log(selectedNode);
  };

  console.log(elements);

  const handleCsvData = (records: Csv[]) => {
    const newRecords: Record[] = [];
    for (const r of records) {
      const newRecord: Record = {
        id: r.id,
        label: r.label,
        layer: r.layer,
        criteria: {
          value: r.criteriaValue,
          judge: r.criteriaJudge === "<" ? Judge.Less : Judge.Greater,
        },
        description: r.description,
      };
      newRecords.push(newRecord);
    }
    setRecord(newRecords);
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
        {/* <div className="items-center justify-center min-h-screen">
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
              <label>initial value</label>
              <InputGroup
                value={initValue}
                onChange={(e) => setInitValue(e.target.value)}
              ></InputGroup>
            </div>
            <div className="mb-4">
              <label>expression</label>
              <InputGroup
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
              ></InputGroup>
            </div>{" "}
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
        </div> */}
      </div>
    </>
  )
};

export default TableRelation;
