import { Command, flags } from "@oclif/command";
import DataMigrationProcessor, {
  Configuration,
  Driver,
  MigrationExecutor,
  ScriptContext,
} from "data-migration/lib";
import { appendFileSync } from "fs";
import * as Listr from "listr";
import * as path from "path";

import createLogger, { logFile } from "../utils/createLogger";

export default class Up extends Command {
  static description = "run all migration scripts";

  static flags = {
    help: flags.help({ char: "h" }),
    stage: flags.string({
      description: "Stage that will be used when loading config values",
    }),
  };

  static args = [{ name: "config", default: path.resolve("./.dm.config.js") }];

  async run() {
    const { args, flags } = this.parse(Up);
    let config: Configuration = require(args.config);

    let stage = flags.stage || config.defaultStage || "prod";
    let scripts: Array<{ name: string; up: MigrationExecutor<void> }>;
    let drivers: Map<string, Driver>;
    let context: ScriptContext;

    appendFileSync(logFile, `\n\nStarting migration at ${new Date().toISOString()}`);

    const tasks = new Listr([
      {
        title: `Load configuration for stage: ${stage}`,
        async task() {
          const logger = createLogger(["Init"]);

          logger("Loading drivers");
          drivers = await DataMigrationProcessor.loadDrivers(
            config.stages[stage],
            logger,
            (driverName: string) => createLogger(["DRIVER", driverName])
          );

          logger("Creating script context");
          const stageParams = await DataMigrationProcessor.processParams(
            config.stages[stage].params || {},
            logger
          );
          context = DataMigrationProcessor.createScriptContext(drivers, stageParams);

          logger("Finding up scripts");
          scripts = await DataMigrationProcessor.getUpScripts(config, context, logger);
          logger(`Found ${scripts.length} up scripts`);
        },
      },
      {
        title: `Running Migrations`,
        task() {
          return new Listr(
            scripts.map((script) => ({
              title: script.name,
              async task() {
                const log = createLogger(["SCRIPT", script.name]);

                await script.up(context, log).catch((ex: any) => {
                  createLogger(["ERROR", script.name, "CATCH"])(ex.message);
                });
              },
            }))
          );
        },
      },
      {
        title: `Cleanup`,
        task: () => {
          const logger = createLogger(["Cleanup"]);
          return new Listr(
            context.getDriversUsed().map((driverName: string) => ({
              title: driverName,
              async task() {
                logger(`Cleaning up driver ${driverName}`);
                const driver = await context.getDriver(driverName);
                if (driver.cleanup) await driver.cleanup();
              },
            }))
          );
        },
      },
    ]);

    await tasks.run().catch((ex) => {
      createLogger(["ERROR", "CATCH"])(ex.message);
    });
    createLogger(["Done"])("");
  }
}
