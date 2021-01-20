import { Expression, ValueExpression, SumExpression, SubExpression, MulExpression, DivExpression } from "./expression";
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
      result = this.processOperation(result, operation.text);
    }
    return result;
  }

  private processOperation(left: Expression, operation: string){
    switch (operation) {
      case "+": return new SumExpression(left, this.parseRightArg());
      case "-": return new SubExpression(left, this.parseRightArg());
      case "*": return new MulExpression(left, this.extractValue());
      case "/": return new DivExpression(left, this.extractValue());
    }
    throw new Error(`Unsupported operation: ${operation}`)
  }

  private extractValue(): Expression {
    return new ValueExpression(this.lexer.extractToken().text);
  }

  parseRightArg(): Expression {
    let result: Expression = this.extractValue();
    while (this.nextOperation() === "*" || this.nextOperation() === "/") {
      result = this.processOperation(result, this.lexer.extractToken().text);
    }
    return result;
  }

  private nextOperation(): string {
    const token = this.lexer.readToken();
    return token ? token.text : undefined;
  }
}