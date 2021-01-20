export interface Expression {
  evaluate(): number;
}

export class ValueExpression implements Expression {
  constructor(readonly value: string) {}
  evaluate(): number {
    const result = Number(this.value);
    if (isNaN(result))
      throw new Error(`Invalid number: ${this.value}`)
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