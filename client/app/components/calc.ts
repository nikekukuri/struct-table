import { evaluate } from "mathjs";
import { Node } from "./types";

export const getNodeByName = (nodes: Node[], name: string): Node | undefined => {
  return nodes.find((node) => node.data.name === name);
};

export const getNodeIdByName = (nodes: Node[], name: string): number | undefined => {
  return nodes.findIndex((node) => node.data.name === name);
};

export const calculateGraph = (nodes: Node[], startId: string): Node[] => {
  const terminateNodeFilledValue: Node[] = fillTerminateNodeValue(nodes);
  const startNode = nodes.find((node) => node.data.id === startId);
  return calcGraphScanning(terminateNodeFilledValue, startNode);
};

export const calcGraphScanning = (nodes: Node[], start: Node): Node[] => {
  let idStack: number[] = [];
  idStack.push(nodes.findIndex((node) => node === start));

  while (idStack.length !== 0) {
    // Get top of stack
    const i = idStack[idStack.length - 1];
    const targetNode = nodes[i];

    if (isTerm(targetNode)) {
      idStack.pop();
    } else if (isFilledDependsOnParams(nodes, targetNode)) {
      nodes[i].data.currentValue = calcExp(nodes, targetNode);
      idStack.pop();
    } else {
      const dependsOnIds = getDependsOnIds(
        nodes,
        targetNode.data.dependsOnParams,
      );
      dependsOnIds.map((id) => idStack.push(id));
    }
  }

  return nodes;
};

const getDependsOnIds = (nodes: Node[], params: string[]): number[] => {
  return params.map((param) =>
    nodes.findIndex((node) => node.data.name === param),
  );
};

const isTerm = (node: Node): boolean => {
  return node.data.dependsOnParams.length === 0;
};

// Check if the node is a terminal node.
const isFilledDependsOnParams = (nodes: Node[], target: Node): boolean => {
  console.log("target", target);
  const dependsOnParams = target.data.dependsOnParams;
  const dependsOnIds = getDependsOnIds(nodes, dependsOnParams);
  const isFills = dependsOnIds.map(
    (i) => nodes[i].data.currentValue !== undefined,
  );
  return isFills.every((flag) => flag === true);
};

// Fill the terminal node value with the initial value.
const fillTerminateNodeValue = (nodes: Node[]): Node[] => {
  return nodes.map((node) => {
    if (node.data.dependsOnParams.length === 0) {
      return updateNodeValue(node, node.data.initValue);
    } else {
      return node;
    }
  });
};

// Update the node value.
const updateNodeValue = (node: Node, value: number): Node => {
  return {
    ...node,
    data: {
      ...node.data,
      currentValue: value,
    },
  };
};

// calculate the expression value.
const calcExp = (nodes: Node[], target: Node): number => {
  let exp = target.data.expression;
  const dependsOnIds = getDependsOnIds(nodes, target.data.dependsOnParams);
  for (const i of dependsOnIds) {
    exp = exp.replace(
      nodes[i].data.name,
      nodes[i].data.currentValue.toString(),
    );
  }
  return evaluate(exp);
};
