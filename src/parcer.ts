import {
  Expression,
  ValueExpression,
  SumExpression,
  SubtractionExpression,
} from "./expression";
import { Lexer } from "./lexer";
import { Token } from "./token";

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
    let operation: Token;
    while ((operation = this.lexer.extractToken())) {
      if (operation.text === "+") {
        result = new SumExpression(
          result,
          new ValueExpression(this.lexer.extractToken().text)
        );
      } else {
        result = new SubtractionExpression(
          result,
          new ValueExpression(this.lexer.extractToken().text)
        );
      }
    }
    return result;
  }
}
