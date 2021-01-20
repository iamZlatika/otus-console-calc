import { Token } from "./token";

export interface Lexer {
  extractToken(): Token;
  readToken(): Token;
}

const operations = new Set<string>(["+", "-", "*", "/", "(", ")", "^"]);

export class ExpressionLexer implements Lexer {
  private readonly words: string[];

  constructor(expression: string) {
    this.words = expression.split(" ");
  }

  extractToken(): Token {
    return this.toToken(this.words.shift());
  }

  readToken(): Token {
    return this.toToken(this.words[0]);
  }

  private toToken(word: string) {
    if (!word) {
      return undefined;
    }
    if (operations.has(word)) {
      return new Token("operation", word);
    }
    return new Token("value", word);
  }
}
