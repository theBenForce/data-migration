import { LoadConfigParameters } from "..";
import { ProcessorParams } from "../Processor";
import { Logger } from "../Logger";
import { ExecutionTrackerInstance } from "../ExecutionTracker";
import ProcessParams from "./ProcessParams";

export default async function loadExecutionTracker(
  stageConfig: LoadConfigParameters<string | ProcessorParams>,
  log: Logger,
  createLogger: () => Logger
): Promise<ExecutionTrackerInstance | undefined> {
  if (!stageConfig.tracker) return;

  try {
    log(`Processing tracker params`);

    const params = await ProcessParams(stageConfig.tracker.params, log, stageConfig.defaultParams);

    return stageConfig.tracker.executionTracker(params, createLogger());
  } catch (ex) {
    log(`Error creating execution tracker: ${JSON.stringify(ex)}`);
  }
}
