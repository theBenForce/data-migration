import { Command, flags } from "@oclif/command";
import DataMigrationProcessor, {
  Configuration,
  Driver,
  MigrationExecutor,
  ScriptContext,
} from "data-migration";
import { appendFileSync } from "fs";
import * as Listr from "listr";
import * as path from "path";

import createLogger, { logFile } from "../utils/createLogger";
import { InitializedMigrationScript } from "data-migration/src/MigrationScript";
import loadScripts from "../utils/loadScripts";

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
        title: `Running Up Migrations`,
        task(ctx, task) {
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
