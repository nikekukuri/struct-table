import { tokenize, Token, TokenType } from "./tokenize";
import { Node } from "./page";

export const extractDependencyNames = (node: Node): string[] => {
  if (node.data.info === undefined) {
    return [];
  }

  const tokens: Token[] = tokenize(node.data.info.expression);
  const dependencies: string[] = [];
  for (const token of tokens) {
    if (token.type === TokenType.Variable) {
      dependencies.push(token.value);
    }
  }

  return dependencies;
};

export const addDependencies = (nodes: Node[]): Node[] => {
  const newNodes: Node[] = [];
  for (const node of nodes) {
    if (node.data.info === undefined) {
      return [];
    }

    const dependencyNodes: Node[] = [];
    for (const dependencyName of node.data.info.dependencyNames) {
      const dependencyNode = nodes.find(
        (n) => n.data.info?.name === dependencyName,
      );
      if (dependencyNode) {
        dependencyNodes.push(dependencyNode);
      }
    }
    newNodes.push({
      ...node,
      data: {
        ...node.data,
        info: {
          ...node.data.info,
          dependencies: dependencyNodes,
        },
      },
    });
  }

  return newNodes;
};

export const makeNodeGraph = (targetNode: Node, nodes: Node[]): Node => {
  const newNode = { ...targetNode };
  const depsNodes: Node[] = [];

  if (
    targetNode.data.info?.dependencyNames.length !== 0 &&
    targetNode.data.info?.isVisited === false
  ) {
    for (const name of targetNode.data.info?.dependencyNames) {
      const dependencyNode = nodes.find((n) => n.data.info?.name === name);
      if (dependencyNode) {
        const tmpNode = makeNodeGraph(dependencyNode, nodes);
        depsNodes.push(tmpNode);
      }
    }
  }
  newNode.data.info.dependencies = depsNodes;
  newNode.data.info.isVisited = true;
  return newNode;
};
