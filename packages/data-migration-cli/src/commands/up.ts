import { Command, flags } from "@oclif/command";
import { ScriptContext } from "data-migration";
import * as Listr from "listr";

import createLogger from "../utils/createLogger";
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
        task(_, task) {
          const filteredScripts = scripts.filter((script) => !script.hasRun);

          task.title = `Running ${filteredScripts.length} Up Migrations on ${stage}`;

          return new Listr(
            filteredScripts.map((script) => ({
              title: script.description ?? script.name,
              task: () =>
                new Listr([
                  {
                    title: `Running script`,
                    task: script.up,
                  },
                  {
                    title: `Cleanup`,
                    async task() {
                      const logger = createLogger(["Cleanup"]);
                      const driversUsed = await context.cleanupDrivers(logger);

                      logger(`${driversUsed.length} drivers used ${driversUsed}`);
                    },
                  },
                ]),
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
