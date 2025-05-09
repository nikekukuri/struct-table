export interface Node {
  group: "nodes";
  data: Data;
  position?: { x: number; y: number };
}

export interface Edge {
  group: "edges";
  data: EdgeData;
}

export interface Data {
  id: string;
  label?: string;
  name: string;
  viewName: string;
  expression: string;
  unit: string;
  status: string;
  currentValue?: number;
  initValue: number;
  expected: number;
  dependsOnParams: string[];
  depth: number;
  description: string;
  isVisited: boolean;
}

export interface EdgeData {
  id: string;
  label?: string;
  source: string;
  target: string;
  value?: number;
}

export interface Csv {
  id: string;
  name: string;
  viewName: string;
  expression: string;
  unit: string;
  status: string;
  initValue: number;
  expected: number;
  dependsOnParams: string[];
  depth: number;
  description: string;
}
