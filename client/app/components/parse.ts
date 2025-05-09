import { tokenize, Token, TokenType } from "./tokenize";
import { Node } from "./types";

export const extractDependsOnParams = (node: Node): string[] => {
  if (node.data.expression === undefined) {
    return [];
  }

  const tokens: Token[] = tokenize(node.data.expression);
  const dependencies: string[] = [];
  for (const token of tokens) {
    if (token.type === TokenType.Variable) {
      dependencies.push(token.value);
    }
  }

  return dependencies;
};

// Add nodes which use variable names ONLY.
export const addDependsOnParams = (nodes: Node[]): Node[] => {
  const newNodes: Node[] = [];
  for (const node of nodes) {
    const dependsOnParams: string[] = extractDependsOnParams(node);
    const newNode = {
      ...node,
      data: {
        ...node.data,
        label: "",
        dependsOnParams: dependsOnParams,
      },
    };
    newNodes.push(newNode);
  }

  return newNodes;
};
