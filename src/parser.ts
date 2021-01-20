import { Expression, ValueExpression, SumExpression, SubExpression, MulExpression, DivExpression, PowExpression, SqrExpression, FactExpression } from "./expression";
import { Lexer } from "./lexer";
import { Token } from "./token";

export interface Parser {
  parse(): Expression;
}

const priorities = {"+": 1, "-": 1, "*": 2, "/": 2, "^": 3, "**": 3, "!": 3}

export class ExpressionParser implements Parser {
  constructor(readonly lexer: Lexer) {}

  parse(): Expression {
    let result = this.parseToken();
    let operation: Token;
    while ((operation = this.lexer.extractToken()) && operation.text !== ")") {
      result = this.processOperation(result, operation.text);
    }
    return result;
  }

  parseExpression(priority: number): Expression {
    let result = this.parseToken();
    while (priority < priorities[this.nextOperation()]) {
      result = this.processOperation(result, this.lexer.extractToken().text);
    }
    return result;
  }

  private parseToken(): Expression {
    const token = this.lexer.extractToken();
    if (!token) {
      return undefined;
    }
    if (token.text === "(") {
      return this.parse();
    }
    return new ValueExpression(token.text);
  }

  private processOperation(left: Expression, operation: string){
    switch (operation) {
      case "+": return new SumExpression(left, this.parseExpression(priorities[operation]));
      case "-": return new SubExpression(left, this.parseExpression(priorities[operation]));
      case "*": return new MulExpression(left, this.parseExpression(priorities[operation]));
      case "/": return new DivExpression(left, this.parseExpression(priorities[operation]));
      case "^": return new PowExpression(left, this.parseExpression(priorities[operation] - 1));
      case "**": return new SqrExpression(left);
      case "!": return new FactExpression(left);
    }
    throw new Error(`Unsupported operation: ${operation}`)
  }

  private nextOperation(): string {
    const token = this.lexer.readToken();
    return token ? token.text : undefined;
  }
}