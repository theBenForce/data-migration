import { ProcessorParams, isProcessorParams } from "../Processor";
import { Logger } from "../Logger";

export default async function ProcessParams(
  params: Record<string, string | ProcessorParams>,
  log: Logger,
  defaultParams?: Record<string, string>
): Promise<Record<string, string>> {
  let newParams: Record<string, string> = {};
  const sourceParams = { ...params, ...defaultParams };
  for (const key in sourceParams) {
    try {
      let value = params[key];
      let finalValue: string;

      log(`Processing parameter ${key}`);

      if (isProcessorParams(value)) {
        finalValue = await value.processor(
          {
            ...defaultParams,
            ...value.params,
          },
          log
        );
      } else {
        log(`Copying parameter ${key}: "${value}"`);
        finalValue = value;
      }

      newParams[key] = finalValue;
    } catch (ex) {
      log(`Error processing parameter ${key}: ${ex.message}`);
      throw ex;
    }
  }

  return newParams;
}
