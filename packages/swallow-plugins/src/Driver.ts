import { ProcessorParams } from "./Processor";

export default abstract class Driver {
  protected params: Map<string, string>;

  constructor() {
    this.params = new Map<string, string>();
  }

  async setParams(params: Map<string, string | ProcessorParams>) {
    for (const key of params.keys()) {
      const value = params.get(key);

      if (!value) {
        return;
      }

      if (typeof value === "string") {
        this.params.set(key, value);
        return;
      }

      const result = await value.processor(value.params);
      this.params.set(key, result);
    }
  }
}
