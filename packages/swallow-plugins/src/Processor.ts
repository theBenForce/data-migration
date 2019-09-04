export interface ProcessorParams {
  processor: Processor;
  params: Map<string, string>;
}

type Processor = (params: Map<string, string>) => Promise<string>;

export default Processor;
