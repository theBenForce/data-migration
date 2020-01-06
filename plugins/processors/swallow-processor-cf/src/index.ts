import * as AWS from "aws-sdk";
import { DescribeStacksOutput } from "aws-sdk/clients/cloudformation";
import { Processor } from "data-migration";
import { checkParameters } from "data-migration/lib/Utils";

const cache: { [key: string]: { [key: string]: DescribeStacksOutput } } = {};

async function getStackOutput(params: {
  [key: string]: string;
}): Promise<Array<AWS.CloudFormation.Output>> {
  const region = params["region"];
  const stackName = params["stack"];
  let data;

  if (!cache[region]) {
    cache[region] = {};
  }

  data = cache[region][stackName];

  if (!data) {
    const cloudformation = new AWS.CloudFormation({
      apiVersion: "2010-05-15",
      region
    });

    data = await cloudformation
      .describeStacks({
        StackName: stackName
      })
      .promise();

    cache[region][stackName] = data;
  }

  if (!data || !data.Stacks)
    throw Error(`Error getting data for stack ${stackName}`);

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
  log: (message: string) => void
) => {
  checkParameters(
    "swallow-processor-cf",
    ["region", "stack", "output"],
    params
  );
  const stack = params["stack"];

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

  log(`Found "${outputName}" value of "${output.OutputValue}"`);
  return output.OutputValue;
};

export = processor;
