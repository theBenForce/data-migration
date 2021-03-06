import Configuration from "../Config";
import MigrationScript, { ScriptContext, InitializedMigrationScript } from "../MigrationScript";
import { getAllScripts } from "../Utils";
import { Logger } from "../Logger";
import { ExecutionTrackerInstance, ExecutionInformation } from "../ExecutionTracker";
import { Observable, Subscriber } from "rxjs";

export interface GetScriptsParameters {
  config: Configuration;
  scope?: string;
  context: ScriptContext;
  log: Logger;
  createLogger: (scriptName: string, subscriber?: Subscriber<string>) => Logger;
  tracker?: ExecutionTrackerInstance;
}
export default async function getScripts({
  config,
  scope,
  context,
  log,
  createLogger,
  tracker,
}: GetScriptsParameters): Promise<Array<InitializedMigrationScript>> {
  let result = new Array<InitializedMigrationScript>();

  let scripts = await getAllScripts({ config, scope, log });

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

    result.push({
      name: fname,
      description: script.description,
      executionInformation,
      hasRun,
      up: () =>
        // @ts-ignore
        new Observable(async (subscriber: Subscriber<string>) => {
          let result;
          const start = new Date();
          const scriptLogger = createLogger(fname, subscriber);
          try {
            result = await script.up(context, scriptLogger);
            if (tracker) {
              scriptLogger(`Marking as done`);
              await tracker.markDone(fname, start, context.getDriversUsed());
            }
          } catch (ex) {
            scriptLogger(
              `Something went wrong while executing ${fname} up script: ${JSON.stringify(ex)}`
            );
            subscriber.error(ex);
          }

          subscriber.complete();
          return result;
        }),
      down: () =>
        // @ts-ignore
        new Observable(async (subscriber: Subscriber<string>) => {
          let result;
          const scriptLogger = createLogger(fname, subscriber);
          try {
            if (script.down) {
              result = await script.down(context, scriptLogger);
            }

            if (tracker) {
              scriptLogger(`Removing execution record`);
              await tracker.remove(fname);
            }
          } catch (ex) {
            scriptLogger(
              `Something went wrong while executing ${fname} down script: ${JSON.stringify(ex)}`
            );
            subscriber.error(ex);
          }

          subscriber.complete();
          return result;
        }),
    });
  }

  return result;
}
