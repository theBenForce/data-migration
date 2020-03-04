import * as AWS from "aws-sdk";
import { ExecutionTracker, ExecutionTrackerInstance } from "data-migration/lib/ExecutionTracker";
import { Logger } from "data-migration";

interface DynamoTrackerParams {
  region: string;
  TableName: string;
  keyConfiguration: {
    partitionKey: string;
    sortKey: string;
  };
  accessKeyId?: string;
  secretAccessKey?: string;
  endpoint?: string;
  prefix?: string;
}

const DEFAULT_MIGRATION_PREFIX = "migrations";
const EXECUTED_AT_PROPERTY = "executed_at";

const tracker: ExecutionTracker<DynamoTrackerParams> = (params, log: Logger) => {
  const { TableName } = params;
  const DocumentDb = new AWS.DynamoDB.DocumentClient({
    region: params.region,
    apiVersion: "2012-08-10",
    accessKeyId: params.accessKeyId,
    secretAccessKey: params.secretAccessKey,
    endpoint: params.endpoint,
  });
  const prefix = params.prefix ?? DEFAULT_MIGRATION_PREFIX;

  return {
    async wasExecuted(script: string): Promise<string | undefined> {
      let result: string | undefined;

      const resultDetails = await DocumentDb.query({
        TableName,
        KeyConditionExpression: "#primaryKey = :primaryKey and #sortKey = :sortKey",
        ExpressionAttributeNames: {
          "#primaryKey": params.keyConfiguration.partitionKey,
          "#sortKey": params.keyConfiguration.sortKey,
        },
        ExpressionAttributeValues: {
          ":primaryKey": prefix,
          ":sortKey": script,
        },
      }).promise();

      resultDetails.Items?.forEach((item) => (result = item[EXECUTED_AT_PROPERTY]));

      return result;
    },

    async markDone(script: string) {
      const Item = {} as Record<string, string>;
      Item[EXECUTED_AT_PROPERTY] = new Date().toISOString();
      Item[params.keyConfiguration.partitionKey] = prefix;
      Item[params.keyConfiguration.sortKey] = script;

      await DocumentDb.put({
        TableName,
        Item,
      }).promise();
    },

    async remove(script: string) {
      const Key = {} as Record<string, string>;
      Key[params.keyConfiguration.partitionKey] = prefix;
      Key[params.keyConfiguration.sortKey] = script;

      await DocumentDb.delete({
        TableName,
        Key,
      }).promise();
    },
  } as ExecutionTrackerInstance;
};

export = tracker;
