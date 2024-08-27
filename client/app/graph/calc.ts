import { parseExpression } from "./parse";
import { evaluate } from "mathjs";

export const calcExpression = (exp: string): number => {
  const newExp = parseExpression(exp);
  return evaluate(newExp);
};
