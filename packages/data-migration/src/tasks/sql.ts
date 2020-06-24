import { MigrationScript } from "..";
import { ScriptContext, MigrationExecutor } from "../MigrationScript";
import { Logger } from "../Logger";
import { RdsDriver } from "../DriverTypes";
import * as fs from "fs";

function loadSqlFile(filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filename)) {
      reject(`File ${filename} not found!`);
    }

    fs.readFile(filename, { encoding: "utf-8" }, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function createMigrationExecutor({
  taskName,
  driverName,
  sqlFileName,
}: {
  taskName: string;
  driverName: string;
  sqlFileName: string;
}): MigrationExecutor<void> {
  return async (context: ScriptContext, log: Logger) => {
    log(`Running ${taskName}`);
    const db = await context.getDriver<RdsDriver<any, any>>(driverName);

    const sqlFile = await loadSqlFile(sqlFileName);
    await db.insert(sqlFile);
  };
}

interface SqlFileTaskParameters {
  /** Name of the RDS driver to use */
  driverName: string;

  /** Path to SQL file to run on up migrations */
  upFile?: string;

  /** Path to SQL file to run on down migrations */
  downFile?: string;
}

export function SqlFile(params: SqlFileTaskParameters): Partial<MigrationScript> {
  const result = {} as Partial<MigrationScript>;

  if (params.upFile !== undefined) {
    const sqlFileName = params.upFile;
    const taskName = `up migration ${sqlFileName}`;

    result.up = createMigrationExecutor({
      taskName,
      driverName: params.driverName,
      sqlFileName,
    });
  }

  if (params.downFile !== undefined) {
    const sqlFileName = params.downFile;
    const taskName = `down migration ${sqlFileName}`;

    result.down = createMigrationExecutor({
      taskName,
      driverName: params.driverName,
      sqlFileName,
    });
  }

  return result;
}
