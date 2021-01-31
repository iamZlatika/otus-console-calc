import {
  ValueExpression,
  SumExpression,
  SubExpression,
  MulExpression,
  DivExpression,
  PowExpression,
  SqrExpression,
  FactExpression,
  SinExpression,
  CosExpression,
  TanExpression,
  FibExpression,
  NegExpression,
  PosExpression,
  RPNExpression,
} from "./expression";
import { calcGrammar } from "./grammar";
import { Operation } from "./operation";

describe("Value Expression", () => {
  it("Should return value", () => {
    expect(new ValueExpression("42").evaluate()).toBe(42);
  });
  it("Should return another value", () => {
    expect(new ValueExpression("56").evaluate()).toBe(56);
  });
  it("Should return value for number argument", () => {
    expect(new ValueExpression(42).evaluate()).toBe(42);
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
    const expression = new PowExpression(new ValueExpression("2"), new ValueExpression("10"));
    expect(expression.evaluate()).toBe(1024);
  });
});

describe("Square expression", () => {
  it("Should evaluate square", () => {
    const expression = new SqrExpression(new ValueExpression("11"));
    expect(expression.evaluate()).toBe(121);
  });
});

describe("Factorial expression", () => {
  it("Should evaluate factorial", () => {
    const expression = new FactExpression(new ValueExpression("5"));
    expect(expression.evaluate()).toBe(120);
  });
  it("Should throw exception for negative numbers", () => {
    const expression = new FactExpression(new ValueExpression("-10"));
    expect(() => expression.evaluate()).toThrow();
  });
});

describe("Sine expression", () => {
  const testCases: [string, number][] = [
    ["0", 0],
    ["30", 0.5],
    ["45", Math.sqrt(2) / 2],
    ["90", 1],
  ];
  it.each(testCases)("Should evaluate sin %s to be close to %d", (value, expected) => {
    const expression = new SinExpression(new ValueExpression(value));
    expect(expression.evaluate()).toBeCloseTo(expected);
  });
});

describe("Cosine expression", () => {
  const testCases: [string, number][] = [
    ["0", 1],
    ["45", Math.sqrt(2) / 2],
    ["60", 0.5],
    ["90", 0],
  ];
  it.each(testCases)("Should evaluate cos %s to be close to %d", (value: string, expected: number) => {
    const expression = new CosExpression(new ValueExpression(value));
    expect(expression.evaluate()).toBeCloseTo(expected);
  });
});

describe("Tangent expression", () => {
  const testCases: [string, number][] = [
    ["0", 0],
    ["45", 1],
    ["60", Math.sqrt(3)],
  ];
  it.each(testCases)("Should evaluate tan %s to be close to %d", (value, expected) => {
    const expression = new TanExpression(new ValueExpression(value));
    expect(expression.evaluate()).toBeCloseTo(expected);
  });
});

describe("Fibonacci expression", () => {
  const invalidArguments = ["-1", "30", "100500"];
  it.each(invalidArguments)("Should throw an error given invalid argument: %i", (arg) => {
    const expression = new FibExpression(new ValueExpression(arg));
    expect(() => expression.evaluate()).toThrow();
  });

  const testCases: [string, number][] = [
    ["1", 1],
    ["2", 1],
    ["3", 2],
    ["4", 3],
    ["10", 55],
  ];
  it.each(testCases)("Should evaluate fib %i to be equal to %i", (value, expected) => {
    const expression = new FibExpression(new ValueExpression(value));
    expect(expression.evaluate()).toBe(expected);
  });
});

describe("Negate expression", () => {
  it("Should evaluate negation", () => {
    const expression = new NegExpression(new ValueExpression("42"));
    expect(expression.evaluate()).toBe(-42);
  });
});

describe("Positive expression", () => {
  it("Should evaluate positive expression", () => {
    const expression = new PosExpression(new NegExpression(new ValueExpression("42")));
    expect(expression.evaluate()).toBe(-42);
  });
});

describe("Reverse Polish Notation Expression", () => {
  const val = (value: number) => new ValueExpression(value);
  const op = (operation: string) => calcGrammar.getOperation(operation);
  const prefix = (operation: string) => calcGrammar.getPrefixOperation(operation);

  const expressions: [(ValueExpression | Operation)[], number][] = [
    [[val(42)], 42],
    [[val(2), val(1), op("+")], 3],
    [[val(3), val(4), val(2), val(1), op("-"), op("*"), op("+")], 3 + 4 * (2 - 1)],
    [[val(10), prefix("fib")], 55],
  ];

  it.each(expressions)("Should evaluate RPN expression", (tokens, result) => {
    expect(new RPNExpression(tokens).evaluate()).toBe(result);
  });

  it("Should throw error given invalid operation", () => {
    expect(() => new RPNExpression([op("+")]).evaluate()).toThrow();
  });
});
