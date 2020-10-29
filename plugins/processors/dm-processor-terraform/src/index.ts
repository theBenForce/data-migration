import { Processor, Logger } from "data-migration";
import { checkParameters } from "data-migration/lib/Utils";

const { name: pkgName } = require("../package.json");

import { readFileSync, existsSync as fileExists } from "fs";

const FILENAME_KEY = "filename";
const OUTPUT_KEY = "output";

interface ProcessorParameters {
  filename: string;
  output: string;
}

interface TerraformOutput {
  sensitive: boolean;
  type: string;
  value: string;
}

const cachedData = {} as Record<string, Record<string, TerraformOutput>>;

function loadTfOutputs(filename: string, log: Logger): Record<string, TerraformOutput> {
  if (!cachedData[filename]) {
    if (!fileExists(filename)) {
      throw Error(`File ${filename} not found while loading terraform outputs`);
    }

    log(`Loading terraform outputs from ${filename}`);
    const content = readFileSync(filename, `utf-8`);
    const outputs = JSON.parse(content);
    cachedData[filename] = outputs;
  }

  return cachedData[filename];
}

const processor: Processor<ProcessorParameters> = async (params, log: Logger) => {
  checkParameters(pkgName, [FILENAME_KEY, OUTPUT_KEY], params);

  const outputs = loadTfOutputs(params.filename, log);

  if (!outputs[params.output])
    throw Error(`Output ${params.output} not found in ${params.filename}`);

  return outputs[params.output].value;
};

export default processor;
