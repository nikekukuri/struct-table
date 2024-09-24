"use client";

import CytoscapeComponent from "react-cytoscapejs";
import { useState, useEffect } from "react";
import { Button, InputGroup } from "@blueprintjs/core";
import { FormGroup } from "@blueprintjs/core";
import { CsvReader } from "../../components/ImportCsv";
import { TableView, RelationTableProps } from "../../components/table";

interface List {
  elements: Record[] | Relation[];
  type: "record" | "relation";
  layer: number;
  source?: string;
  target?: string;
}

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

interface RecordsCsv {
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
  { id: "e2", label: "foo -> baz", source: "p0", target: "c2", },
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

const createElementsByRecord = (records: Record[]) => {
  const elements = [];
  for (const t of records) {
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

const TABLE_DATA: RelationTableProps = {
  parentCols: ["A-1", "A-2", "A-3", "A-4", "A-5"],
  childCols: ["B-1", "B-2", "B-3", "B-4", "B-5"],
  data: [
    ["○", "○", "○", "○", "○"],
    ["○", "-", "○", "○", "○"],
    ["-", "○", "◎", "○", "○"],
    ["○", "○", "○", "-", "○"],
    ["○", "◎", "○", "○", "○"],
  ]
};

const makeRelationByTable = ({ parentCols, childCols, data }: RelationTableProps): Relation[] => {
  const newRelations: Relation[] = [];
  // valilate data
  if (parentCols.length !== data.length) {
    throw new Error("parentCols.length !== data.length");
  }
  if (childCols.length !== data[0].length) {
    throw new Error("childCols.length !== data[0].length");
  }

  for (let i = 0; i < parentCols.length; i++) {
    for (let j = 0; j < childCols.length; j++) {
      const relation: Relation = {
        id: `${parentCols[i]}-${childCols[j]}`,
        source: `p${i}`,
        target: `c${j}`,
      };
      newRelations.push(relation);
    }
  }

  return newRelations;
};

const csvToRelationTable = (csv: string): RelationTableProps => {
  const rows = csv.trim().split('\r\n').map(row => row.split(',')); //TODO: error handling depend on file types.
  const parentCols = rows[0].slice(1);
  const childCols = rows.slice(1).map(row => row[0]);
  const data = rows.slice(1).map(row => row.slice(1));

  return {
    parentCols,
    childCols,
    data
  };
};

const TableRelation: React.FC = () => {
  const [label, setLabel] = useState<string>("");
  const [layer, setLayer] = useState<number | undefined>();
  const [criteria, setCriteria] = useState<Criteria | undefined>();
  const [description, setDescription] = useState<string>("");
  const [elements, setElements] = useState<(Node | Edge)[]>([]);

  const [selectedElement, setSelectedElement] = useState<Node | Edge | null>(null);

  const [records, setRecord] = useState<Record[]>([]);
  const [relations, setRelation] = useState<Relation[]>([]);

  const [source, setSource] = useState<string>("");
  const [target, setTarget] = useState<string>("");

  const [lists, setLists] = useState<List[]>([]);

  elements.push(...createElementsByRecord(EX_PARENT_TABLE));
  elements.push(...createElementsByRecord(EX_CHILD_TABLE));
  elements.push(...createElementsByRelation(EX_RELATION));

  lists.push({
    elements: EX_PARENT_TABLE,
    type: "record",
    layer: 1,
  })

  lists.push({
    elements: EX_CHILD_TABLE,
    type: "record",
    layer: 2,
  })

  lists.push({
    elements: EX_RELATION,
    type: "relation",
    layer: 1,
  })

  const createElements = () => {
    const elements = [];
    elements.push(...createElementsByRecord(records));
    elements.push(...createElementsByRelation(relations));
    console.log('lists');
    console.log(lists);
    console.log('elements');
    console.log(elements);
    setElements(elements);
  };

  useEffect(createElements, [records, relations]);

  const handleNodeSelection = (e: any) => {
    const selectedNode = e.target._private.data;
    console.log("---selectedNode---");
    console.log(selectedNode);
    setSelectedElement(selectedNode);
  };

  const handleEdgeSelection = (e: any) => {
    const selectedEdge = e.target._private.data;
    console.log("---selectedEdge---");
    console.log(selectedEdge);
    setSelectedElement(selectedEdge);
  };

  const handleRecordsCsvData = (records: RecordsCsv[]) => {
    const newRecords: Record[] = [];
    for (const r of records) {
      const newRecord: Record = {
        id: r.id.toString(),
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

  const handleRelationFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const csv = e.target?.result as string;
        const parsedData: RelationTableProps = csvToRelationTable(csv);
        const newRelations: Relation[] = makeRelationByTable(parsedData);
        setRelation(newRelations);
      };

      reader.readAsText(file);
    }
  };

  const deleteElement = () => {
    if (!selectedElement) {
      return;
    }

    const selId = selectedElement.data.id;
    const filteredElements = elements.filter((e) => e.data.id !== selId);

    setElements(filteredElements);
  }

  const addElement = () => {
    return;
  };

  const editElement = () => {
    return;
  };

  return ( 
    <> 
      <div className="flex space-x-12"> 
        <div>
        <h1>Import Records CSV</h1>
          <CsvReader onDataLoad={handleRecordsCsvData} />
        </div>
        <div>
          <h1>Import Relation CSV</h1>
            <div className="flex items-center">
              <label className="cursor-pointer text-blue-500 border border-blue-500 rounded-lg px-4 py-2 hover:bg-blue-100">
                ファイルを選択
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleRelationFileChange}
                  className="hidden"
                />
              </label>
            </div>
        </div>
      </div>
      <div>
        <h1 className="font-bold mt-4">Node Actions</h1>
      </div>
      <div className="flex space-x-4">
        <Button
          intent="success"
          onClick={deleteElement}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </Button>
        <Button
          intent="success"
          onClick={addElement}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >Add
        </Button>
        <Button
          intent="success"
          onClick={editElement}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Edit
        </Button>
      </div>
      <div>
        <h1 className="font-bold mt-4">Edge Actions</h1>
      </div>
      <div className="flex space-x-4">
        <Button
          intent="success"
          onClick={deleteElement}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </Button>
        <Button
          intent="success"
          onClick={addElement}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >Add
        </Button>
        <Button
          intent="success"
          onClick={editElement}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Edit
        </Button>
        <input
        type="text"
        placeholder="source"
        className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setSource(e.target.value)}
        />
        <input
        type="text"
        placeholder="target"
        className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setTarget(e.target.value)}
        />
      </div>
      <h1 className="mt-4">GraphView</h1>
      <div
        style={{ width: "2000px", height: "1000px" }}
        className="border border-black rounded-lg p-4"
      >
        <CytoscapeComponent
          elements={elements}
          style={{ width: "2000px", height: "1000px" }}
          cy={(cy) => {
            cy.on("select", "node", handleNodeSelection);
            cy.on("select", "edge", handleEdgeSelection);
          }}
          stylesheet={ELEMENT_STYLE}
        />
        <div className="items-center justify-center min-h-screen">
          <FormGroup className="p-8 by-gray-100 rounded-md">
            <div className="mb-4">
              <label>label</label>
              <InputGroup
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              ></InputGroup>
            </div>
            <div className="mb-4">
              <label>layer</label>
              <InputGroup
                value={layer ? layer.toString() : ""}
                onChange={(e) => setLayer(e.target.value)}
              ></InputGroup>
            </div>
            <div className="mb-4">
              <label>Description</label>
              <InputGroup
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></InputGroup>
            </div>
            {/* <div className="flex space-x-4">
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
            </div> */}
          </FormGroup>
        </div>
        <div>
          <TableView parentCols={TABLE_DATA.parentCols} childCols={TABLE_DATA.childCols} data={TABLE_DATA.data} />
        </div>
        <div>
          <h1>Debugging JSON Data</h1>
          <h2>records</h2>
          <pre>{JSON.stringify(records, null, 2)}</pre>
          <h2>relation</h2>
          <pre>{JSON.stringify(relations, null, 2)}</pre>
        </div>
      </div>
    </>
  )
};

export default TableRelation;
