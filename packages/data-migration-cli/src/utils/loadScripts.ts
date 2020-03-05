import DataMigrationProcessor, { Configuration, Driver, ScriptContext } from "data-migration";
import { appendFileSync } from "fs";
import * as path from "path";

import createLogger, { logFile } from "../utils/createLogger";
import { InitializedMigrationScript } from "data-migration/src/MigrationScript";
import { Subscriber } from "rxjs";

interface LoadScriptsResult {
  scripts: Array<InitializedMigrationScript>;
  context: ScriptContext;
  stage: string;
}
export default async function loadScripts(
  configPath: string,
  forcedStage?: string
): Promise<LoadScriptsResult> {
  let config: Configuration = require(path.resolve(configPath));
  let stage = forcedStage || config.defaultStage || "prod";
  let scripts: Array<InitializedMigrationScript>;
  let drivers: Map<string, Driver>;
  let context: ScriptContext;
  appendFileSync(logFile, `\n\nStarting migration at ${new Date().toISOString()}`);
  const logger = createLogger(["Init"]);
  logger("Loading drivers");
  drivers = await DataMigrationProcessor.loadDrivers(
    config.stages[stage],
    logger,
    (driverName: string) => createLogger(["DRIVER", driverName])
  );
  logger("Creating script context");
  const stageParams = await DataMigrationProcessor.processParams(
    config.stages[stage].contextParams || {},
    logger
  );
  context = DataMigrationProcessor.createScriptContext(drivers, stageParams);
  const tracker = await DataMigrationProcessor.loadExecutionTracker(
    config.stages[stage],
    logger,
    () => createLogger(["TRACKER"])
  );
  logger("Finding scripts");
  scripts = await DataMigrationProcessor.getScripts(
    config,
    context,
    logger,
    (scriptName: string, subsriber?: Subscriber<string>) =>
      createLogger(["SCRIPT", scriptName], subsriber),
    tracker
  );
  logger(`Found ${scripts.length} scripts`);

  return { scripts, context, stage };
}
