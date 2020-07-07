# data-migration-cli

A migration utility for AWS resources

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Documentation](https://img.shields.io/badge/documentation-view-blue)](https://data-migration.js.org/)
[![Version](https://img.shields.io/npm/v/data-migration-cli.svg)](https://npmjs.org/package/data-migration-cli)
[![Downloads/week](https://img.shields.io/npm/dw/data-migration-cli.svg)](https://npmjs.org/package/data-migration-cli)
[![License](https://img.shields.io/npm/l/data-migration-cli.svg)](https://github.com/drg-adaptive/data-migration/blob/master/package.json)

<!-- toc -->
* [data-migration-cli](#data-migration-cli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g data-migration-cli
$ migrate COMMAND
running command...
$ migrate (-v|--version|version)
data-migration-cli/2.8.3 linux-x64 node-v12.18.1
$ migrate --help [COMMAND]
USAGE
  $ migrate COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`migrate down [NUMBERTORUN]`](#migrate-down-numbertorun)
* [`migrate help [COMMAND]`](#migrate-help-command)
* [`migrate init`](#migrate-init)
* [`migrate list`](#migrate-list)
* [`migrate new NAME`](#migrate-new-name)
* [`migrate reset`](#migrate-reset)
* [`migrate up`](#migrate-up)

## `migrate down [NUMBERTORUN]`

run down migration scripts

```
USAGE
  $ migrate down [NUMBERTORUN]

ARGUMENTS
  NUMBERTORUN  [default: 1] number of down scripts to execute

OPTIONS
  -h, --help               show CLI help
  --awsProfile=awsProfile  AWS Profile to use
  --config=config          [default: ./.dm.config.ts] Path to the configuration file
  --scope=scope            Script scope to use
  --stage=stage            Stage name to use
```

_See code: [lib/commands/down.js](https://github.com/theBenForce/data-migration/blob/v2.8.3/lib/commands/down.js)_

## `migrate help [COMMAND]`

display help for migrate

```
USAGE
  $ migrate help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `migrate init`

Creates a basic configuration in the current directory

```
USAGE
  $ migrate init

OPTIONS
  -d, --directory=directory  [default: migrations] Path to migration directory
  -h, --help                 show CLI help
  --awsProfile=awsProfile    AWS Profile to use
  --config=config            [default: ./.dm.config.ts] Path to the configuration file
  --scope=scope              Script scope to use
  --stage=stage              Stage name to use
```

_See code: [lib/commands/init.js](https://github.com/theBenForce/data-migration/blob/v2.8.3/lib/commands/init.js)_

## `migrate list`

list all migration scripts and their status

```
USAGE
  $ migrate list

OPTIONS
  -h, --help               show CLI help
  -x, --extended           show extra columns
  --awsProfile=awsProfile  AWS Profile to use
  --columns=columns        only show provided columns (comma-separated)
  --config=config          [default: ./.dm.config.ts] Path to the configuration file
  --csv                    output is csv format [alias: --output=csv]
  --filter=filter          filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=csv|json|yaml   output in a more machine friendly format
  --scope=scope            Script scope to use
  --sort=sort              property to sort by (prepend '-' for descending)
  --stage=stage            Stage name to use
```

_See code: [lib/commands/list.js](https://github.com/theBenForce/data-migration/blob/v2.8.3/lib/commands/list.js)_

## `migrate new NAME`

Create a new migration script

```
USAGE
  $ migrate new NAME

OPTIONS
  -h, --help       show CLI help
  --config=config  [default: ./.dm.config.ts] Path to the configuration file
  --scope=scope    Script scope to use
```

_See code: [lib/commands/new.js](https://github.com/theBenForce/data-migration/blob/v2.8.3/lib/commands/new.js)_

## `migrate reset`

run all down migration scripts

```
USAGE
  $ migrate reset

OPTIONS
  -h, --help               show CLI help
  --awsProfile=awsProfile  AWS Profile to use
  --config=config          [default: ./.dm.config.ts] Path to the configuration file
  --scope=scope            Script scope to use
  --stage=stage            Stage name to use
```

_See code: [lib/commands/reset.js](https://github.com/theBenForce/data-migration/blob/v2.8.3/lib/commands/reset.js)_

## `migrate up`

run all migration scripts

```
USAGE
  $ migrate up

OPTIONS
  -h, --help               show CLI help
  --awsProfile=awsProfile  AWS Profile to use
  --config=config          [default: ./.dm.config.ts] Path to the configuration file
  --scope=scope            Script scope to use
  --stage=stage            Stage name to use
```

_See code: [lib/commands/up.js](https://github.com/theBenForce/data-migration/blob/v2.8.3/lib/commands/up.js)_
<!-- commandsstop -->
