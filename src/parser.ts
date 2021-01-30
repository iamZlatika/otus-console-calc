import {
  Expression,
  ValueExpression,
  SumExpression,
  SubExpression,
  MulExpression,
  DivExpression,
  PowExpression,
  SqrExpression,
  FactExpression,
  SinExpression,
  TanExpression,
  CosExpression,
  FibExpression,
  NegExpression,
  PosExpression,
} from "./expression";
import { Lexer } from "./lexer";
import { Token } from "./token";

export interface Parser {
  parse(): Expression | undefined;
}

const priorities = new Map<string, number>()
  .set("+", 2)
  .set("-", 2)
  .set("*", 3)
  .set("/", 3)
  .set("^", 4)
  .set("**", 4)
  .set("!", 4)
  .set("sin", 5)
  .set("cos", 5)
  .set("tan", 5)
  .set("fib", 5)
  .set("(", 100);

const getPriority = (operation: string | undefined): number => {
  if (!operation) {
    return -1;
  }
  const priority = priorities.get(operation);
  if (priority) {
    return priority;
  }
  return -1;
};

export class ExpressionParser implements Parser {
  constructor(readonly lexer: Lexer) {}

  parse(): Expression | undefined {
    let result = this.parseToken();
    if (!result) {
      return undefined;
    }
    let operation: Token | undefined;
    while ((operation = this.lexer.extractToken()) && operation.text !== ")") {
      result = this.processOperation(result, operation.text);
    }
    return result;
  }

  private parseExpression(priority: number): Expression {
    let result = this.parseToken();
    if (!result) {
      throw new Error("Unexpected end of expression");
    }
    while (priority < getPriority(this.nextOperation())) {
      const operationToken = this.lexer.extractToken();
      result = this.processOperation(result, operationToken!.text);
    }
    return result;
  }

  private parseToken(): Expression | undefined {
    const token = this.lexer.extractToken();
    if (!token) {
      return undefined;
    }
    if (token.type === "value") {
      return new ValueExpression(token.text);
    }
    const operation = token.text;
    switch (token.text) {
      case "(":
        return this.parse();
      case "sin":
        return new SinExpression(this.parseExpression(getPriority(operation)));
      case "cos":
        return new CosExpression(this.parseExpression(getPriority(operation)));
      case "tan":
        return new TanExpression(this.parseExpression(getPriority(operation)));
      case "fib":
        return new FibExpression(this.parseExpression(getPriority(operation)));
      case "-":
        return new NegExpression(this.parseExpression(getPriority(operation)));
      case "+":
        return new PosExpression(this.parseExpression(getPriority(operation)));
    }
    throw new Error(`Unsupported prefix operation: ${operation}`);
  }

  private processOperation(left: Expression, operation: string): Expression {
    switch (operation) {
      case "+":
        return new SumExpression(left, this.parseExpression(getPriority(operation)));
      case "-":
        return new SubExpression(left, this.parseExpression(getPriority(operation)));
      case "*":
        return new MulExpression(left, this.parseExpression(getPriority(operation)));
      case "/":
        return new DivExpression(left, this.parseExpression(getPriority(operation)));
      case "^":
        return new PowExpression(left, this.parseExpression(getPriority(operation) - 1));
      case "**":
        return new SqrExpression(left);
      case "!":
        return new FactExpression(left);
    }
    throw new Error(`Unsupported operation: ${operation}`);
  }

  private nextOperation(): string | undefined {
    const token = this.lexer.readToken();
    if (!token) {
      return undefined;
    }
    if (token.type !== "operation") {
      throw new Error("Invalid expression");
    }
    return token.text;
  }
}
