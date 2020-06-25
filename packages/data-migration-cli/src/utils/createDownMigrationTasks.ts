import { DefaultFlagParameters } from "../default-flags";
import Listr = require("listr");
import loadScripts from "./loadScripts";
import createLogger from "./createLogger";
import { ScriptContext } from "data-migration";
import { InitializedMigrationScript } from "data-migration/lib/MigrationScript";

export default function (flags: DefaultFlagParameters, numberToRun: number = Infinity): Listr {
  let stage: string = "";
  let scripts: Array<InitializedMigrationScript>;
  let context: ScriptContext;

  return new Listr([
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
          .sort((a, b) => (a.name > b.name ? -1 : 1))
          .slice(0, numberToRun);

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
}
