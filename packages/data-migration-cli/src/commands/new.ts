import { Command, flags } from "@oclif/command";
import DataMigrationProcessor, { Configuration } from "data-migration";
import { format } from "date-fns";
import * as fs from "fs";
import * as path from "path";
import { loadConfiguration } from "data-migration";
import { DefaultFlags } from "../default-flags";

export default class New extends Command {
  static description = "Create a new migration script";

  static flags = {
    help: flags.help({ char: "h" }),
    config: DefaultFlags.config,
    scope: DefaultFlags.scope,
  };

  static args = [{ name: "name", required: true }];

  async run() {
    const { args, flags } = this.parse(New);

    let config = await loadConfiguration(path.resolve(flags.config));
    const prefix = DataMigrationProcessor.getMigrationsPath(config, flags.scope);

    if (!fs.existsSync(prefix)) {
      fs.mkdirSync(prefix);
    }

    const scriptName = [
      format(Date.now(), "yyyyMMddHHmmssSSS"),
      args.name.replace(/\s+/g, "_"),
    ].join("-");

    let name = path.join(prefix, `${scriptName}.ts`);

    fs.writeFileSync(
      name,
      `
import { ScriptContext, Logger, MigrationScript } from "data-migration";

export default {
  description: "${args.name}",
  /**
   * Run the acutal migration
   */
  async up(context: ScriptContext, log: Logger) {
    log("Running up migration ${scriptName}");
  },

  /**
   * Revert all changes in the up script
   */
  async down(context: ScriptContext, log: Logger) {
    log("Running down migration ${scriptName}");
  }
} as MigrationScript;


    `
    );
  }
}
