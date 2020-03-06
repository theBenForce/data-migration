import { Command, flags } from "@oclif/command";
import DataMigrationProcessor, { Configuration, Driver, ScriptContext } from "data-migration";
import { appendFileSync } from "fs";
import Listr = require("listr");
import * as path from "path";

import createLogger, { logFile } from "../utils/createLogger";
import { InitializedMigrationScript } from "data-migration/lib/MigrationScript";
import loadScripts from "../utils/loadScripts";
import { DefaultFlags } from "../default-flags";
export default class Down extends Command {
  static description = "run all down migration scripts";

  static flags = {
    help: flags.help({ char: "h" }),
    ...DefaultFlags,
  };

  static args = [];

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
          const scriptDetails = await loadScripts(flags);
          scripts = scriptDetails.scripts;
          context = scriptDetails.context;
          stage = scriptDetails.stage;
        },
      },
      {
        title: `Running Down Migrations`,
        task(ctx, task) {
          const filteredScripts = scripts
            .filter((script) => script.hasRun)
            .sort((a, b) => (a.name > b.name ? -1 : 1));

          task.title = `Running ${filteredScripts.length} Down Migrations on ${stage}`;

          return new Listr(
            filteredScripts.map((script) => ({
              title: script.description ?? script.name,
              task: script.down,
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
