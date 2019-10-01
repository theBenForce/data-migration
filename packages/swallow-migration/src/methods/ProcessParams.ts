export default async function ProcessParams(
  params: any,
  log: (message: string) => void
): Promise<{ [key: string]: string }> {
  let newParams: { [key: string]: string } = {};
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

      const processorResult = await value.processor(value.params, log);
      newParams[key] = processorResult;
    } catch (ex) {
      log(ex.message);
      throw ex;
    }
  }

  return newParams;
}
