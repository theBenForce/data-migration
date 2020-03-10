import * as AWS from "aws-sdk";
import { DriverBuilder, NoSqlDriver, Logger, Driver } from "data-migration";
import { Observable } from "rxjs";

interface LambdaParameters {
  region: string;
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
  parameters,
  logger: Logger
): LambdaDriver => {
  const { FunctionName } = parameters;

  const resource = new AWS.Lambda({
    apiVersion: "2015-03-31",
    region: parameters.region,
    accessKeyId: parameters.accessKeyId,
    secretAccessKey: parameters.secretAccessKey,
    endpoint: parameters.endpoint,
  });

  const updatedVariables: Record<string, string> = {};

  return {
    resource,
    parameters,

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
        `Updating ${Object.keys(updatedVariables).length} variables on ${parameters.FunctionName}`
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
