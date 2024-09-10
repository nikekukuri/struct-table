import { evaluate } from "mathjs";
import { NodeCache } from "./page";

export const calculateGraph = (node: NodeCache): NodeCache => {
  const filledEdgesNode: NodeCache = fillInitialValueOnEdges(node);
  // console.log("---filledEdgesNode---");
  // console.log(filledEdgesNode);
  const calculatedNode = calculateRecursive(filledEdgesNode);
  calculatedNode.currentValue = calculateExpression(calculatedNode);
  return calculatedNode;
};

export const calculateRecursive = (node: NodeCache): NodeCache => {
  // console.log("----calculateRecursive----");
  // console.log(node);
  const calculatedNode = { ...node };
  const dependencyNodes = [];
  for (const dependency of node.dependencies) {
    if (!isAllDependenciesCalculated(dependency)) {
      // Recursive process
      console.log(`Recursive process: ${dependency.name}`);
      const tmpNode = calculateRecursive(dependency);
      dependencyNodes.push(tmpNode);
    } else if (dependency.currentValue === undefined) {
      // Calculate current value
      dependency.currentValue = calculateExpression(dependency);
    }
    dependencyNodes.push(dependency);
  }
  calculatedNode.dependencies = dependencyNodes;
  return calculatedNode;
};

const isAllDependenciesCalculated = (node: NodeCache): boolean => {
  for (const dependency of node.dependencies) {
    if (dependency.currentValue === undefined) {
      return false;
    }
  }
  return true;
};

const isEdgeNode = (node: NodeCache): boolean => {
  if (node.dependencies.length === 0) {
    return true;
  }
  return false;
};

const fillInitialValueOnEdges = (node: NodeCache): NodeCache => {
  const newNode = { ...node };
  const dependencyNodes = [];
  for (const dependency of node.dependencies) {
    if (isEdgeNode(dependency)) {
      dependency.currentValue = dependency.initValue;
      dependencyNodes.push(dependency);
    } else {
      // Recursive process
      const tmpNode = fillInitialValueOnEdges(dependency);
      dependencyNodes.push(tmpNode);
    }
  }
  newNode.dependencies = dependencyNodes;
  return newNode;
};

const calculateExpression = (node: NodeCache): number => {
  let exp = node.expression;
  for (const dependency of node.dependencies) {
    if (dependency.currentValue !== undefined) {
      exp = exp.replace(dependency.name, dependency.currentValue.toString());
    }
  }
  return evaluate(exp);
};
