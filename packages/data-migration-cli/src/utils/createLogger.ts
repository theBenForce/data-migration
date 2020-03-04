import { appendFileSync } from "fs";
import * as path from "path";
import { Logger } from "data-migration";

export const logFile = path.join(process.cwd(), "migration.log");

export default function createLogger(
  labels: Array<string> = [],
  cliOut?: (message: string) => void
): Logger {
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
