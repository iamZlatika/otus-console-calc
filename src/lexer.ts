import { Token } from "./token";

export interface Lexer {
  extractToken(): Token | undefined;
  readToken(): Token | undefined;
}

export const operations = new Set<string>(["+", "-", "*", "/", "(", ")", "^", "**", "!", "sin", "cos", "tan", "fib"]);

export class ExpressionLexer implements Lexer {
  private readonly words: string[];

  constructor(expression: string) {
    this.words = expression.split(" ");
  }

  extractToken(): Token | undefined {
    return this.toToken(this.words.shift());
  }

  readToken(): Token | undefined {
    return this.toToken(this.words[0]);
  }

  private toToken(word: string | undefined): Token | undefined {
    if (!word) {
      return undefined;
    }
    if (operations.has(word)) {
      return new Token("operation", word);
    }
    return new Token("value", word);
  }
}
