import * as path from "path";
import Configuration from "../Config";

export default function getMigrationsPath(config: Configuration, scope?: string) {
  const folderName = config.migrationDirectory || "migrations";

  const result = path.join(process.cwd(), folderName);

  if (scope) return path.join(result, scope);

  return result;
}
