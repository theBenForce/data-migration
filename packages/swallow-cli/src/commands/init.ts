import { Command, flags } from "@oclif/command";
import * as fs from "fs";
import YAML from "js-yaml";
import * as path from "path";

import defaultConfig from "../default-config";

export default class Init extends Command {
  static description = "Creates a basic configuration in the current directory";

  static flags = {
    help: flags.help({ char: "h" })
  };

  async run() {
    fs.writeFileSync(path.resolve(".swallow.js"), defaultConfig);
  }
}
