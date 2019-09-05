import { Command, flags } from "@oclif/command";
import * as Listr from "listr";
import * as path from "path";
import SwallowMigration from "swallow-migration";
import * as Observable from "zen-observable";

export default class Up extends Command {
  static description = "describe the command here";

  static flags = {
    help: flags.help({ char: "h" }),
    stage: flags.string({
      description: "Stage that will be used when loading config values"
    })
  };

  static args = [{ name: "config", default: path.resolve("./.swallow.js") }];

  async run() {
    const { args, flags } = this.parse(Up);
    let config = require(args.config);

    let stage = flags.stage;

    if (!stage) {
      stage = config.defaultStage || "prod";
    }

    // @ts-ignore
    config = config[stage];

    const tasks = new Listr([
      {
        title: `Load configuration for stage: ${stage}`,
        task() {
          return new Observable<any>(
            // @ts-ignore
            async (observer: ZenObservable.Observer<any>) => {
              config = await SwallowMigration.loadConfig(config, observer);

              // @ts-ignore
              observer.complete();
            }
          );
        }
      }
    ]);

    const result = await tasks.run();
    console.info(JSON.stringify(config, null, 2));
  }
}
