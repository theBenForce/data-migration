import { Command, flags } from "@oclif/command";
import { format } from "date-fns";
import * as path from "path";
import * as fs from "fs";

export default class New extends Command {
  static description = "describe the command here";

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

    let name = path.join(prefix, `${scriptName}.js`);

    fs.writeFileSync(
      name,
      `
/**
 * @typedef {import('swallow-migration').MigrationDrivers} MigrationDrivers
 */

module.exports = {
  name: "${args.name}",
  /**
   * Run the acutal migration
   * @param {MigrationDrivers} drivers
   * @param {(message: string) => void} log
   */
  async up(drivers, log) {
    log("Running up migration ${scriptName}");
  },

  /**
   * Revert all changes in the up script
   * @param {MigrationDrivers} drivers
   * @param {(message: string) => void} log
   */
  async down(drivers, log) {
    log("Running down migration ${scriptName}");
  },

  /**
   * Determines if this script has already been executed
   * @param {MigrationDrivers} drivers
   * @param {(message: string) => void} log
   */
  async hasRun(drivers, log) {
    return false;
  }
};

    `
    );
  }
}
