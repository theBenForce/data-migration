import Configuration from "../Config";
import MigrationScript, { ScriptContext, InitializedMigrationScript } from "../MigrationScript";
import { getAllScripts } from "../Utils";
import { Logger } from "../Logger";
import { ExecutionTrackerInstance } from "../ExecutionTracker";

export default async function getScripts(
  config: Configuration,
  context: ScriptContext,
  log: Logger,
  tracker?: ExecutionTrackerInstance
): Promise<Array<InitializedMigrationScript>> {
  let result = new Array<InitializedMigrationScript>();

  let scripts = await getAllScripts(config, log);

  for (const fname of scripts.keys()) {
    const script = scripts.get(fname) as MigrationScript;

    let hasRun = false;

    if (script.hasRun) {
      hasRun = await script.hasRun(context, log);
    } else if (tracker) {
      hasRun = await tracker.isDone(fname);
    }

    result.push({
      name: fname,
      hasRun,
      async up(context: ScriptContext, log: Logger) {
        let result;
        try {
          result = await script.up(context, log);
          if (tracker) {
            await tracker.markDone(fname);
          }
        } catch (ex) {
          log(`Something went wrong while executing ${fname} up script: ${JSON.stringify(ex)}`);
        }

        return result;
      },
      async down(context: ScriptContext, log: Logger) {
        let result;
        try {
          if (script.down) {
            result = await script.down(context, log);
          }

          if (tracker) {
            await tracker.remove(fname);
          }
        } catch (ex) {
          log(`Something went wrong while executing ${fname} down script: ${JSON.stringify(ex)}`);
        }

        return result;
      },
    });
  }

  return result;
}
