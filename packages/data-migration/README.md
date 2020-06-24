# Welcome to data-migration 👋

[![Build Status](https://github.com/theBenForce/data-migration/workflows/Release/badge.svg?branch=master)](https://github.com/theBenForce/data-migration/actions)
[![NPM Package](https://img.shields.io/npm/v/data-migration)](https://www.npmjs.com/package/data-migration)
[![Maintainability](https://api.codeclimate.com/v1/badges/89a0c1976c9b89979635/maintainability)](https://codeclimate.com/github/theBenForce/data-migration/maintainability)
[![Documentation](https://img.shields.io/badge/documentation-view-blue)](https://data-migration.js.org/)
[![Downloads/week](https://img.shields.io/npm/dw/data-migration.svg)](https://npmjs.org/package/data-migration)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## Tasks

To simplify the migration process, a sql file task has been created. To use it, replace your up/down methods in your migration script like the following:

```typescript
import { MigrationScript } from "data-migration";
import { SqlFile } from "data-migration/lib/tasks/sql";
import * as path from "path";

export default {
  description: "Some migration script",
  ...SqlFile({
    driverName: "SomeSqlDriver",
    upFile: path.resolve(__dirname, "./sql/script-up.sql"),
    downFile: path.resolve(__dirname, "./sql/script-down.sql"),
  }),
} as MigrationScript;
```
