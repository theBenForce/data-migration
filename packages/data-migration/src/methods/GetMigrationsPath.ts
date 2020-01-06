import * as path from "path";
import Configuration from "../Config";

export default function getMigrationsPath(config: Configuration) {
  const folderName = config.migrationDirectory || "migrations";

  return path.join(process.cwd(), folderName);
}
