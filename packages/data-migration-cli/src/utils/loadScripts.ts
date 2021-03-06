import DataMigrationProcessor, { Driver, ScriptContext, loadConfiguration } from "data-migration";
import { appendFileSync } from "fs";
import * as path from "path";

import createLogger, { logFile } from "../utils/createLogger";
import { InitializedMigrationScript } from "data-migration/lib/MigrationScript";
import { Subscriber } from "rxjs";
import { DefaultFlagParameters } from "../default-flags";
import { userInfo } from "os";

interface LoadScriptsResult {
  scripts: Array<InitializedMigrationScript>;
  context: ScriptContext;
  stage: string;
}
export default async function loadScripts(
  flags: DefaultFlagParameters
): Promise<LoadScriptsResult> {
  let config = await loadConfiguration(path.resolve(flags.config), { flags });
  let stage = "prod";

  if (flags.stage) {
    stage = flags.stage;
  } else if (config.defaultStage) {
    stage = config.defaultStage;
  }

  let scripts: Array<InitializedMigrationScript>;
  let drivers: Map<string, Driver<any, any>>;
  let context: ScriptContext;

  appendFileSync(
    logFile,
    `\n\nStarting migration at ${new Date().toISOString()} by ${
      userInfo()?.username
    } on stage ${stage}`
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
    { ...stageConfig.contextParams },
    logger,
    stageConfig.defaultParams
  );

  logger("Creating script context");
  context = DataMigrationProcessor.createScriptContext(drivers, stageParams, logger, stageConfig.defaultParams);

  logger("Creating migration tracker");
  const tracker = await DataMigrationProcessor.loadExecutionTracker(stageConfig, logger, () =>
    createLogger(["TRACKER"])
  );

  logger("Finding scripts");
  scripts = await DataMigrationProcessor.getScripts({
    config,
    scope: flags.scope,
    context,
    log: logger,
    createLogger: (scriptName: string, subsriber?: Subscriber<string>) =>
      createLogger(["SCRIPT", scriptName], subsriber),
    tracker,
  });

  logger(`Found ${scripts.length} scripts`);

  return { scripts, context, stage };
}
