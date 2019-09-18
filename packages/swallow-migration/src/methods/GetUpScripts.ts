import { Driver } from "../DriverTypes";

import { createLogger, createErrorLogger, loadScript } from "../Utils";

import * as fs from "fs";
import * as path from "path";
import Configuration from "../Config";
import getMigrationsPath from "./GetMigrationsPath";
import MigrationScript, { MigrationExecutor } from "../MigrationScript";
import createScriptContext from "./CreateScriptContext";

import * as babel from "@babel/core";

export default async function getUpScripts(
  config: Configuration,
  drivers: Map<string, Driver>,
  log: (message: string) => void
): Promise<Array<{ name: string; up: MigrationExecutor<void> }>> {
  let scripts = new Map<string, MigrationScript>();
  let result = new Array<{ name: string; up: MigrationExecutor<void> }>();

  let scriptFiles = fs
    .readdirSync(getMigrationsPath(config))
    .filter((fname: string) => /\.(t|j)s$/gi.test(fname));

  for (const fname of scriptFiles) {
    try {
      const filename = path.join(getMigrationsPath(config), fname);
      const script = await loadScript<MigrationScript>(filename);

      scripts.set(fname, script);
    } catch (ex) {
      log(ex.message);
    }
  }

  const context = createScriptContext(drivers);

  for (const fname of scripts.keys()) {
    const script = scripts.get(fname) as MigrationScript;

    let hasRun = false;

    if (script.hasRun) {
      hasRun = await script.hasRun(context, log);
    }

    if (!hasRun) {
      result.push({
        name: fname,
        up: script.up
      });
    }
  }

  return result;
}
