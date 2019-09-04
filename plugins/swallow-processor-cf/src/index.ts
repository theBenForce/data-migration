import { Processor } from "swallow-plugins";
import * as AWS from "aws-sdk";
import { checkParameters } from "swallow-plugins/lib/Utils";

async function getStackOutput(
  params: Map<string, string>
): Promise<Array<AWS.CloudFormation.Output>> {
  const cloudformation = new AWS.CloudFormation({
    apiVersion: "2010-05-15",
    region: params.get("region")
  });

  const data = await cloudformation
    .describeStacks({
      StackName: params.get("stack")
    })
    .promise();

  if (!data || !data.Stacks)
    throw Error(`Error getting data for stack ${params.get("stack")}`);

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

const processor: Processor = async (params: Map<string, string>) => {
  checkParameters(
    "swallow-processor-cf",
    ["region", "stack", "output"],
    params
  );

  const outputs = await getStackOutput(params);
  const outputName = params.get("output");
  const stack = params.get("stack");

  const output = outputs.find(
    (x: AWS.CloudFormation.Output) => x.OutputKey === outputName
  );

  if (!output)
    throw new Error(`Could not find output ${outputName} in ${stack}`);

  if (!output.OutputValue)
    throw new Error(`No value set for ${outputName} in ${stack}`);

  return output;
};

exports = processor;
