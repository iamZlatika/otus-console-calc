import { Expression, ValueExpression, SumExpression, SubExpression, MulExpression, DivExpression, PowExpression } from "./expression";
import { Lexer } from "./lexer";
import { Token } from "./token";

export interface Parser {
  parse(): Expression;
}

const priorities = {"+": 1, "-": 1, "*": 2, "/": 2, "^": 3}

export class ExpressionParser implements Parser {
  constructor(readonly lexer: Lexer) {}

  parse(): Expression {
    let result = this.parseToken();
    if (!result)
      return undefined;
    let operation: Token;
    while ((operation = this.lexer.extractToken()) && operation.text !== ")") {
      result = this.processOperation(result, operation.text);
    }
    return result;
  }

  private processParenthenses(): Expression {
    return this.parse();
  }

  private parseToken(): Expression {
    const token = this.lexer.extractToken();
    if (!token)
      return undefined;
    if (token.text === "(") {
      return this.processParenthenses();
    }
    return new ValueExpression(token.text);
  }

  private processOperation(left: Expression, operation: string){
    switch (operation) {
      case "+": return new SumExpression(left, this.parseRightArg(priorities[operation]));
      case "-": return new SubExpression(left, this.parseRightArg(priorities[operation]));
      case "*": return new MulExpression(left, this.parseRightArg(priorities[operation]));
      case "/": return new DivExpression(left, this.parseRightArg(priorities[operation]));
      case "^": return new PowExpression(left, this.parseRightArg(priorities[operation] - 1));
    }
    throw new Error(`Unsupported operation: ${operation}`)
  }

  parseRightArg(priority: number): Expression {
    let result = this.parseToken();
    while (priority < priorities[this.nextOperation()]) {
      result = this.processOperation(result, this.lexer.extractToken().text);
    }
    return result;
  }

  private nextOperation(): string {
    const token = this.lexer.readToken();
    return token ? token.text : undefined;
  }
}