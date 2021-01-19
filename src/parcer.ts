import { Expression, ValueExpression, SumExpression } from "./expression";
import { Lexer } from "./lexer";

export interface Parser {
  parse(): Expression;
}

export class ExpressionParser implements Parser {
  constructor(readonly lexer: Lexer) {}

  parse(): Expression {
    const token = this.lexer.extractToken();
    if (!token) {
      return undefined;
    }
    let result: Expression = new ValueExpression(token.text);
    while (this.lexer.extractToken()) {
      result = new SumExpression(
        result,
        new ValueExpression(this.lexer.extractToken().text)
      );
    }
    return result;
  }
}
