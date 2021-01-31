import { InfixOperation, Operation } from "./operation";

export abstract class Expression {
  abstract evaluate(): number;
}

export class ValueExpression extends Expression {
  constructor(readonly value: string | number) {
    super();
  }
  evaluate(): number {
    if (typeof this.value === "number") {
      return this.value;
    }
    const result = Number(this.value);
    if (isNaN(result)) {
      throw new Error(`Invalid number: ${this.value}`);
    }
    return result;
  }
}

export class SumExpression implements Expression {
  constructor(readonly left: Expression, readonly right: Expression) {}
  evaluate(): number {
    return this.left.evaluate() + this.right.evaluate();
  }
}

export class SubExpression implements Expression {
  constructor(readonly left: Expression, readonly right: Expression) {}
  evaluate(): number {
    return this.left.evaluate() - this.right.evaluate();
  }
}

export class MulExpression implements Expression {
  constructor(readonly left: Expression, readonly right: Expression) {}
  evaluate(): number {
    return this.left.evaluate() * this.right.evaluate();
  }
}

export class DivExpression implements Expression {
  constructor(readonly left: Expression, readonly right: Expression) {}
  evaluate(): number {
    return this.left.evaluate() / this.right.evaluate();
  }
}

export class PowExpression implements Expression {
  constructor(readonly left: Expression, readonly right: Expression) {}
  evaluate(): number {
    return Math.pow(this.left.evaluate(), this.right.evaluate());
  }
}

export class SqrExpression implements Expression {
  constructor(readonly left: Expression) {}
  evaluate(): number {
    return Math.pow(this.left.evaluate(), 2);
  }
}

export class FactExpression implements Expression {
  constructor(readonly left: Expression) {}
  evaluate(): number {
    const value = this.left.evaluate();
    if (value < 0) {
      throw new Error(`Unable to evaluate factorial of ${value}`);
    }
    return this.factorial(value);
  }

  private factorial(value: number): number {
    return value <= 1 ? 1 : value * this.factorial(value - 1);
  }
}

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

export class SinExpression implements Expression {
  constructor(readonly right: Expression) {}
  evaluate(): number {
    const value = toRadians(this.right.evaluate());
    return Math.sin(value);
  }
}

export class CosExpression implements Expression {
  constructor(readonly right: Expression) {}
  evaluate(): number {
    const value = toRadians(this.right.evaluate());
    return Math.cos(value);
  }
}

export class TanExpression implements Expression {
  constructor(readonly right: Expression) {}
  evaluate(): number {
    const value = toRadians(this.right.evaluate());
    return Math.tan(value);
  }
}

export class FibExpression implements Expression {
  constructor(readonly right: Expression) {}

  evaluate(): number {
    const value = this.right.evaluate();
    if (value < 0) {
      throw new Error(`Unable to evaluate fibonacci: negative number (${value})`);
    }
    if (value >= 30) {
      throw new Error(`Unable to evaluate fibonacci: value too large (${value})`);
    }
    return this.fibonacci(value);
  }

  private fibonacci(value: number): number {
    if (value === 0) return 0;
    return value <= 2 ? 1 : this.fibonacci(value - 1) + this.fibonacci(value - 2);
  }
}

export class NegExpression implements Expression {
  constructor(readonly rigth: Expression) {}
  evaluate(): number {
    return -this.rigth.evaluate();
  }
}

export class PosExpression implements Expression {
  constructor(readonly rigth: Expression) {}
  evaluate(): number {
    return this.rigth.evaluate();
  }
}

export class RPNExpression implements Expression {
  constructor(readonly tokens: (ValueExpression | Operation)[]) {}
  evaluate(): number {
    const acc: ValueExpression[] = [];
    const tokens = [...this.tokens];
    const popValue = () => {
      const value = acc.pop();
      if (!value) {
        throw new Error("Invalid expression");
      }
      return value;
    };
    let token: ValueExpression | Operation | undefined;
    while ((token = tokens.shift())) {
      if (token instanceof ValueExpression) {
        acc.push(token);
      } else if (token instanceof InfixOperation) {
        const right = popValue();
        const left = popValue();
        acc.push(new ValueExpression(token.process(left, right).evaluate()));
      } else {
        acc.push(new ValueExpression(token.process(popValue()).evaluate()));
      }
    }
    return popValue().evaluate();
  }
}
