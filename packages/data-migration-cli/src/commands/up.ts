import { Command, flags } from "@oclif/command";
import { ScriptContext } from "data-migration";
import { appendFileSync } from "fs";
import * as Listr from "listr";

import createLogger, { logFile } from "../utils/createLogger";
import { InitializedMigrationScript } from "data-migration/lib/MigrationScript";
import loadScripts from "../utils/loadScripts";
import { DefaultFlags } from "../default-flags";

export default class Up extends Command {
  static description = "run all migration scripts";

  static flags = {
    help: flags.help({ char: "h" }),
    ...DefaultFlags,
  };

  static args = [];

  async run() {
    const { flags } = this.parse(Up);
    let stage: string = "";
    let scripts: Array<InitializedMigrationScript>;
    let context: ScriptContext;

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
        title: `Running Up Migrations`,
        task(task) {
          const filteredScripts = scripts.filter((script) => !script.hasRun);

          task.title = `Running ${filteredScripts.length} Up Migrations on ${stage}`;

          return new Listr(
            filteredScripts.map((script) => ({
              title: script.description ?? script.name,
              task: script.up,
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
