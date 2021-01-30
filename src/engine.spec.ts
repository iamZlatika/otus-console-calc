import { evaluate } from "./engine";

describe("evaluate", () => {
  const validExpressions: [string, number][] = [
    ["4+32-6+33-72", 4 + 32 - 6 + 33 - 72],
    ["10*5+1", 10 * 5 + 1],
    ["1+10*5", 1 + 10 * 5],
    ["1+10*5+1", 1 + 10 * 5 + 1],
    ["97*6-6+7*4", 97 * 6 - 6 + 7 * 4],
    ["1+2*2*2+1", 1 + 2 * 2 * 2 + 1],
    ["(2+3+ 4 * (1+7-18)/((1+2)*3+1)", 2 + 3 + (4 * (1 + 7 - 18)) / ((1 + 2) * 3 + 1)],
    ["1 + 2^(20/5/1)*3 - 2*5 + 3", 42],
    ["1+2^(1*3)    **/(2   ^3)   -100500^0", 64],
    ["             (2^(3!-1))*(1+2)            ", 96],
    ["fib(2^(fib 3))*4+1", 13],
    ["cos(fib(11)+fib(11)^0)", 0],
  ];
  it.each(validExpressions)("Should evaluate expression %s to be %i", (expression, expectedResult) => {
    const [error, result] = evaluate(expression);
    expect(error).toBeNull();
    expect(result).toBeCloseTo(expectedResult);
  });

  it("Should return error for invalid expression", () => {
    const [error, result] = evaluate("1 2 3");
    expect(error).not.toBeNull();
    expect(result).toBeUndefined();
  });

  it("Should evaluate undefined expression", () => {
    const [error, result] = evaluate("");
    expect(error).toBeNull();
    expect(result).toBeUndefined();
  });
});
