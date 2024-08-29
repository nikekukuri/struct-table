import { tokenize, Token, TokenType } from "./tokenize";
import { NodeCache } from "./page";

export const extractDependencies = (node: NodeCache): string[] => {
  const tokens: Token[] = tokenize(node.expression);
  const dependencies: string[] = [];
  for (const token of tokens) {
    if (token.type === TokenType.Variable) {
      dependencies.push(token.value);
    }
  }

  return dependencies;
};
