import { Logger } from "./Logger";

export function isProcessorParams(value: any): value is ProcessorParams<any> {
  return typeof value?.processor === "function";
}

export interface ProcessorParams<T = any> {
  processor: Processor<T>;
  params: T;
}

type Processor<T> = (params: T, log: Logger) => Promise<string>;

export default Processor;
