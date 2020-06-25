import { Command, flags } from "@oclif/command";

import createLogger from "../utils/createLogger";
import { DefaultFlags } from "../default-flags";
import createDownMigrationTasks from "../utils/createDownMigrationTasks";
export default class Reset extends Command {
  static description = "run all down migration scripts";

  static flags = {
    help: flags.help({ char: "h" }),
    ...DefaultFlags,
  };

  static args = [];

  async run() {
    const { flags } = this.parse(Reset);

    const tasks = createDownMigrationTasks(flags);

    await tasks.run().catch((ex) => {
      createLogger(["ERROR", "CATCH"])(ex.message);
    });
    createLogger(["Done"])("");
  }
}
