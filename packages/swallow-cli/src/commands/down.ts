import { Command, flags } from "@oclif/command";
import { appendFileSync } from "fs";
import Listr = require("listr");
import * as path from "path";
import SwallowMigration from "swallow-migration";
import Configuration from "swallow-migration/lib/Config";
import { Driver } from "swallow-migration/lib/DriverTypes";
import {
  MigrationExecutor,
  ScriptContext
} from "swallow-migration/lib/MigrationScript";

import createLogger, { logFile } from "../utils/createLogger";
export default class Down extends Command {
  static description = "run all down migration scripts";

  static flags = {
    help: flags.help({ char: "h" }),
    stage: flags.string({
      description: "Stage that will be used when loading config values"
    })
  };

  static args = [{ name: "config", default: path.resolve("./.swallow.js") }];

  async run() {
    const { args, flags } = this.parse(Down);
    let config: Configuration = require(args.config);

    let stage = flags.stage || config.defaultStage || "prod";
    let scripts: Array<{ name: string; down: MigrationExecutor<void> }>;
    let drivers: Map<string, Driver>;
    let context: ScriptContext;

    appendFileSync(
      logFile,
      `\n\nStarting migration at ${new Date().toISOString()}`
    );

    const tasks = new Listr([
      {
        title: `Load configuration for stage: ${stage}`,
        async task() {
          const logger = createLogger(["Init"]);

          logger("Loading drivers");
          drivers = await SwallowMigration.loadDrivers(
            config.stages[stage],
            logger,
            (driverName: string) => createLogger(["DRIVER", driverName])
          );

          logger("Creating script context");
          context = SwallowMigration.createScriptContext(drivers);

          logger("Finding up scripts");
          scripts = await SwallowMigration.getDownScripts(
            config,
            drivers,
            logger
          );
          logger(`Found ${scripts.length} up scripts`);
        }
      },
      {
        title: `Running Migrations`,
        task() {
          return new Listr(
            scripts.map(script => ({
              title: script.name,
              async task() {
                const log = createLogger(["SCRIPT", script.name]);

                await script.down(context, log).catch(ex => {
                  createLogger(["ERROR", script.name, "CATCH"])(ex.message);
                });
              }
            }))
          );
        }
      },
      {
        title: `Cleanup`,
        task: () => {
          const logger = createLogger(["Cleanup"]);
          return new Listr(
            context.getDriversUsed().map(driverName => ({
              title: driverName,
              async task() {
                logger(`Cleaning up driver ${driverName}`);
                const driver = await context.getDriver(driverName);
                await driver.cleanup();
              }
            }))
          );
        }
      }
    ]);

    await tasks.run().catch(ex => {
      createLogger(["ERROR", "CATCH"])(ex.message);
    });
    createLogger(["Done"])("");
  }
}
