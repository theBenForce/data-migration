import Configuration from "../Config";
import MigrationScript, { MigrationExecutor, ScriptContext } from "../MigrationScript";
import { getAllScripts } from "../Utils";
import { Logger } from "../Logger";

export default async function getUpScripts(
  config: Configuration,
  context: ScriptContext,
  log: Logger
): Promise<Array<{ name: string; up: MigrationExecutor<void> }>> {
  let result = new Array<{ name: string; up: MigrationExecutor<void> }>();

  let scripts = await getAllScripts(config, log);

  for (const fname of scripts.keys()) {
    const script = scripts.get(fname) as MigrationScript;

    let hasRun = false;

    if (script.hasRun) {
      hasRun = await script.hasRun(context, log);
    }

    if (!hasRun) {
      result.push({
        name: fname,
        up: script.up,
      });
    }
  }

  return result;
}
