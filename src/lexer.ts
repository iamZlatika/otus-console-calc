import { Grammar } from "./grammar";
import { Token } from "./token";

export interface Lexer {
  readonly grammar: Grammar;
  extractToken(): Token | undefined;
  readToken(): Token | undefined;
}

export class ExpressionLexer implements Lexer {
  private readonly words: string[];

  constructor(readonly grammar: Grammar, expression: string) {
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
    const type = this.grammar.hasOperation(word) ? "operation" : "value";
    return new Token(type, word);
  }
}
