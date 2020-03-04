import { Logger } from "./Logger";

export interface ProcessorParams {
  processor: Processor;
  params: Record<string, string>;
}

type Processor = (params: Record<string, string>, log: Logger) => Promise<string>;

export default Processor;
