import { createInterface } from "readline";
import { evaluate } from "./engine";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (): Promise<void> =>
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
  console.log("┌────────────────────┐");
  console.log("│ Console Calculator │");
  console.log("└────────────────────┘");

  while (true) {
    await question();
  }
}

app();
