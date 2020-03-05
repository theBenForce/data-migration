import { LoadConfigParameters, ProcessorParams } from ".";
import { Logger } from "./Logger";

export interface ExecutionTrackerParams {
  executionTracker: ExecutionTracker;
  params: Record<string, string | ProcessorParams>;
}

export interface ExecutionInformation {
  start: Date;
  finished: Date;
  driversUsed: Array<string>;
}

export interface ExecutionTrackerInstance {
  markDone(script: string, start: Date, driversUsed: Array<string>): Promise<void>;
  wasExecuted(script: string): Promise<ExecutionInformation | undefined>;
  remove(script: string): Promise<void>;
}

export type ExecutionTracker<T = Record<string, string>> = (
  params: T,
  logger: Logger
) => ExecutionTrackerInstance;
