import { Expression, RPNExpression, ValueExpression } from "./expression";
import { Lexer } from "./lexer";
import { InfixOperation, Operation, PostfixOperation, PrefixOperation } from "./operation";
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

export class ToRPNExpressionParser implements Parser {
  constructor(readonly lexer: Lexer) {}

  parse(): Expression | undefined {
    return new RPNExpression(this.getTokens());
  }

  getTokens(): (ValueExpression | Operation)[] {
    let token: Token | undefined;
    const operations: Operation[] = [];
    const result: (ValueExpression | Operation)[] = [];
    while ((token = this.lexer.extractToken())) {
      if (!token) {
        throw new Error("Error");
      }

      if (token.type === "value") {
        result.push(new ValueExpression(token.text));
        continue;
      }

      const operation = this.extractOperation(token.text);

      if (operation.name === "(") {
        operations.push(operation);
      } else if (operation.name === ")") {
        while (operations.length > 0 && operations[operations.length - 1].name !== "(") {
          result.push(operations.pop()!);
        }
        if (operations.pop()?.name !== "(") {
          throw new Error("Unmatched parentheses");
        }
      } else if (operations instanceof PrefixOperation) {
        operations.push(operation);
      } else {
        while (
          operations.length > 0 &&
          operations[operations.length - 1].name !== "(" &&
          (operations[operations.length - 1].priority > operation.priority ||
            (operations[operations.length - 1].priority == operation.priority &&
              operation instanceof InfixOperation &&
              operation.associativity === "left"))
        ) {
          result.push(operations.pop()!);
        }
        operations.push(operation);
      }
    }
    while (operations.length > 0) {
      result.push(operations.pop()!);
    }
    return result;
  }

  private extractOperation(name: string): Operation {
    if (this.lexer.grammar.hasOperation(name)) {
      return this.lexer.grammar.getOperation(name);
    }
    if (this.lexer.grammar.hasPrefixOperation(name)) {
      return this.lexer.grammar.getPrefixOperation(name);
    }
    throw new Error("Unknown operation: " + name);
  }
}
