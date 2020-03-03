import { appendFileSync } from "fs";
import * as path from "path";

export const logFile = path.join(process.cwd(), "migration.log");

export default function createLogger(
  labels: Array<string> = [],
  cliOut?: (message: string) => void
): (message: string) => void {
  return (message: string) => {
    appendFileSync(
      logFile,
      [
        "\n",
        new Date().toISOString(),
        ...labels.map((label) => `[${label.trim()}]`),
        message.trim(),
      ].join("\t")
    );

    if (cliOut) {
      cliOut(message);
    }
  };
}
