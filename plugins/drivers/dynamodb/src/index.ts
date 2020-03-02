import * as AWS from "aws-sdk";
import { DriverBuilder } from "data-migration";
import NoSqlDriver from "data-migration/lib/DriverTypes/NoSQL";

export interface DynamoDbParameters {
  region: string;
  TableName: string;
}

const dynamoDbDriver: DriverBuilder<DynamoDbParameters> = (
  params,
  logger: (message: string) => void
): NoSqlDriver => {
  return {} as NoSqlDriver;
};

export = dynamoDbDriver;
