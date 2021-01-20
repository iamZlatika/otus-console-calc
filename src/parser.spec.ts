import { ExpressionParser } from "./parser";
import { ExpressionLexer } from "./lexer";
const evaluate = (expression: string) => new ExpressionParser(new ExpressionLexer(expression)).parse().evaluate();
describe("Expression Parser", () => {
  describe("Value expressions", () => {
    it("Should parse empty expression", () => {
      const parser = new ExpressionParser(new ExpressionLexer(""));
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
    it("Should parse value within parentheses", () => {
      expect(evaluate("( 1 )")).toBe(1);
    });

    it("Should parse expression within parentheses", () => {
      expect(evaluate("( 1 + 2 )")).toBe(3);
    });

    it("Should parse expression with constant within parenseses", () => {
      expect(evaluate("1 + ( 2 )")).toBe(3);
    });

    it("Should parse expression with expression within parenseses", () => {
      expect(evaluate("1 + ( 2 + 3 )")).toBe(6);
    });

    it("Should parse expression with parentheses changing evaluation priority", () => {
      expect(evaluate("2 * ( 3 + 4 )")).toBe(14);
    });

    it("Should parse another expression with parentheses changing evaluation priority", () => {
      expect(evaluate("( 2 + 1 ) * 3")).toBe(9);
    });

    it("Should parse multiple expressions with parentheses", () => {
      expect(evaluate("( 2 + 1 ) * ( 3 + 4 )")).toBe(( 2 + 1 ) * ( 3 + 4 ));
    });

    it("Should parse nested expressions with parentheses", () => {
      expect(evaluate("( 2 + 1 ) * ( 3 * ( 2 + 2 ) )")).toBe(( 2 + 1 ) * ( 3 * ( 2 + 2 ) ));
    });

    it("Should parse multi level parentheses nesting", () => {
      expect(evaluate("2 * ( 2 * ( 2 * ( 2 * ( 1 + 2 ) ) ) ) ) )")).toBe(2 * ( 2 * ( 2 * ( 2 * ( 1 + 2 ) ) ) ));
    });
  });

  describe("Power", () => {
    it("Should parse power expression", () => {
      expect(evaluate("2 ^ 10")).toBe(1024)
    })

    it ("Should parse multiple arg power expression", () => {
      expect(evaluate("4 ^ 3 ^ 2")).toBe(Math.pow(4, Math.pow(3, 2)))
    })

    it ("Should parse power according to its priority", () => {
      expect(evaluate("1 + 2 ^ 3")).toBe(9)
      expect(evaluate("2 ^ 3 * 10 )")).toBe(80)
    })
  })

  describe("Mixed expressions", () => {
    it("Should parse + and - expressions", () => {
      expect(evaluate("4 + 32 - 6 + 33 - 72")).toBe(4 + 32 - 6 + 33 - 72);
    });

    it("Should parse +, - and * expressions", () => {
      expect(evaluate("10 * 5 + 1")).toBe(10 * 5 + 1);
      expect(evaluate("1 + 10 * 5")).toBe(1 + 10 * 5);
      expect(evaluate("1 + 10 * 5 + 1")).toBe(1 + 10 * 5 + 1);
      expect(evaluate("97 * 6 - 6 + 7 * 4")).toBe(97 * 6 - 6 + 7 * 4);
    });

    it("Should parse +, -, / and * expressions", () => {
      expect(evaluate("1 + 2 * 2 * 2 + 1")).toBe(1 + 2 * 2 * 2 + 1);
      expect(evaluate("1 + 10 / 5 / 2 - 4 * 3 * 6 * 2 + 20 - 1 - 7 + 11 * 18 * 14 + 8")).toBe(1 + 10 / 5 / 2 - 4 * 3 * 6 * 2 + 20 - 1 - 7 + 11 * 18 * 14 + 8);
    });

    it("Should parse +, -, / and *, and parentheses expressions", () => {
      expect(evaluate("( 2 + 3 + 4 * ( 1 + 7 - 18 ) / ( ( 1 + 2 ) * 3 + 1 )")).toBe(( 2 + 3 + 4 * ( 1 + 7 - 18 ) / ( ( 1 + 2 ) * 3 + 1 )));
    });

    it("Should parse +, -, /, *, ^ and parentheses expressions", () => {
      expect(evaluate("1 + 2 ^ ( 20 / 5 / 1 ) * 3 - 2 * 5 + 3")).toBe(42);
    });
  });
});
