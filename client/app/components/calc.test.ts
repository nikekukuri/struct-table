import { calcExpression } from "./calc";

console.log("test", () => {
  const exp = "1 + 2 + 3";
  const result: number = calcExpression(exp);
  const expected: number = 6;
  expect(result).toBe(expected);
});
