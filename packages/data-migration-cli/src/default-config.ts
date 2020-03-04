export default `module.exports = {
  defaultStage: "prod",
  migrationDirectory: "migrations",
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
}
`;
