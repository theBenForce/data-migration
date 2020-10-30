import * as AWS from "aws-sdk";
import { DriverBuilder, Logger, Driver } from "data-migration";

interface LambdaParameters {
  region: string;
  profile?: string;
  FunctionName: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  endpoint?: string;
}

export interface LambdaDriver extends Driver<LambdaParameters, AWS.Lambda> {
  /** Creates or updates an environment variable */
  setVariable(key: string, value: string): void;

  /** Get the value of an evironment variable. If setVariable has been called
   * for the requested variable, then that value will be returned */
  getVariable(key: string): Promise<string | undefined>;
}

const lambdaDriverBuilder: DriverBuilder<LambdaParameters, AWS.Lambda> = (
  params,
  logger: Logger
): LambdaDriver => {
  let FunctionName: string;
  let parameters = params;
  let resource: AWS.Lambda;

  const updatedVariables: Record<string, string> = {};

  return {
    get resource() {
      return resource;
    },
    get parameters() {
      return parameters;
    },

    async init(params) {
      logger(`Initializing with parameters: ${JSON.stringify(params)}`);
      parameters = params;
      FunctionName = params.FunctionName;

      resource = new AWS.Lambda({
        apiVersion: "2015-03-31",
        region: params.region,
        accessKeyId: params.accessKeyId,
        secretAccessKey: params.secretAccessKey,
        endpoint: params.endpoint,
        credentials: params.profile
          ? new AWS.SharedIniFileCredentials({ profile: params.profile })
          : undefined,
      });
    },

    setVariable(key: string, value: string) {
      updatedVariables[key] = value;
    },

    async getVariable(key: string): Promise<string | undefined> {
      if (updatedVariables[key]) {
        return updatedVariables[key];
      }

      const config = await resource
        .getFunctionConfiguration({
          FunctionName,
        })
        .promise();

      return config?.Environment?.Variables?.[key];
    },

    async cleanup() {
      if (!Object.keys(updatedVariables).length) {
        return;
      }

      logger(
        `Updating ${Object.keys(updatedVariables).length} variables on ${params.FunctionName}`
      );

      const oldConfig = await resource
        .getFunctionConfiguration({
          FunctionName,
        })
        .promise();

      const Variables: Record<string, string> = {};

      Object.entries({ ...oldConfig?.Environment?.Variables, ...updatedVariables }).forEach(
        (entry) => {
          const [key, value] = entry;
          Variables[key] = value;
        }
      );

      const result = await resource
        .updateFunctionConfiguration({
          FunctionName,
          Environment: { Variables },
        })
        .promise();

      logger(`Variable update result: ${JSON.stringify(result)}`);

      logger(`Finished cleaning up`);
    },
  };
};

export default lambdaDriverBuilder;
