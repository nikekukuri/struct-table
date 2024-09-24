import { evaluate } from "mathjs";
import { Node } from "./page";

export const calculateGraph = (node: Node): Node => {
  const filledEdgesNode: Node = fillInitialValueOnEdges(node);
  const calculatedNode = calculateRecursive(filledEdgesNode);
  calculatedNode.data.info.currentValue = calculateExpression(calculatedNode);
  return calculatedNode;
};

export const calculateRecursive = (node: Node): Node => {
  const calculatedNode = { ...node };
  const dependencyNodes = [];
  for (const dependency of node.data.info.dependencies) {
    if (!isAllDependenciesCalculated(dependency)) {
      // Recursive process
      console.log(`Recursive process: ${dependency.data.info.name}`);
      const tmpNode = calculateRecursive(dependency);
      dependencyNodes.push(tmpNode);
    } else if (dependency.data.info.currentValue === undefined) {
      // Calculate current value
      dependency.data.info.currentValue = calculateExpression(dependency);
    }
    dependencyNodes.push(dependency);
  }
  calculatedNode.data.info.dependencies = dependencyNodes;
  return calculatedNode;
};

const isAllDependenciesCalculated = (node: Node): boolean => {
  for (const dependency of node.data.info.dependencies) {
    if (dependency.data.info.currentValue === undefined) {
      return false;
    }
  }
  return true;
};

const isEdgeNode = (node: Node): boolean => {
  if (node.data.info.dependencies.length === 0) {
    return true;
  }
  return false;
};

const fillInitialValueOnEdges = (node: Node): Node => {
  const newNode = { ...node };
  const dependencyNodes = [];
  for (const dependency of node.data.info.dependencies) {
    if (isEdgeNode(dependency)) {
      dependency.data.info.currentValue = dependency.data.info.initValue;
      dependencyNodes.push(dependency);
    } else {
      // Recursive process
      const tmpNode = fillInitialValueOnEdges(dependency);
      dependencyNodes.push(tmpNode);
    }
  }
  newNode.data.info.dependencies = dependencyNodes;
  return newNode;
};

const calculateExpression = (node: Node): number => {
  let exp = node.data.info.expression;
  for (const dependency of node.data.info.dependencies) {
    if (dependency.data.info.currentValue !== undefined) {
      exp = exp.replace(
        dependency.data.info.name,
        dependency.data.info.currentValue.toString(),
      );
    }
  }
  return evaluate(exp);
};
