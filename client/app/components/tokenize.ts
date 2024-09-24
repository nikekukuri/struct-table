export enum TokenType {
  Number,
  Operator,
  Parenthesis,
  Variable,
  Unknown,
}

export interface Token {
  type: TokenType;
  value: string;
}

export const tokenize = (exp: string): Token[] => {
  const tokens: Token[] = [];
  let current = 0;

  while (current < exp.length) {
    let char = exp[current];

    if (char === "(" || char === ")") {
      tokens.push({ type: TokenType.Parenthesis, value: char });
      current++;
      continue;
    }

    if (
      char === "+" ||
      char === "-" ||
      char === "*" ||
      char === "/" ||
      char === "^"
    ) {
      tokens.push({ type: TokenType.Operator, value: char });
      current++;
      continue;
    }

    if (char === " ") {
      current++;
      continue;
    }

    if (/\d/.test(char) || (char === "." && /\d/.test(exp[current + 1]))) {
      let value = "";
      while (/\d/.test(char) || (char === "." && /\d/.test(exp[current + 1]))) {
        value += char;
        char = exp[++current];
      }
      tokens.push({ type: TokenType.Number, value });
      continue;
    }

    if (/[a-zA-Z_0]/.test(char)) {
      let value = "";

      while (/[a-zA-Z0-9_]/.test(char)) {
        value += char;
        +current++;
        if (current >= exp.length) break;
        char = exp[current];
      }
      tokens.push({ type: TokenType.Variable, value });
      continue;
    }

    tokens.push({ type: TokenType.Unknown, value: char });
    current++;
  }

  return tokens;
};
