import { Command, flags } from "@oclif/command";
import * as path from "path";

import { cli } from "cli-ux";
import loadScripts from "../utils/loadScripts";

import { formatRelative, parseISO } from "date-fns";
import { InitializedMigrationScript } from "data-migration/src/MigrationScript";

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
        },
        hasRun: { header: "Has Run" },
        executedAt: {
          header: "Executed At",
          get(script: InitializedMigrationScript) {
            if (script.executedAt) {
              return formatRelative(parseISO(script.executedAt), new Date());
            }
          },
        },
      },
      flags
    );
  }
}
