export interface ProcessorParams {
  processor: Processor;
  params: { [key: string]: string };
}

type Processor = (
  params: { [key: string]: string },
  log: (message: string) => void
) => Promise<string>;

export default Processor;
