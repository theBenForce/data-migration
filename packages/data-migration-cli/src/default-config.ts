import { format } from "date-fns";

export default (defaultStage = "prod", migrationDirectory = "migrations") => `
/**
 * Data Migration script created on ${format(new Date(), "MMMM do, yyyy")} ${
  process.env.USER ? `by ${process.env.USER}` : ""
}
 */
import { Configuration } from "data-migration";

export default {
  defaultStage: "${defaultStage}",
  migrationDirectory: "${migrationDirectory}",
  stages: {
    prod: {
      defaultParams: {
        region: "us-east-1",
      },
      drivers: {
        users: {
          driver: require("dm-driver-dynamodb"),
          params: {
            TableName: {
              processor: require("dm-processor-cf"),
              params: {
                stack: "some-stack-name",
                output: "SomeOutputName",
              }
            }
          }
        }
      }
    }
  }
} as Configuration;
`;
