export interface ProcessorParams {
  processor: Processor;
  params: { [key: string]: string };
}

type Processor = (
  params: { [key: string]: string },
  observer?: ZenObservable.Observer<string>
) => Promise<string>;

export default Processor;
