import { ExpressionParser } from "./parser";
import { ExpressionLexer } from "./lexer";
const parse = (expression: string) => new ExpressionParser(new ExpressionLexer(expression)).parse().evaluate();
describe("Expression Parser", () => {
  describe("Value expressions", () => {
    it("Should parse empty expression", () => {
      const parser = new ExpressionParser(new ExpressionLexer(""));
      expect(parser.parse()).toBe(undefined);
    });

    it("Should parse value expression", () => {
      expect(parse("42")).toBe(42);
    });

    it("Should parse another value expression", () => {
      expect(parse("34")).toBe(34);
    });
  });

  describe("Sum", () => {
    it("Should parse sum", () => {
      expect(parse("1 + 2")).toBe(3);
    });

    it("Should parse another sum", () => {
      expect(parse("-3 + 4")).toBe(1);
    });

    it("Should parse three args sum", () => {
      expect(parse("3 + 4 + 5")).toBe(12);
    });

    it("Should parse multi args sum", () => {
      expect(parse("3 + 4 + 5 + 1 + 86 + 18 + 33 + -77")).toBe(3 + 4 + 5 + 1 + 86 + 18 + 33 + -77);
    });
  });

  describe("Subtraction", () => {
    it("Should parse subtraction", () => {
      expect(parse("1 - 2")).toBe(-1);
    });

    it("Should parse multi args subtraction", () => {
      expect(parse("59 - 82 - 92 - 2 - 5 - -84")).toBe(59 - 82 - 92 - 2 - 5 - -84);
    });
  });

  describe("Multiplication", () => {
    it("Should parse two args multiplication", () => {
      expect(parse("6 * 4")).toBe(6 * 4);
    });

    it("Should parse multiple args multiplication", () => {
      expect(parse("6 * 4 * 6 * 7 * 62")).toBe(6 * 4 * 6 * 7 * 62);
    });
  });

  describe("Division", () => {
    it("Should parse two args division", () => {
      expect(parse("6 / 3")).toBe(6 / 3);
    });

    it("Should parse multiple args division", () => {
      expect(parse("100 / 2 / 2 / 5")).toBe(100 / 2 / 2 / 5);
    });
  });

  describe("Parentheses", () => {
    it("Should parse value within parentheses", () => {
      expect(parse("( 1 )")).toBe(1);
    });

    it("Should parse expression within parentheses", () => {
      expect(parse("( 1 + 2 )")).toBe(3);
    });

    it("Should parse expression with constant within parenseses", () => {
      expect(parse("1 + ( 2 )")).toBe(3);
    });

    it("Should parse expression with expression within parenseses", () => {
      expect(parse("1 + ( 2 + 3 )")).toBe(6);
    });

    it("Should parse expression with parentheses changing evaluation priority", () => {
      expect(parse("2 * ( 3 + 4 )")).toBe(14);
    });

    it("Should parse another expression with parentheses changing evaluation priority", () => {
      expect(parse("( 2 + 1 ) * 3")).toBe(9);
    });

    it("Should parse multiple expressions with parentheses", () => {
      expect(parse("( 2 + 1 ) * ( 3 + 4 )")).toBe(( 2 + 1 ) * ( 3 + 4 ));
    });

    it("Should parse nested expressions with parentheses", () => {
      expect(parse("( 2 + 1 ) * ( 3 * ( 2 + 2 ) )")).toBe(( 2 + 1 ) * ( 3 * ( 2 + 2 ) ));
    });

    it("Should parse multi level parentheses nesting", () => {
      expect(parse("2 * ( 2 * ( 2 * ( 2 * ( 1 + 2 ) ) ) ) ) )")).toBe(2 * ( 2 * ( 2 * ( 2 * ( 1 + 2 ) ) ) ));
    });
  });

  describe("Mixed expressions", () => {
    it("Should parse + and - expressions", () => {
      expect(parse("4 + 32 - 6 + 33 - 72")).toBe(4 + 32 - 6 + 33 - 72);
    });

    it("Should parse +, - and * expressions", () => {
      expect(parse("10 * 5 + 1")).toBe(10 * 5 + 1);
      expect(parse("1 + 10 * 5")).toBe(1 + 10 * 5);
      expect(parse("1 + 10 * 5 + 1")).toBe(1 + 10 * 5 + 1);
      expect(parse("97 * 6 - 6 + 7 * 4")).toBe(97 * 6 - 6 + 7 * 4);
    });

    it("Should parse +, -, / and * expressions", () => {
      expect(parse("1 + 2 * 2 * 2 + 1")).toBe(1 + 2 * 2 * 2 + 1);
      expect(parse("1 + 10 / 5 / 2 - 4 * 3 * 6 * 2 + 20 - 1 - 7 + 11 * 18 * 14 + 8")).toBe(1 + 10 / 5 / 2 - 4 * 3 * 6 * 2 + 20 - 1 - 7 + 11 * 18 * 14 + 8);
    });

    it("Should parse +, -, / and *, and brackets expressions", () => {
      expect(parse("( 2 + 3 + 4 * ( 1 + 7 - 18 ) / ( ( 1 + 2 ) * 3 + 1 )")).toBe(( 2 + 3 + 4 * ( 1 + 7 - 18 ) / ( ( 1 + 2 ) * 3 + 1 )));
    });
  });
});
