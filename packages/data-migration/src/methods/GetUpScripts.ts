import Configuration from "../Config";
import MigrationScript, { MigrationExecutor, ScriptContext } from "../MigrationScript";
import { getAllScripts } from "../Utils";
import { Logger } from "../Logger";
import { ExecutionTrackerInstance } from "../ExecutionTracker";

export default async function getUpScripts(
  config: Configuration,
  context: ScriptContext,
  log: Logger,
  tracker?: ExecutionTrackerInstance
): Promise<Array<MigrationScript>> {
  let result = new Array<MigrationScript>();

  let scripts = await getAllScripts(config, log);

  for (const fname of scripts.keys()) {
    const script = scripts.get(fname) as MigrationScript;

    let hasRun = false;

    if (script.hasRun) {
      hasRun = await script.hasRun(context, log);
    } else if (tracker) {
      hasRun = await tracker.isDone(fname);
    }

    if (!hasRun) {
      result.push({
        name: fname,
        async up(context: ScriptContext, log: Logger) {
          let result;
          try {
            result = await script.up(context, log);
            if (tracker) {
              await tracker.markDone(fname);
            }
          } catch (ex) {
            log(`Something went wrong while executing ${fname}: ${JSON.stringify(ex)}`);
          }

          return result;
        },
      });
    }
  }

  return result;
}
