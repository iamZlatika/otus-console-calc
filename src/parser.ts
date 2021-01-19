import { Expression, ValueExpression, SumExpression, SubtractionExpression, MultiplicationExpression, DivisionExpression } from "./expression";
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
        result = new SumExpression(result, this.parseRightArg());
      } else if (operation.text === "-") {
        result = new SubtractionExpression(result, this.parseRightArg());
      } else if (operation.text === "*") {
        result = new MultiplicationExpression(result, new ValueExpression(this.lexer.extractToken().text));
      } else if (operation.text === "/") {
        result = new DivisionExpression(result, new ValueExpression(this.lexer.extractToken().text));
      }
    }
    return result;
  }

  parseRightArg(): Expression {
    let result: Expression = new ValueExpression(this.lexer.extractToken().text);
    let nextToken = this.lexer.readToken();
    while (nextToken && (nextToken.text === "*" || nextToken.text === "/")) {
      this.lexer.extractToken();
      if (nextToken.text === "*") {
        result = new MultiplicationExpression(result, new ValueExpression(this.lexer.extractToken().text));
      } else {
        result = new DivisionExpression(result, new ValueExpression(this.lexer.extractToken().text));
      }
      nextToken = this.lexer.readToken();
    }
    return result;
  }
}
