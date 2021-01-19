import { ExpressionLexer } from "./lexer";

describe("Expression Lexer", () => {
  it("Should process empty expression", () => {
    expect(new ExpressionLexer("").extractToken()).toBe(undefined);
  });

  it("Should process one arg expression", () => {
    expect(new ExpressionLexer("42").extractToken()).toMatchObject({
      type: "value",
      text: "42",
    });
  });

  it("Should process another arg expression", () => {
    expect(new ExpressionLexer("0").extractToken()).toMatchObject({
      type: "value",
      text: "0",
    });
  });

  it("Should process two arg expression", () => {
    const lexer = new ExpressionLexer("0 42");
    expect(lexer.extractToken()).toMatchObject({
      type: "value",
      text: "0",
    });
    expect(lexer.extractToken()).toMatchObject({
      type: "value",
      text: "42",
    });
  });

  it("Should process three arg expression", () => {
    const lexer = new ExpressionLexer("0 42 33");
    expect(lexer.extractToken()).toMatchObject({
      type: "value",
      text: "0",
    });
    expect(lexer.extractToken()).toMatchObject({
      type: "value",
      text: "42",
    });
    expect(lexer.extractToken()).toMatchObject({
      type: "value",
      text: "33",
    });
  });

  it("Should process operation +", () => {
    const lexer = new ExpressionLexer("+");
    expect(lexer.extractToken()).toMatchObject({
      type: "operation",
      text: "+",
    });
  });

  it("Should process operation -", () => {
    const lexer = new ExpressionLexer("-");
    expect(lexer.extractToken()).toMatchObject({
      type: "operation",
      text: "-",
    });
  });

  it("Should process operation *", () => {
    const lexer = new ExpressionLexer("*");
    expect(lexer.extractToken()).toMatchObject({
      type: "operation",
      text: "*",
    });
  });

  it("Should process operation /", () => {
    const lexer = new ExpressionLexer("/");
    expect(lexer.extractToken()).toMatchObject({
      type: "operation",
      text: "/",
    });
  });

  it("Should read token", () => {
    const lexer = new ExpressionLexer("*");
    expect(lexer.readToken()).toMatchObject({
      type: "operation",
      text: "*",
    });
  });

  it("Should not delete token on read", () => {
    const lexer = new ExpressionLexer("*");

    expect(lexer.readToken()).toMatchObject({
      type: "operation",
      text: "*",
    });

    expect(lexer.readToken()).toMatchObject({
      type: "operation",
      text: "*",
    });
  });
});
