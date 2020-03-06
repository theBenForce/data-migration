import { Logger } from "./Logger";

export interface ProcessorParams<T = Record<string, string>> {
  processor: Processor<T>;
  params: T;
}

type Processor<T> = (params: T, log: Logger) => Promise<string>;

export default Processor;
