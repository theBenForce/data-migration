import { Command, flags } from "@oclif/command";
import * as path from "path";

import { cli } from "cli-ux";
import loadScripts from "../utils/loadScripts";

import { formatRelative, parseISO, formatDistance } from "date-fns";
import { InitializedMigrationScript } from "data-migration/lib/MigrationScript";
import { DefaultFlags } from "../default-flags";

export default class List extends Command {
  static description = "list all migration scripts and their status";

  static flags = {
    help: flags.help({ char: "h" }),
    ...DefaultFlags,
    ...cli.table.Flags,
  };

  static args = [];

  async run() {
    const { args, flags } = this.parse(List);
    const { scripts } = await loadScripts(flags);

    cli.info(`Found ${scripts.length} scripts`);
    cli.table(
      scripts,
      {
        name: {
          header: "Script",
        },
        description: {
          header: "Description",
        },
        executedAt: {
          header: "Executed",
          minWidth: 25,
          get(script: InitializedMigrationScript) {
            if (script.executionInformation) {
              return formatRelative(script.executionInformation.start, new Date());
            }

            return "";
          },
        },
        time: {
          header: "Took",
          minWidth: 25,
          get(script: InitializedMigrationScript) {
            if (script.executionInformation) {
              return formatDistance(
                script.executionInformation.finished,
                script.executionInformation.start,
                { includeSeconds: true }
              );
            }
            return "";
          },
        },
        drivers: {
          header: "Drivers Used",
          get(script: InitializedMigrationScript) {
            if (script.executionInformation) {
              return script.executionInformation.driversUsed.join(", ");
            }
            return "";
          },
        },
      },
      flags
    );
  }
}
