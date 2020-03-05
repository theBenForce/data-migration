import Configuration from "../Config";
import MigrationScript, { ScriptContext, InitializedMigrationScript } from "../MigrationScript";
import { getAllScripts } from "../Utils";
import { Logger } from "../Logger";
import { ExecutionTrackerInstance, ExecutionInformation } from "../ExecutionTracker";

export default async function getScripts(
  config: Configuration,
  context: ScriptContext,
  log: Logger,
  createLogger: (scriptName: string) => Logger,
  tracker?: ExecutionTrackerInstance
): Promise<Array<InitializedMigrationScript>> {
  let result = new Array<InitializedMigrationScript>();

  let scripts = await getAllScripts(config, log);

  for (const fname of scripts.keys()) {
    const script = scripts.get(fname) as MigrationScript;

    let hasRun = false;
    let executionInformation: ExecutionInformation | undefined;

    if (script.hasRun) {
      hasRun = await script.hasRun(context, log);
    } else if (tracker) {
      executionInformation = await tracker.wasExecuted(fname);
      hasRun = Boolean(executionInformation);
    }

    const scriptLogger = createLogger(fname);

    result.push({
      name: fname,
      executionInformation,
      hasRun,
      async up() {
        let result;
        const start = new Date();
        try {
          result = await script.up(context, scriptLogger);
          if (tracker) {
            await tracker.markDone(fname, start, context.getDriversUsed());
          }
        } catch (ex) {
          scriptLogger(
            `Something went wrong while executing ${fname} up script: ${JSON.stringify(ex)}`
          );
          throw ex;
        }

        return result;
      },
      async down() {
        let result;
        try {
          if (script.down) {
            result = await script.down(context, scriptLogger);
          }

          if (tracker) {
            await tracker.remove(fname);
          }
        } catch (ex) {
          scriptLogger(
            `Something went wrong while executing ${fname} down script: ${JSON.stringify(ex)}`
          );
          throw ex;
        }

        return result;
      },
    });
  }

  return result;
}
