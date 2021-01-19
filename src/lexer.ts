import { Token } from "./token";

export interface Lexer {
  extractToken(): Token;
}

export class ExpressionLexer implements Lexer {
  private readonly words: string[];

  constructor(expression: string) {
    this.words = expression.split(" ");
  }

  extractToken(): Token {
    const word = this.words.shift();
    if (!word) {
      return undefined;
    }
    if (word === "+") {
      return new Token("operation", word);
    }
    return new Token("value", word);
  }
}
