export interface Expression {
  evaluate(): number;
}

export class ValueExpression implements Expression {
  constructor(readonly value: string) {}
  evaluate(): number {
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
