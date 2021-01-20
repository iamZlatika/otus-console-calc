import { ValueExpression, SumExpression, SubExpression, MulExpression, DivExpression, PowExpression } from "./expression";

describe("Value Expression", () => {
  it("Should return value", () => {
    expect(new ValueExpression("42").evaluate()).toBe(42);
  });
  it("Should return another value", () => {
    expect(new ValueExpression("56").evaluate()).toBe(56);
  });

  it("Should throw Error if argument is not a number", () => {
    expect(() => new ValueExpression("value").evaluate()).toThrowError();
  });
});

describe("Sum Expression", () => {
  it("Should evaluate two values sum", () => {
    const expression = new SumExpression(new ValueExpression("33"), new ValueExpression("54"));
    expect(expression.evaluate()).toBe(33 + 54);
  });
  it("Should evaluate nested expressions", () => {
    const left = new SumExpression(new ValueExpression("33"), new ValueExpression("54"));
    const right = new SumExpression(new ValueExpression("58"), new ValueExpression("91"));
    const expression = new SumExpression(left, right);
    expect(expression.evaluate()).toBe(33 + 54 + 58 + 91);
  });
});

describe("Subtraction expression", () => {
  it("Should evaluate two values", () => {
    const expression = new SubExpression(new ValueExpression("33"), new ValueExpression("54"));
    expect(expression.evaluate()).toBe(33 - 54);
  });
});

describe("Multiplication expression", () => {
  it("Should evaluate two values", () => {
    const expression = new MulExpression(new ValueExpression("23"), new ValueExpression("11"));
    expect(expression.evaluate()).toBe(23 * 11);
  });
});

describe("Division expression", () => {
  it("Should evaluate two values", () => {
    const expression = new DivExpression(new ValueExpression("10"), new ValueExpression("5"));
    expect(expression.evaluate()).toBe(10 / 5);
  });
});

describe("Power expression", () => {
  it("Should evaluate two values", () => {
    const expression = new PowExpression(new ValueExpression("2"), new ValueExpression("10"))
    expect(expression.evaluate()).toBe(1024);
  })
})