import { Expression, ValueExpression } from "./expression";
import { Lexer } from "./lexer";
import { InfixOperation, PostfixOperation } from "./operation";
import { Token } from "./token";

export interface Parser {
  parse(): Expression | undefined;
}

export class ExpressionParser implements Parser {
  constructor(readonly lexer: Lexer) {}

  parse(): Expression | undefined {
    return this.lexer.readToken() ? this.parseExpression(0) : undefined;
  }

  private priority(operation: InfixOperation | PostfixOperation | undefined): number {
    return operation?.priority ?? -1;
  }

  private parseExpression(priority: number): Expression {
    let result = this.parseToken();
    while (priority < this.priority(this.readOperation())) {
      result = this.processOperation(result, this.extractOperation());
    }
    return result;
  }

  private parseToken(): Expression {
    const token = this.lexer.extractToken();
    if (!token) {
      throw new Error("Unexpected end of expression");
    }
    if (token.type === "value") {
      return new ValueExpression(token.text);
    }
    const operation = this.lexer.grammar.getPrefixOperation(token.text);
    if (operation.name === "(") {
      const expression = this.parseExpression(0);
      this.lexer.extractToken(); // remove corresponiding ")"
      return expression;
    }
    return operation.process(this.parseExpression(operation.priority));
  }

  private processOperation(left: Expression, operation: PostfixOperation | InfixOperation): Expression {
    if (operation instanceof PostfixOperation) {
      return operation.process(left);
    }
    const priority = operation.associativity === "left" ? operation.priority : operation.priority - 1;
    return operation.process(left, this.parseExpression(priority));
  }

  private readOperation(): PostfixOperation | InfixOperation | undefined {
    return this.toOperation(this.lexer.readToken());
  }

  private extractOperation(): PostfixOperation | InfixOperation {
    const operation = this.toOperation(this.lexer.extractToken());
    if (!operation) {
      throw new Error("Unexpected end of expression");
    }
    return operation;
  }

  private toOperation(token: Token | undefined): PostfixOperation | InfixOperation | undefined {
    if (!token) {
      return undefined;
    }
    if (token.type !== "operation") {
      throw new Error("Invalid expression");
    }
    return this.lexer.grammar.getOperation(token.text);
  }
}
