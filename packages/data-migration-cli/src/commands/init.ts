import { Command, flags } from "@oclif/command";
import * as fs from "fs";
import * as Listr from "listr";
import * as path from "path";

import defaultConfig from "../default-config";
import { DefaultFlags } from "../default-flags";

export default class Init extends Command {
  static description = "Creates a basic configuration in the current directory";

  static flags = {
    help: flags.help({ char: "h" }),
    directory: flags.string({
      default: "migrations",
      char: "d",
      description: "Path to migration directory",
    }),
    ...DefaultFlags,
  };

  async run() {
    const { args, flags } = this.parse(Init);

    const tasks = new Listr([
      {
        title: "Creating config",
        task() {
          fs.writeFileSync(path.resolve(flags.config), defaultConfig(flags.stage, flags.directory));
        },
      },
    ]);

    await tasks.run();
  }
}
