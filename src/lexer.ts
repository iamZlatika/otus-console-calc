import { Token } from "./token";

export interface Lexer {
  readToken(): Token;
}
