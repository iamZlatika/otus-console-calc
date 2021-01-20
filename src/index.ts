import { createInterface } from "readline";
import { ExpressionLexer } from "./lexer";
import { ExpressionParser } from "./parser";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const evaluate = (expression: string): number => {
  const parsedExpression = new ExpressionParser(new ExpressionLexer(expression)).parse();
  try {
    return parsedExpression ? parsedExpression.evaluate() : undefined;
  } catch (e) {
    console.log(e.message);
  }
};

const question = (): Promise<boolean> =>
  new Promise((resolve) => {
    rl.question("> ", (answer: string) => {
      if (answer === "exit") {
        resolve(false);
        return;
      }
      const result = evaluate(answer);
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
