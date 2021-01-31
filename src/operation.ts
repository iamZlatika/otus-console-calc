import { Expression } from "./expression";

export class PrefixOperation {
  constructor(readonly name: string, readonly priority: number, readonly process: (right: Expression) => Expression) {}
}

export class PostfixOperation {
  constructor(readonly name: string, readonly priority: number, readonly process: (left: Expression) => Expression) {}
}

export class InfixOperation {
  constructor(
    readonly name: string,
    readonly priority: number,
    readonly process: (left: Expression, right: Expression) => Expression,
    readonly associativity: "left" | "right" = "left"
  ) {}
}

export type Operation = PrefixOperation | PostfixOperation | InfixOperation;
