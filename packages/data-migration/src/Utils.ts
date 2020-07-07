import * as babel from "@babel/core";
import * as fs from "fs";
import * as path from "path";

import { MigrationScript, ScriptContext } from "./";

import Configuration from "./Config";
import { MissingParameters } from "./Errors";
import { getMigrationsPath } from "./methods";
import { Logger } from "./Logger";

import * as glob from "fast-glob";

export function checkParameters(
  label: string,
  requiredParams: Array<string>,
  params: { [key: string]: any }
) {
  const missingParams = requiredParams.filter((key) => !params[key]);
  if (missingParams.length > 0) {
    throw new MissingParameters(label, missingParams);
  }
}

export function createLogger(observer?: ZenObservable.Observer<any>) {
  return function (message: string) {
    if (observer && observer.next) {
      observer.next(message);
    } else {
      // tslint:disable-next-line:no-console
      console.log(message);
    }
  };
}

export function createErrorLogger(observer?: ZenObservable.Observer<any>) {
  return function log(message: string) {
    if (observer && observer.error) {
      observer.error(message);
    } else {
      // tslint:disable-next-line:no-console
      console.error(message);
    }
  };
}

export class CompileScriptError extends Error {
  constructor(public filename: string) {
    super(`Error while compiling ${filename}`);
  }
}

export async function loadScript<T>(
  filename: string,
  log: Logger,
  scriptGlobals?: any
): Promise<T> {
  const babelConfig = {
    presets: ["@babel/preset-typescript", ["@babel/preset-env", { targets: { node: true } }]],
    plugins: [
      [
        "module-resolver",
        {
          root: [path.dirname(filename)],
          extensions: [".js", ".json", ".ts"],
          resolvePath(source: string, currentFile: string, opts: object) {
            log(`Resolving "${source}" from "${currentFile}"`);

            if (source.startsWith("./")) return path.resolve(path.dirname(currentFile), source);
            return source;
          },
        },
      ],
    ],
    cwd: path.dirname(filename),
    filename,
  };

  log(`Loading file "${filename}"`);
  log(`Babel Params:\n${JSON.stringify(babelConfig)}`);

  const fileContent = fs.readFileSync(filename, "utf-8");

  const prefix = `const context = ${JSON.stringify(scriptGlobals ?? {})};\n`;

  const transformResult = await babel.transformAsync(prefix + fileContent, babelConfig);

  let script: T;

  function evaluateScript(code: string): T {
    const __dirname = path.dirname(filename);
    const __filename = filename;
    return eval(code);
  }

  if (transformResult?.code) {
    script = evaluateScript(transformResult.code);
  } else {
    log(`Failed to compile "${filename}"`);
    log(JSON.stringify(transformResult));
    throw new CompileScriptError(filename);
  }

  // @ts-ignore
  return script;
}

export interface GetAllScripts {
  config: Configuration;
  scope?: string;
  log: Logger;
}

async function getScriptFiles(
  config: Configuration,
  log: Logger,
  scope?: string
): Promise<Array<string>> {
  const migrationsPath = getMigrationsPath(config);

  log(`Looking for scripts in path "${migrationsPath}", with scope "${scope}"`);

  const entries = await glob(scope ? path.join(scope, "*.ts") : "*.ts", {
    cwd: migrationsPath,
    onlyFiles: true,
    deep: 2,
    absolute: true,
  });

  log(`Found ${entries.length} scripts: ${JSON.stringify(entries)}`);

  return entries;
}

export async function getAllScripts({
  config,
  scope,
  log,
}: GetAllScripts): Promise<Map<string, MigrationScript>> {
  let scripts = new Map<string, MigrationScript>();
  let scriptFiles = await getScriptFiles(config, log, scope);

  for (const filename of scriptFiles) {
    let script: MigrationScript;
    try {
      script = await loadScript<MigrationScript>(filename, log);
    } catch (ex) {
      log(ex.message);
      const errorMessage = ex.message;
      script = {
        async up(context: ScriptContext, log: Logger) {
          log(errorMessage);
          throw new Error(errorMessage);
        },
        async down(context: ScriptContext, log: Logger) {
          log(errorMessage);
          throw new Error(errorMessage);
        },
      };
    }

    scripts.set(path.basename(filename), script);
  }

  return scripts;
}
