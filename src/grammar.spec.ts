import { Expression, SumExpression } from "./expression";
import { calcGrammar, Grammar } from "./grammar";
import { InfixOperation, PostfixOperation, PrefixOperation } from "./operation";

describe("Grammar", () => {
  const prefix = new PrefixOperation("~", 100, (expression: Expression) => expression);
  const postfix = new PostfixOperation("~", 100, (expression: Expression) => expression);
  const infix = new InfixOperation("~", 100, (left: Expression, right: Expression) => new SumExpression(left, right));

  it.each([prefix, postfix, infix])("Should find operation", (operation) => {
    const grammar = new Grammar([operation]);
    expect(grammar.hasOperation(operation.name)).toBe(true);
  });

  it.each([postfix, infix])("Should return operation", (operation) => {
    const grammar = new Grammar([operation]);
    expect(grammar.getOperation(operation.name)).toBe(operation);
  });

  it.each([prefix])("Should return operation", (operation) => {
    const grammar = new Grammar([operation]);
    expect(grammar.getPrefixOperation(operation.name)).toBe(operation);
  });

  it("Should throw error when unknown operation is requseted", () => {
    const grammar = new Grammar([]);
    expect(() => grammar.getOperation("~")).toThrow();
    expect(() => grammar.getPrefixOperation("~")).toThrow();
  });
});

describe("Calc Grammar", () => {
  it.each(["+", "-", "*", "/", "(", ")", "^", "**", "!", "sin", "cos", "tan", "fib"])(
    "Should have operation '%s'",
    (operation) => {
      expect(calcGrammar.hasOperation(operation)).toBe(true);
    }
  );
});
