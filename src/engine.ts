import { calcGrammar } from "./grammar";
import { ExpressionLexer, Lexer } from "./lexer";
import { ExpressionParser, Parser, ToRPNExpressionParser } from "./parser";

export const preprocessExpression = (expression: string): string => {
  const result = expression
    .replace(/\*\*/g, "^2")
    .replace(/ *([-+*/()^!]) */g, " $1 ")
    .replace(/ +/g, " ")
    .trim();
  return result;
};

export const evaluate = (expression: string, parser: (lexer: Lexer) => Parser): [Error | null, number | undefined] => {
  try {
    const parsedExpression = parser(new ExpressionLexer(calcGrammar, preprocessExpression(expression))).parse();
    return [null, parsedExpression ? parsedExpression.evaluate() : undefined];
  } catch (e) {
    return [e, undefined];
  }
};

export const evaluateExpression = (expression: string): [Error | null, number | undefined] => {
  return evaluate(expression, (lexer: Lexer) => new ExpressionParser(lexer));
};

export const evaluateRPNExpression = (expression: string): [Error | null, number | undefined] => {
  return evaluate(expression, (lexer: Lexer) => new ToRPNExpressionParser(lexer));
};
