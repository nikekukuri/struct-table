import { evaluate } from "mathjs";
import { NodeCache } from "./page";

export const calculateGraph = (node: NodeCache): NodeCache => {
  const filledEdgesNode: NodeCache = fillInitialValueOnEdges(node);
  // console.log("---filledEdgesNode---");
  // console.log(filledEdgesNode);
  const calculatedNode = calculateRecursive(filledEdgesNode);
  calculatedNode.current_value = calculateExpression(calculatedNode);
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
    } else if (dependency.current_value === undefined) {
      // Calculate current value
      dependency.current_value = calculateExpression(dependency);
    }
    dependencyNodes.push(dependency);
  }
  calculatedNode.dependencies = dependencyNodes;
  return calculatedNode;
};

const isAllDependenciesCalculated = (node: NodeCache): boolean => {
  for (const dependency of node.dependencies) {
    if (dependency.current_value === undefined) {
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
      dependency.current_value = dependency.init_value;
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
    if (dependency.current_value !== undefined) {
      exp = exp.replace(dependency.name, dependency.current_value.toString());
    }
  }
  return evaluate(exp);
};