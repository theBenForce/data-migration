
export interface ExecutionTrackerParams {
  executionTracker: ExecutionTracker;
  params: LoadConfigParameters<string | ProcessorParams>;
}

type ExecutionTracker = (params: Record<string, string>, log)
