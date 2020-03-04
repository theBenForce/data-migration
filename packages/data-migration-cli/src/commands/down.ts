import { Command, flags } from "@oclif/command";
import DataMigrationProcessor, { Configuration, Driver, ScriptContext } from "data-migration";
import { appendFileSync } from "fs";
import Listr = require("listr");
import * as path from "path";

import createLogger, { logFile } from "../utils/createLogger";
import { InitializedMigrationScript } from "data-migration/src/MigrationScript";
import loadScripts from "../utils/loadScripts";
export default class Down extends Command {
  static description = "run all down migration scripts";

  static flags = {
    help: flags.help({ char: "h" }),
    stage: flags.string({
      description: "Stage that will be used when loading config values",
    }),
  };

  static args = [{ name: "config", default: path.resolve("./.dm.config.js") }];

  async run() {
    const { args, flags } = this.parse(Down);
    let stage: string = "";
    let scripts: Array<InitializedMigrationScript>;
    let context: ScriptContext;

    appendFileSync(logFile, `\n\nStarting migration at ${new Date().toISOString()}`);

    const tasks = new Listr([
      {
        title: `Load configuration`,
        async task() {
          const scriptDetails = await loadScripts(args.config, flags.stage);
          scripts = scriptDetails.scripts;
          context = scriptDetails.context;
          stage = scriptDetails.stage;
        },
      },
      {
        title: `Running Migrations for stage "${stage}"`,
        task() {
          return new Listr(
            scripts
              .filter((script) => script.hasRun)
              .map((script) => ({
                title: script.name,
                async task() {
                  const log = createLogger(["SCRIPT", script.name]);

                  await script.down().catch((ex: any) => {
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
