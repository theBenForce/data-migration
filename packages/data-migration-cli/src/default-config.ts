export default `module.exports = {
  defaultStage: "prod",
  migrationDirectory: "migrations",
  stages: {
    prod: {
      users: {
        driver: require("dm-driver-dynamodb"),
        params: {
          region: "us-east-1",
          TableName: {
            processor: require("dm-processor-cf"),
            params: {
              stack: "some-stack-name",
              output: "SomeOutputName",
              region: "us-east-1"
            }
          }
        }
      }
    }
  }
}
`;
