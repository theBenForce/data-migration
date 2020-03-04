import { Command, flags } from "@oclif/command";
import DataMigrationProcessor, {
  Configuration,
  Driver,
  MigrationExecutor,
  ScriptContext,
} from "data-migration";
import { appendFileSync } from "fs";
import * as Listr from "listr";
import * as path from "path";

import createLogger, { logFile } from "../utils/createLogger";
import { InitializedMigrationScript } from "data-migration/src/MigrationScript";
import { cli } from "cli-ux";
import loadScripts from "../utils/loadScripts";

export default class List extends Command {
  static description = "list all migration scripts and their status";

  static flags = {
    help: flags.help({ char: "h" }),
    stage: flags.string({
      description: "Stage that will be used when loading config values",
    }),
    ...cli.table.Flags,
  };

  static args = [{ name: "config", default: path.resolve("./.dm.config.js") }];

  async run() {
    const { args, flags } = this.parse(List);
    const { scripts } = await loadScripts(args.config, flags.stage);

    cli.info(`Found ${scripts.length} scripts`);
    cli.table(
      scripts,
      {
        name: {
          header: "Script",
          extended: true,
        },
        executedAt: { extended: true },
        hasRun: {},
      },
      flags
    );
  }
}
