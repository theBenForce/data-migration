# Welcome to dm-aurora-rds 👋

[![Build Status](https://travis-ci.org/theBenForce/data-migration.svg?branch=master)](https://travis-ci.org/theBenForce/data-migration)
[![NPM Package](https://img.shields.io/npm/v/dm-aurora-rds)](https://www.npmjs.com/package/dm-aurora-rds)
[![Maintainability](https://api.codeclimate.com/v1/badges/89a0c1976c9b89979635/maintainability)](https://codeclimate.com/github/theBenForce/data-migration/maintainability)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

> A [Data Migration](https://www.npmjs.com/package/data-migration) driver to run queries on an Aurora RDS instance.

# Configuration

## Parameters

The Aurora RDS driver accepts the following parameters as part of its configuration:

| Name           | Type   | Required | Description                                                      |
| -------------- | ------ | -------- | ---------------------------------------------------------------- |
| region         | string | Yes      | The AWS Region where this table exists                           |
| resourceArn    | string | Yes      | ARN of the Aruora RDS cluster                                    |
| secretArn      | string | Yes      | ARN of the secret manager secret to use for database credentials |
| databaseSchema | string | No       | The database schema to connect to by default                     |

## Sample Configuration

```javascript
module.exports = {
  defaultStage: "prod",
  migrationDirectory: "migrations",
  stages: {
    prod: {
      users: {
        driver: require("dm-aurora-rds"),
        params: {
          region: "us-east-1",
          databaseSchema: "some-schema",
          resourceArn: {
            // Use this processor to get values from CloudFormation
            processor: require("dm-processor-cf"),
            params: {
              stack: "some-stack-name",
              output: "SomeOutputName",
              region: "us-east-1",
            },
          },
          secretArn: {
            // Use this processor to get values from CloudFormation
            processor: require("dm-processor-cf"),
            params: {
              stack: "some-stack-name",
              output: "SomeOutputName",
              region: "us-east-1",
            },
          },
        },
      },
    },
  },
};
```
