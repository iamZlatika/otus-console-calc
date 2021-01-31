import { ExpressionParser } from "./parser";
import { ExpressionLexer } from "./lexer";
import { calcGrammar } from "./grammar";

const evaluate = (expression: string) =>
  new ExpressionParser(new ExpressionLexer(calcGrammar, expression)).parse().evaluate();

describe("Expression Parser", () => {
  describe("Value expressions", () => {
    it("Should parse empty expression", () => {
      const parser = new ExpressionParser(new ExpressionLexer(calcGrammar, ""));
      expect(parser.parse()).toBe(undefined);
    });

    it("Should parse value expression", () => {
      expect(evaluate("42")).toBe(42);
    });

    it("Should parse another value expression", () => {
      expect(evaluate("34")).toBe(34);
    });
  });

  describe("Sum", () => {
    it("Should parse sum", () => {
      expect(evaluate("1 + 2")).toBe(3);
    });

    it("Should parse another sum", () => {
      expect(evaluate("-3 + 4")).toBe(1);
    });

    it("Should parse three args sum", () => {
      expect(evaluate("3 + 4 + 5")).toBe(12);
    });

    it("Should parse multi args sum", () => {
      expect(evaluate("3 + 4 + 5 + 1 + 86 + 18 + 33 + -77")).toBe(3 + 4 + 5 + 1 + 86 + 18 + 33 + -77);
    });
  });

  describe("Subtraction", () => {
    it("Should parse subtraction", () => {
      expect(evaluate("1 - 2")).toBe(-1);
    });

    it("Should parse multi args subtraction", () => {
      expect(evaluate("59 - 82 - 92 - 2 - 5 - -84")).toBe(59 - 82 - 92 - 2 - 5 - -84);
    });
  });

  describe("Multiplication", () => {
    it("Should parse two args multiplication", () => {
      expect(evaluate("6 * 4")).toBe(6 * 4);
    });

    it("Should parse multiple args multiplication", () => {
      expect(evaluate("6 * 4 * 6 * 7 * 62")).toBe(6 * 4 * 6 * 7 * 62);
    });
  });

  describe("Division", () => {
    it("Should parse two args division", () => {
      expect(evaluate("6 / 3")).toBe(6 / 3);
    });

    it("Should parse multiple args division", () => {
      expect(evaluate("100 / 2 / 2 / 5")).toBe(100 / 2 / 2 / 5);
    });
  });

  describe("Parentheses", () => {
    const testCases: [string, number][] = [
      ["( 1 )", 1],
      ["( 1 + 2 )", 3],
      ["1 + ( 2 )", 3],
      ["1 + ( 2 + 3 )", 6],
      ["2 * ( 3 + 4 )", 14],
      ["( 2 + 1 ) * 3", 9],
      ["( 2 + 1 ) * ( 3 + 4 )", (2 + 1) * (3 + 4)],
      ["( 2 + 1 ) * ( 3 * ( 2 + 2 ) )", (2 + 1) * (3 * (2 + 2))],
      ["2 * ( 2 * ( 2 * ( 2 * ( 1 + 2 ) ) ) ) ) )", 2 * (2 * (2 * (2 * (1 + 2))))],
    ];
    it.each(testCases)("Should parse expression %s = %i", (expression, result) => {
      expect(evaluate(expression)).toBe(result);
    });
  });

  describe("Power", () => {
    it("Should parse power expression", () => {
      expect(evaluate("2 ^ 10")).toBe(1024);
    });

    it("Should parse multiple arg power expression", () => {
      expect(evaluate("4 ^ 3 ^ 2")).toBe(Math.pow(4, Math.pow(3, 2)));
    });

    it("Should parse power according to its priority", () => {
      expect(evaluate("1 + 2 ^ 3")).toBe(9);
      expect(evaluate("2 ^ 3 * 10 )")).toBe(80);
    });
  });

  describe("Square", () => {
    it("Should parse square expression", () => {
      expect(evaluate("2 **")).toBe(4);
    });

    it("Should multiple square expression", () => {
      expect(evaluate("3 ** **")).toBe(81);
    });
  });

  describe("Factorial", () => {
    it("Should parse factorial expression", () => {
      expect(evaluate("5 !")).toBe(120);
    });

    it("Should parse multiple factorials", () => {
      expect(evaluate("2 ! ! ! !")).toBe(2);
      expect(evaluate("3 ! !")).toBe(120 * 6);
    });

    it("Should parse factorial according to its priority", () => {
      expect(evaluate("1 + 3 !")).toBe(7);
      expect(evaluate("3 ! * 2")).toBe(12);
      expect(evaluate("3 ! * 2 !")).toBe(12);
      expect(evaluate("3 ! ^ 2")).toBe(36);
    });
  });

  describe("Sine", () => {
    it("Should parse sin expression", () => {
      expect(evaluate("sin 0")).toBeCloseTo(0);
    });
    it("Should parse sin according to its priority", () => {
      expect(evaluate("sin 0 + 1")).toBeCloseTo(1);
      expect(evaluate("sin 90 * 2")).toBeCloseTo(2);
      expect(evaluate("sin 90 !")).toBeCloseTo(1);
      expect(evaluate("5 * sin ( 45 + 45 )")).toBeCloseTo(5);
    });
  });

  describe("Cosine", () => {
    it("Should parse cos expression", () => {
      expect(evaluate("cos 0")).toBeCloseTo(1);
    });
    it("Should parse sin according to its priority", () => {
      expect(evaluate("cos 0 + 1")).toBeCloseTo(2);
      expect(evaluate("cos 90 * 2")).toBeCloseTo(0);
      expect(evaluate("cos 90 !")).toBeCloseTo(1);
      expect(evaluate("5 + cos ( 30 * 2 )")).toBeCloseTo(5.5);
    });
  });

  describe("Tangent", () => {
    it("Should parse tan expression", () => {
      expect(evaluate("tan 0")).toBeCloseTo(0);
    });
    it("Should parse sin according to its priority", () => {
      expect(evaluate("tan 0 + 1")).toBeCloseTo(1);
      expect(evaluate("tan 45 * 2")).toBeCloseTo(2);
      expect(evaluate("tan 45 !")).toBeCloseTo(1);
      expect(evaluate("5 * tan ( 45 * ( 3 - 2 ) )")).toBeCloseTo(5);
    });
  });

  describe("Fibonacci", () => {
    it("Should parse tan expression", () => {
      expect(evaluate("fib 0")).toBe(0);
    });
    it("Should parse sin according to its priority", () => {
      expect(evaluate("fib 0 + 1")).toBe(1);
      expect(evaluate("fib 1 * 5")).toBeCloseTo(5);
      expect(evaluate("fib 5 !")).toBeCloseTo(120);
    });
  });

  describe("Negation", () => {
    it("Should parse neg expression", () => {
      expect(evaluate("- 1")).toBe(-1);
    });
    it("Should parse negation according to its priority", () => {
      expect(evaluate("- 1 - - 2")).toBe(1);
    });
  });

  describe("Positivity", () => {
    it("Should parse pos expression", () => {
      expect(evaluate("+ 1")).toBe(1);
    });
    it("Should parse pos expression according to its priority", () => {
      expect(evaluate("+ - + 1")).toBe(-1);
    });
  });

  describe("Mixed expressions", () => {
    const testCases: [string, number][] = [
      ["4 + 32 - 6 + 33 - 72", 4 + 32 - 6 + 33 - 72],
      ["10 * 5 + 1", 10 * 5 + 1],
      ["1 + 10 * 5", 1 + 10 * 5],
      ["1 + 10 * 5 + 1", 1 + 10 * 5 + 1],
      ["97 * 6 - 6 + 7 * 4", 97 * 6 - 6 + 7 * 4],
      ["1 + 2 * 2 * 2 + 1", 1 + 2 * 2 * 2 + 1],
      ["( 2 + 3 + 4 * ( 1 + 7 - 18 ) / ( ( 1 + 2 ) * 3 + 1 )", 2 + 3 + (4 * (1 + 7 - 18)) / ((1 + 2) * 3 + 1)],
      ["1 + 2 ^ ( 20 / 5 / 1 ) * 3 - 2 * 5 + 3", 42],
      ["1 + 2 ^ ( 1 * 3 ) ** / ( 2 ^ 3 ) - 100500 ^ 0", 64],
      ["( 2 ^ ( 3 ! - 1 ) ) * ( 1 + 2 )", 96],
      ["fib ( 2 ^ ( fib 3 ) ) * 4 + 1", 13],
    ];

    it.each(testCases)("Should parse %s", (expression, result) => {
      expect(evaluate(expression)).toBe(result);
    });
  });

  describe("Invalid expressions", () => {
    const testCases = ["1 + ", "1 + +", "1 😀 2", "1 + 2 3", "( )"];
    it.each(testCases)("Should throw error for invalid expression: %s", (expression) => {
      expect(() => evaluate(expression)).toThrow();
    });
  });
});
