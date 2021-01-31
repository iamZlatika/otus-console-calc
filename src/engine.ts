import { calcGrammar } from "./grammar";
import { ExpressionLexer } from "./lexer";
import { ExpressionParser } from "./parser";

export const preprocessExpression = (expression: string): string => {
  const result = expression
    .replace(/\*\*/g, "^2")
    .replace(/ *([-+*/()^!]) */g, " $1 ")
    .replace(/ +/g, " ")
    .trim();
  return result;
};

export const evaluate = (expression: string): [Error | null, number | undefined] => {
  try {
    const parsedExpression = new ExpressionParser(
      new ExpressionLexer(calcGrammar, preprocessExpression(expression))
    ).parse();
    return [null, parsedExpression ? parsedExpression.evaluate() : undefined];
  } catch (e) {
    return [e, undefined];
  }
};
