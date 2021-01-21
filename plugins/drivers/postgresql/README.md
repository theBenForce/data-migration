# Welcome to dm-driver-postgresql 👋

[![Build Status](https://github.com/theBenForce/data-migration/workflows/Release/badge.svg?branch=master)](https://github.com/theBenForce/data-migration/actions)
[![NPM Package](https://img.shields.io/npm/v/dm-driver-postgresql)](https://www.npmjs.com/package/dm-driver-postgresql)
[![Maintainability](https://api.codeclimate.com/v1/badges/89a0c1976c9b89979635/maintainability)](https://codeclimate.com/github/theBenForce/data-migration/maintainability)
[![Documentation](https://img.shields.io/badge/documentation-view-blue)](https://data-migration.js.org/)
[![Downloads/week](https://img.shields.io/npm/dw/dm-driver-postgresql.svg)](https://npmjs.org/package/dm-driver-postgresql)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

> A [Data Migration](https://www.npmjs.com/package/data-migration) driver to run queries on an Aurora RDS instance.

## Configuration

### Parameters

The Aurora RDS driver accepts the following parameters as part of its configuration:

| Name           | Type   | Required | Description                                                      |
| -------------- | ------ | -------- | ---------------------------------------------------------------- |
| region         | string | Yes      | The AWS Region where this table exists                           |
| resourceArn    | string | Yes      | ARN of the Aruora RDS cluster                                    |
| secretArn      | string | Yes      | ARN of the secret manager secret to use for database credentials |
| profile        | string | No       | Name of the AWS profile to use                                   |
| databaseSchema | string | No       | The database schema to connect to by default                     |

### Example

```javascript
const CloudFormationProcessor = require("dm-processor-cf");

module.exports = {
  defaultStage: "prod",
  migrationDirectory: "migrations",
  stages: {
    prod: {
      defaultParams: {
        region: "us-east-1",
        stack: "some-stack-name",
      },
      drivers: {
        auroraDriver: {
          driver: require("dm-driver-postgresql"),
          params: {
            databaseSchema: "some-schema",
            resourceArn: {
              processor: CloudFormationProcessor,
              params: {
                output: "AuroraArn",
              },
            },
            secretArn: {
              processor: CloudFormationProcessor,
              params: {
                output: "AuroraSecretArn",
              },
            },
          },
        },
      },
    },
  },
};
```

## Methods

### query

> Executes a query against the database, returning a rxjs `Observable`

#### Arguments

| Name       | Description                                                                   |
| ---------- | ----------------------------------------------------------------------------- |
| query      | The query string to be executed                                               |
| parameters | An array of `AWS.RDSDataService.SqlParameter`s that will be used in the query |
| options    | A `QueryOptions` object                                                       |

#### Example

```typescript
import { toArray } from "rxjs/operators";
import { AuroraRdsDriver } from "dm-driver-postgresql";

export default {
  async up(context: ScriptContext, log: Logger) {
    const aurora = await context.getDriver<AuroraRdsDriver>("auroraDriver");
    const someTableResults = await aurora
      .query<SomeDataType>(`SELECT * FROM some_table`)
      .pipe(toArray())
      .toPromise();
  },
};
```
