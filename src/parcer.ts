import { Expression } from "./expression";

export interface Parcer {
  parse(): Expression;
}
