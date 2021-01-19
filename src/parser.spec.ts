import { ExpressionParser } from "./parcer";
import { ExpressionLexer } from "./lexer";
const parse = (expression: string) =>
  new ExpressionParser(new ExpressionLexer(expression)).parse().evaluate();
describe("Expression Parser", () => {
  describe("Should parse value expressions", () => {
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
  describe("Should parse sum expressions", () => {
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
      expect(parse("3 + 4 + 5 + 1 + 86 + 18 + 33 + -77")).toBe(
        3 + 4 + 5 + 1 + 86 + 18 + 33 + -77
      );
    });
  });
  describe("Should parse subtraction expressions", () => {
    it("Should parse subtraction", () => {
      expect(parse("1 - 2")).toBe(-1);
    });
    it("Should parse multi args subtraction", () => {
      expect(parse("59 - 82 - 92 - 2 - 5 - -84")).toBe(
        59 - 82 - 92 - 2 - 5 - -84
      );
    });
  });
  describe("Should parse mixed expressions", () => {
    it("Should parse + and - expressions", () => {
      expect(parse("4 + 32 - 6 + 33 - 72")).toBe(4 + 32 - 6 + 33 - 72);
    });
  });
});
