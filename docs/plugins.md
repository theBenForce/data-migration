# Plugins

There are three types of plugins: processors, drivers, and trackers. Processors
are used when loading the configuration file to get values from outside sources,
like CloudFormation outputs. Drivers are used within the scripts to make the desired
changes. Finally, trackers keep track of which migration scripts have been executed.

- Processors
  - [Cloud Formation](/plugins/processors/dm-processor-cf/README.md)
- Drivers
  - [Aurora RDS](/plugins/drivers/aurora-rds/README.md)
  - [Cognito](/plugins/drivers/cognito/README.md)
  - [DynamoDB](/plugins/drivers/dynamodb/README.md)
- Trackers
  - [DynamoDB](/plugins/trackers/dynamo/README.md)
