import { Command, flags } from "@oclif/command";
import { format } from "date-fns";
import * as path from "path";
import * as fs from "fs";

export default class New extends Command {
  static description = "Create a new migration script";

  static flags = {
    help: flags.help({ char: "h" })
  };

  static args = [{ name: "name", required: true }];

  async run() {
    const { args, flags } = this.parse(New);

    const prefix = path.resolve("./migrations");

    if (!fs.existsSync(prefix)) {
      fs.mkdirSync(prefix);
    }

    const scriptName = [
      format(Date.now(), "yyyyMMddHHmmssSSS"),
      args.name.replace(/\s+/g, "_")
    ].join("-");

    let name = path.join(prefix, `${scriptName}.ts`);

    fs.writeFileSync(
      name,
      `
import { ScriptContext } from "swallow-migration";

export default {
  name: "${args.name}",
  /**
   * Run the acutal migration
   */
  async up(context: ScriptContext, log: (message: string) => void) {
    log("Running up migration ${scriptName}");
  },

  /**
   * Revert all changes in the up script
   */
  async down(context: ScriptContext, log: (message: string) => void) {
    log("Running down migration ${scriptName}");
  },

  /**
   * Determines if this script has already been executed
   */
  async hasRun(context: ScriptContext, log: (message: string) => void) {
    return false;
  }
};


    `
    );
  }
}
