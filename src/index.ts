import { createInterface } from "readline";
import { evaluateExpression, evaluateRPNExpression } from "./engine";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (evaluate: (expression: string) => [Error | null, number | undefined]): Promise<void> =>
  new Promise((resolve) => {
    rl.question("> ", (answer: string) => {
      if (answer === "exit") {
        process.exit(0);
      }
      const [error, result] = evaluate(answer);
      if (error) {
        console.log(error.message);
      } else if (result !== undefined) {
        console.log(`Result: ${result}\n`);
      }
      resolve();
    });
  });

async function app() {
  const mode =
    process.argv
      .filter((arg) => arg.startsWith("--mode="))
      .map((arg) => arg.substr("--mode=".length))
      .pop() ?? "normal";
  const evaluate = mode === "rpn" ? evaluateRPNExpression : evaluateExpression;
  printGreeting(mode);

  while (true) {
    await question(evaluate);
  }
}

const printGreeting = (mode: string) => {
  const greeting = `  Console Calculator (${mode === "rpn" ? "RPN" : "Normal"} mode)  `;
  console.log(`┌${"─".repeat(greeting.length)}┐`);
  console.log(`│${greeting}│`);
  console.log(`└${"─".repeat(greeting.length)}┘`);
};

app();
