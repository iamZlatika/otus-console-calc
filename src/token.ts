export class Token {
  constructor(readonly type: "value" | "operation", readonly text: string) {}
}
