import { tokenize, Token, TokenType } from "./tokenize";
import { NodeCache } from "./page";

export const extractDependencyNames = (node: NodeCache): string[] => {
  const tokens: Token[] = tokenize(node.expression);
  const dependencies: string[] = [];
  for (const token of tokens) {
    if (token.type === TokenType.Variable) {
      dependencies.push(token.value);
    }
  }

  return dependencies;
};

export const addDependencies = (nodes: NodeCache[]): NodeCache[] => {
  const newNodes: NodeCache[] = [];
  for (const node of nodes) {
    const dependencyNodes: NodeCache[] = [];
    for (const dependencyName of node.dependencyNames) {
      const dependencyNode = nodes.find((n) => n.name === dependencyName);
      if (dependencyNode) {
        dependencyNodes.push(dependencyNode);
      }
    }
    newNodes.push({ ...node, dependencies: dependencyNodes });
  }

  return newNodes;
};
