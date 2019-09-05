import { Processor } from "swallow-migration";
import * as AWS from "aws-sdk";
import { checkParameters, createLogger } from "swallow-migration/lib/Utils";

async function getStackOutput(params: {
  [key: string]: string;
}): Promise<Array<AWS.CloudFormation.Output>> {
  const cloudformation = new AWS.CloudFormation({
    apiVersion: "2010-05-15",
    region: params["region"]
  });

  const data = await cloudformation
    .describeStacks({
      StackName: params["stack"]
    })
    .promise();

  if (!data || !data.Stacks)
    throw Error(`Error getting data for stack ${params["stack"]}`);

  return data.Stacks.reduce(
    (
      result: Array<AWS.CloudFormation.Output>,
      current: AWS.CloudFormation.Stack
    ) => {
      if (!current.Outputs) return result;

      return [...result, ...current.Outputs];
    },
    []
  );
}

const processor: Processor = async (
  params: { [key: string]: string },
  observer?: ZenObservable.Observer<string>
) => {
  checkParameters(
    "swallow-processor-cf",
    ["region", "stack", "output"],
    params
  );
  const stack = params["stack"];
  const log = createLogger(observer);

  log(`Getting details for stack ${stack}`);
  const outputs = await getStackOutput(params);
  const outputName = params["output"];

  const output = outputs.find(
    (x: AWS.CloudFormation.Output) => x.OutputKey === outputName
  );

  if (!output) {
    throw new Error(`Could not find output ${outputName} in ${stack}`);
  }

  if (!output.OutputValue) {
    throw new Error(`No value set for ${outputName} in ${stack}`);
  }

  return output.OutputValue;
};

export = processor;
