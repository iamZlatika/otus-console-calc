import {
  ValueExpression,
  SumExpression,
  SubtractionExpression,
} from "./expression";

describe("Value Expression", () => {
  it("Should return value", () => {
    expect(new ValueExpression("42").evaluate()).toBe(42);
  });
  it("Should return another value", () => {
    expect(new ValueExpression("56").evaluate()).toBe(56);
  });
});

describe("Sum Expression", () => {
  it("Should evaluate two values sum", () => {
    const expression = new SumExpression(
      new ValueExpression("33"),
      new ValueExpression("54")
    );
    expect(expression.evaluate()).toBe(33 + 54);
  });
  it("Should evaluate nested expressions", () => {
    const left = new SumExpression(
      new ValueExpression("33"),
      new ValueExpression("54")
    );
    const right = new SumExpression(
      new ValueExpression("58"),
      new ValueExpression("91")
    );
    const expression = new SumExpression(left, right);
    expect(expression.evaluate()).toBe(33 + 54 + 58 + 91);
  });
});
describe("Subtraction expression", () => {
  it("Should evaluate two values", () => {
    const expression = new SubtractionExpression(
      new ValueExpression("33"),
      new ValueExpression("54")
    );
    expect(expression.evaluate()).toBe(33 - 54);
  });
});
