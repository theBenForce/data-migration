import { Command, flags } from "@oclif/command";
import DataMigrationProcessor, { Configuration, Driver, ScriptContext } from "data-migration";
import { appendFileSync } from "fs";
import Listr = require("listr");
import * as path from "path";

import createLogger, { logFile } from "../utils/createLogger";
import { InitializedMigrationScript } from "data-migration/lib/MigrationScript";
import loadScripts from "../utils/loadScripts";
import { DefaultFlags } from "../default-flags";
import createDownMigrationTasks from "../utils/createDownMigrationTasks";

export default class Down extends Command {
  static description = "run down migration scripts";

  static flags = {
    help: flags.help({ char: "h" }),
    ...DefaultFlags,
  };

  static args = [
    {
      name: "numberToRun",
      default: "1",
      description: "number of down scripts to execute",
    },
  ];

  async run() {
    const { args, flags } = this.parse(Down);

    const numberToRun = parseInt(args.numberToRun);

    const tasks = createDownMigrationTasks(flags, numberToRun);

    await tasks.run().catch((ex) => {
      createLogger(["ERROR", "CATCH"])(ex.message);
    });
    createLogger(["Done"])("");
  }
}
