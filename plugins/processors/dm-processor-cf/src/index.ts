import * as AWS from "aws-sdk";
import { DescribeStacksOutput, ListStackResourcesOutput } from "aws-sdk/clients/cloudformation";
import { Processor, Logger } from "data-migration";
import { checkParameters } from "data-migration/lib/Utils";

const { name: pkgName } = require("../package.json");

const cache: Record<string, Record<string, DescribeStacksOutput>> = {};
const resourceCache: Record<string, Record<string, ListStackResourcesOutput>> = {};

const REGION_KEY = "region";
const STACK_KEY = "stack";
const OUTPUT_KEY = "output";

async function getStackOutput(
  params: GetOutputParameters
): Promise<Array<AWS.CloudFormation.Output>> {
  const region = params[REGION_KEY];
  const stackName = params[STACK_KEY];
  let data;

  if (!cache[region]) {
    cache[region] = {};
  }

  data = cache[region][stackName];

  if (!data) {
    const cloudformation = new AWS.CloudFormation({
      apiVersion: "2010-05-15",
      region,
    });

    data = await cloudformation
      .describeStacks({
        StackName: stackName,
      })
      .promise();

    cache[region][stackName] = data;
  }

  if (!data || !data.Stacks) throw Error(`Error getting data for stack ${stackName}`);

  return data.Stacks.reduce(
    (result: Array<AWS.CloudFormation.Output>, current: AWS.CloudFormation.Stack) => {
      if (!current.Outputs) return result;

      return [...result, ...current.Outputs];
    },
    []
  );
}

interface ProcessorParameters {
  stack: string;
  region: string;
}

function isOutputParameters(value: any): value is GetOutputParameters {
  return value?.stack && value?.region && value?.output;
}
interface GetOutputParameters extends ProcessorParameters {
  output: string;
}

function isResourceParameters(value: any): value is GetResourceParameters {
  return value?.stack && value?.region && value?.logicalId;
}
interface GetResourceParameters extends ProcessorParameters {
  logicalId: string;
}

const processor: Processor<GetOutputParameters | GetResourceParameters> = async (
  params,
  log: Logger
) => {
  checkParameters(pkgName, [REGION_KEY, STACK_KEY], params);

  if (isOutputParameters(params)) {
    return getOutputValue(log, params);
  } else if (isResourceParameters(params)) {
    return getResourceValue(log, params);
  } else {
    log(`Unknown parameters: ${JSON.stringify(params)}`);
    throw new Error(`Unknown parameters provided to dm-processor-cf: ${JSON.stringify(params)}`);
  }
};

async function getResourceValue(log: Logger, params: GetResourceParameters): Promise<string> {
  const { stack, region, logicalId } = params;
  log(`Getting details for ${region} stack ${stack}`);

  let data: ListStackResourcesOutput;

  if (!resourceCache[region]) {
    resourceCache[region] = {};
  }

  data = resourceCache[region][stack];

  if (!data) {
    const cloudformation = new AWS.CloudFormation({
      apiVersion: "2010-05-15",
      region,
    });

    data = await cloudformation
      .listStackResources({
        StackName: stack,
      })
      .promise();

    resourceCache[region][stack] = data;

    log(`Found ${data?.StackResourceSummaries?.length} resources`);
  } else {
    log(`Got resources from cache`);
  }

  if (!data?.StackResourceSummaries) throw Error(`Error getting data for stack ${stack}`);

  const resource = data.StackResourceSummaries.find(
    (resource) => resource.LogicalResourceId === logicalId
  );

  if (!resource?.PhysicalResourceId) throw new Error(`Could not find resource ${logicalId}`);

  log(`Found "${resource.LogicalResourceId}" value of "${resource.PhysicalResourceId}"`);

  return resource.PhysicalResourceId;
}

async function getOutputValue(log: Logger, params: GetOutputParameters): Promise<string> {
  const { stack, region } = params;

  log(`Getting details for ${region} stack ${stack}`);
  const outputs = await getStackOutput(params);
  const outputName = params[OUTPUT_KEY];
  const output = outputs.find((x: AWS.CloudFormation.Output) => x.OutputKey === outputName);
  if (!output) {
    throw new Error(`Could not find output ${outputName} in ${stack}`);
  }
  if (!output.OutputValue) {
    throw new Error(`No value set for ${outputName} in ${stack}`);
  }
  log(`Found "${outputName}" value of "${output.OutputValue}"`);
  return output.OutputValue;
}

export default processor;
