import Configuration from "../Config";
import MigrationScript, {
  MigrationExecutor,
  ScriptContext
} from "../MigrationScript";
import { getAllScripts } from "../Utils";

export default async function getDownScripts(
  config: Configuration,
  context: ScriptContext,
  log: (message: string) => void
): Promise<Array<{ name: string; down: MigrationExecutor<void> }>> {
  let result = new Array<{ name: string; down: MigrationExecutor<void> }>();

  let scripts = await getAllScripts(config, log);

  for (const fname of scripts.keys()) {
    const script = scripts.get(fname) as MigrationScript;

    let hasRun = false;

    if (script.hasRun) {
      hasRun = await script.hasRun(context, log);
    }

    if (hasRun && script.down) {
      result.push({
        name: fname,
        down: script.down
      });
    }
  }

  return result;
}
