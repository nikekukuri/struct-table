import { fetchVariableData } from "./fetch";

const isNumeric = (str: string): boolean => {
  const numericRegex = /^[+-]?\d+(\.\d+)?$/;
  return numericRegex.test(str);
};

const isReservedName = (token: string): boolean => {
  if (isNumeric(token)) {
    return true;
  }

  const reservedTokens: string[] = ["+", "-", "*", "/", "^"];

  for (const rt of reservedTokens) {
    if (token === rt) {
      return true;
    }
  }

  return false;
};

export const parseExpression = (exp: string): string => {
  // const exp = "1 + 2 * 3 ^ 3 * RN";
  const tableName = "titanic";
  const tokens = exp.split(" ");
  let newExp = exp;

  for (const token of tokens) {
    if (!isReservedName(token)) {
      let valName = token;
      let valValue = fetchVariableData(token, tableName);
      newExp = newExp.replace(valName, valValue);
    }
  }
  return newExp;
};
