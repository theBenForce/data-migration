import DataMigrationProcessor, { Configuration, Driver, ScriptContext } from "data-migration";
import { appendFileSync } from "fs";
import * as path from "path";

import createLogger, { logFile } from "../utils/createLogger";
import { InitializedMigrationScript } from "data-migration/lib/MigrationScript";
import { Subscriber } from "rxjs";
import { loadConfiguration } from "data-migration/src";
import { DefaultFlagParameters } from "../default-flags";

interface LoadScriptsResult {
  scripts: Array<InitializedMigrationScript>;
  context: ScriptContext;
  stage: string;
}
export default async function loadScripts(
  flags: DefaultFlagParameters
): Promise<LoadScriptsResult> {
  let config = await loadConfiguration(path.resolve(flags.config));
  let stage = flags.stage ?? config.defaultStage ?? "prod";
  let scripts: Array<InitializedMigrationScript>;
  let drivers: Map<string, Driver>;
  let context: ScriptContext;

  appendFileSync(
    logFile,
    `\n\nStarting migration at ${new Date().toISOString()} on stage ${stage}`
  );
  const logger = createLogger(["Init"]);

  const stageConfig = config.stages[stage];
  logger(`Stage config: ${JSON.stringify(stageConfig)}`);

  logger("Loading drivers");
  drivers = await DataMigrationProcessor.loadDrivers(stageConfig, logger, (driverName: string) =>
    createLogger(["DRIVER", driverName])
  );

  logger("Processing stage context parameters");
  const stageParams = await DataMigrationProcessor.processParams(
    stageConfig.contextParams || {},
    logger
  );

  logger("Creating script context");
  context = DataMigrationProcessor.createScriptContext(drivers, stageParams);

  logger("Creating migration tracker");
  const tracker = await DataMigrationProcessor.loadExecutionTracker(stageConfig, logger, () =>
    createLogger(["TRACKER"])
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
