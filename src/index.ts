import { createInterface } from "readline";
import { ExpressionLexer } from "./lexer";
import { ExpressionParser } from "./parser";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (): Promise<boolean> =>
  new Promise((resolve) => {
    rl.question("> ", (answer: string) => {
      if (answer === "exit") {
        resolve(false);
        return;
      }
      const expression = new ExpressionParser(new ExpressionLexer(answer)).parse();
      const result = expression ? expression.evaluate() : undefined;
      if (result !== undefined) {
        console.log(`Result: ${result}\n`);
      }
      resolve(true);
    });
  });

async function app() {
  while (await question()) {}
}

app().then(() => {
  process.exit(0);
});
