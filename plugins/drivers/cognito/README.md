# Welcome to dm-driver-cognito 👋

[![Build Status](https://github.com/theBenForce/data-migration/workflows/Release/badge.svg?branch=master)](https://github.com/theBenForce/data-migration/actions)
[![NPM Package](https://img.shields.io/npm/v/dm-driver-cognito)](https://www.npmjs.com/package/dm-driver-cognito)
[![Maintainability](https://api.codeclimate.com/v1/badges/89a0c1976c9b89979635/maintainability)](https://codeclimate.com/github/theBenForce/data-migration/maintainability)
[![Documentation](https://img.shields.io/badge/documentation-view-blue)](https://data-migration.js.org/)
[![Downloads/week](https://img.shields.io/npm/dw/dm-driver-cognito.svg)](https://npmjs.org/package/dm-driver-cognito)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

> A [Data Migration](https://www.npmjs.com/package/data-migration) driver to query/modify a cognito user pool.

## Configuration

### Parameters

The DynamoDB driver accepts the following parameters as part of its configuration:

| Name     | Type   | Required | Description                                |
| -------- | ------ | -------- | ------------------------------------------ |
| region   | string | Yes      | The AWS Region where this user pool exists |
| userPool | string | Yes      | ID of the user pool to connect to          |

### Example

The following configuration creates a Cognito driver that connects to a user pool in the `us-east-1` stack `some-stack-name`.

```javascript
module.exports = {
  defaultStage: "prod",
  migrationDirectory: "migrations",
  stages: {
    prod: {
      defaultParams: {
        region: "us-east-1",
      },
      drivers: {
        users: {
          driver: require("dm-driver-cognito"),
          params: {
            userPoolDriver: {
              // Use this processor to get values from CloudFormation
              processor: require("dm-processor-cf"),
              params: {
                stack: "some-stack-name",
                output: "SomeOutputName",
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

### addUser

> Creates a new user in the user pool

#### Arguments

| Name       | Description                                                                      |
| ---------- | -------------------------------------------------------------------------------- |
| username   | Username to be added.                                                            |
| password   | A temporary password                                                             |
| attributes | Any other parameters that would normally be provided in `AdminCreateUserRequest` |

#### Example

This example creates a new user for "Bill Lumbergh"

```typescript
async up(context: ScriptContext, log: Logger) {
  const userPool = await context.getDriver<UserPoolDriver>("userPoolDriver");
  await userPool.addUser("blumbergh", "password", { UserAttributes: [
    Name: "email",
    Value: "blumbergh@initech.com"
  ]});
}
```

### getUser

> Queries for a user based on their username

#### Arguments

| Name     | Description              |
| -------- | ------------------------ |
| username | The username to look for |

#### Example

Look for the previously created user `blumberg`

```typescript
async up(context: ScriptContext, log: Logger) {
  const userPool = await context.getDriver<UserPoolDriver>("userPoolDriver");
  const user = await userPool.getUser("blumbergh");
}
```

### deleteUser

> Removes the given username from the user pool

#### Arguments

| Name     | Description            |
| -------- | ---------------------- |
| username | The username to delete |

#### Example

Delete the previously created user `blumberg`

```typescript
async up(context: ScriptContext, log: Logger) {
  const userPool = await context.getDriver<UserPoolDriver>("userPoolDriver");
  const user = await userPool.deleteUser("blumbergh");
}
```
