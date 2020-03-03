import { Command, flags } from "@oclif/command";
import * as fs from "fs";
import * as Listr from "listr";

import defaultConfig from "../default-config";

export default class Init extends Command {
  static description = "Creates a basic configuration in the current directory";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  async run() {
    const tasks = new Listr([
      {
        title: "Creating config",
        task() {
          fs.writeFileSync("./.dm.config.js", defaultConfig);
        },
      },
    ]);

    await tasks.run();
  }
}
