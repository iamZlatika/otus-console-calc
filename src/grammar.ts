import {
  CosExpression,
  DivExpression,
  Expression,
  FactExpression,
  FibExpression,
  MulExpression,
  NegExpression,
  PosExpression,
  PowExpression,
  SinExpression,
  SqrExpression,
  SubExpression,
  SumExpression,
  TanExpression,
} from "./expression";

import { InfixOperation, PostfixOperation, PrefixOperation, Operation } from "./operation";

export class Grammar {
  private readonly operations = new Map<string, PostfixOperation | InfixOperation>();
  private readonly prefixOperations = new Map<string, PrefixOperation>();

  constructor(operations: Operation[]) {
    operations.forEach((operation) =>
      (operation instanceof PrefixOperation ? this.prefixOperations : this.operations).set(operation.name, operation)
    );
  }

  hasOperation(name: string): boolean {
    return this.operations.has(name);
  }

  getOperation(name: string): PostfixOperation | InfixOperation {
    const operation = this.operations.get(name);
    if (!operation) {
      throw new Error("Unknown operation: " + name);
    }
    return operation;
  }

  hasPrefixOperation(name: string): boolean {
    return this.prefixOperations.has(name);
  }

  getPrefixOperation(name: string): PrefixOperation {
    const result = this.prefixOperations.get(name);
    if (!result) {
      throw new Error("Unknown prefix operation: " + name);
    }
    return result;
  }
}

export const calcGrammar = new Grammar([
  new InfixOperation("+", 2, (left: Expression, right: Expression) => new SumExpression(left, right)),
  new InfixOperation("-", 2, (left: Expression, right: Expression) => new SubExpression(left, right)),
  new InfixOperation("*", 3, (left: Expression, right: Expression) => new MulExpression(left, right)),
  new InfixOperation("/", 3, (left: Expression, right: Expression) => new DivExpression(left, right)),
  new InfixOperation("^", 4, (left: Expression, right: Expression) => new PowExpression(left, right), "right"),

  new PostfixOperation("**", 4, (left: Expression) => new SqrExpression(left)),
  new PostfixOperation("!", 4, (left: Expression) => new FactExpression(left)),

  new PrefixOperation("+", 2, (right: Expression) => new PosExpression(right)),
  new PrefixOperation("-", 2, (right: Expression) => new NegExpression(right)),
  new PrefixOperation("sin", 5, (right: Expression) => new SinExpression(right)),
  new PrefixOperation("cos", 5, (right: Expression) => new CosExpression(right)),
  new PrefixOperation("tan", 5, (right: Expression) => new TanExpression(right)),
  new PrefixOperation("fib", 5, (right: Expression) => new FibExpression(right)),

  new PrefixOperation("(", 100, (right: Expression) => right),
  new PostfixOperation(")", -1, (left: Expression) => left),
]);
