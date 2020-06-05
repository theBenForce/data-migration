import * as AWS from "aws-sdk";
import {
  ExecutionTracker,
  ExecutionTrackerInstance,
  ExecutionInformation,
} from "data-migration/lib/ExecutionTracker";
import { Logger } from "data-migration";
import { parseISO } from "date-fns";

interface DynamoTrackerParams {
  region: string;
  profile?: string;
  TableName: string;
  partitionKeyName: string;
  sortKeyName: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  endpoint?: string;
  prefix?: string;
}

const DEFAULT_MIGRATION_PREFIX = "migrations";
const EXECUTED_AT_PROPERTY = "completed_at";
const STARTED_AT_PROPERTY = "started_at";
const DRIVERS_USED = "drivers";

const tracker: ExecutionTracker<DynamoTrackerParams> = (params, log: Logger) => {
  const { TableName } = params;
  const DocumentDb = new AWS.DynamoDB.DocumentClient({
    region: params.region,
    apiVersion: "2012-08-10",
    accessKeyId: params.accessKeyId,
    secretAccessKey: params.secretAccessKey,
    endpoint: params.endpoint,
    credentials: params.profile
      ? new AWS.SharedIniFileCredentials({ profile: params.profile })
      : undefined,
  });
  const prefix = params.prefix ?? DEFAULT_MIGRATION_PREFIX;

  return {
    async wasExecuted(script: string): Promise<ExecutionInformation | undefined> {
      let result: ExecutionInformation | undefined;

      log(`Getting all migration records`);

      const resultDetails = await DocumentDb.query({
        TableName,
        KeyConditionExpression: "#primaryKey = :primaryKey and #sortKey = :sortKey",
        ExpressionAttributeNames: {
          "#primaryKey": params.partitionKeyName,
          "#sortKey": params.sortKeyName,
        },
        ExpressionAttributeValues: {
          ":primaryKey": prefix,
          ":sortKey": script,
        },
      }).promise();

      log(`Found ${resultDetails.Count} migration records`);

      resultDetails.Items?.forEach((item) => {
        result = {
          finished: parseISO(item[EXECUTED_AT_PROPERTY]),
          start: parseISO(item[STARTED_AT_PROPERTY]),
          driversUsed: item[DRIVERS_USED],
        };
      });

      return result;
    },

    async markDone(script: string, start: Date, driversUsed: Array<string>) {
      const Item = {} as Record<string, string | Array<string>>;
      Item[EXECUTED_AT_PROPERTY] = new Date().toISOString();
      Item[STARTED_AT_PROPERTY] = start.toISOString();
      Item[DRIVERS_USED] = driversUsed;
      Item[params.partitionKeyName] = prefix;
      Item[params.sortKeyName] = script;

      log(`Marking script ${script} as done`);

      await DocumentDb.put({
        TableName,
        Item,
      }).promise();
    },

    async remove(script: string) {
      const Key = {} as Record<string, string>;
      Key[params.partitionKeyName] = prefix;
      Key[params.sortKeyName] = script;

      log(`Removing record of ${script}`);
      await DocumentDb.delete({
        TableName,
        Key,
      }).promise();
    },
  } as ExecutionTrackerInstance;
};

export default tracker;
