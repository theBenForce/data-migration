import { Processor } from "swallow-plugins";
import * as AWS from "aws-sdk";
async function getStackOutput(
  ctx: IFlagsContext
): Promise<Array<AWS.CloudFormation.Output>> {
  const cloudformation = new AWS.CloudFormation({
    apiVersion: "2010-05-15",
    region: ctx.flags.region
  });

  const data = await cloudformation
    .describeStacks({
      StackName: ctx.flags.stack
    })
    .promise();

  if (!data || !data.Stacks)
    throw Error(`Error getting data for stack ${ctx.flags.stack}`);

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
  return "Some value";
};

exports = processor;
