import { LoadConfigParameters, ProcessorParams } from ".";
import { Logger } from "./Logger";

export interface ExecutionTrackerParams {
  executionTracker: ExecutionTracker;
  params: LoadConfigParameters<string | ProcessorParams>;
}

export interface TrackerInstance {
  markDone(script: string): Promise<void>;
  isDone(script: string): Promise<void>;
  remove(script: string): Promise<void>;
}

type ExecutionTracker = <T = Record<string, string>>(params: T, logger: Logger) => TrackerInstance;
