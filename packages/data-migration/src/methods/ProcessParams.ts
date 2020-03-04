import { ProcessorParams } from "../Processor";
import { Logger } from "../Logger";

export default async function ProcessParams(
  params: Record<string, string | ProcessorParams>,
  log: Logger,
  defaultParams?: Record<string, string>
): Promise<Record<string, string>> {
  let newParams: Record<string, string> = {};
  for (const key of Object.keys(params)) {
    try {
      const value = params[key];

      if (!value || typeof value === "string") {
        newParams[key] = value;
        continue;
      }

      log(`Processing parameter ${key}`);
      if (!value.processor) {
        throw new Error(`No processor provided for ${key}`);
      }

      const processorResult = await value.processor(
        {
          ...defaultParams,
          ...value.params,
        },
        log
      );
      newParams[key] = processorResult;
    } catch (ex) {
      log(ex.message);
      throw ex;
    }
  }

  return newParams;
}
