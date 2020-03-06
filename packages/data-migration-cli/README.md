# data-migration-cli

A migration utility for AWS resources

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Documentation](https://img.shields.io/badge/documentation-view-blue)](https://thebenforce.github.io/data-migration/)
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
data-migration-cli/2.4.4 linux-x64 node-v12.16.1
$ migrate --help [COMMAND]
USAGE
  $ migrate COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`migrate down`](#migrate-down)
* [`migrate help [COMMAND]`](#migrate-help-command)
* [`migrate init`](#migrate-init)
* [`migrate list`](#migrate-list)
* [`migrate new NAME`](#migrate-new-name)
* [`migrate up`](#migrate-up)

## `migrate down`

run all down migration scripts

```
USAGE
  $ migrate down

OPTIONS
  -h, --help       show CLI help
  --config=config  [default: ./.dm.config.ts] Path to the configuration file to use
  --stage=stage    [default: migrations] Stage that will be used when loading config values
```

_See code: [src/commands/down.ts](https://github.com/theBenForce/data-migration/blob/v2.4.4/src/commands/down.ts)_

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
  --config=config            [default: ./.dm.config.ts] Path to the configuration file to use
  --stage=stage              [default: migrations] Stage that will be used when loading config values
```

_See code: [src/commands/init.ts](https://github.com/theBenForce/data-migration/blob/v2.4.4/src/commands/init.ts)_

## `migrate list`

list all migration scripts and their status

```
USAGE
  $ migrate list

OPTIONS
  -h, --help              show CLI help
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --config=config         [default: ./.dm.config.ts] Path to the configuration file to use
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)
  --stage=stage           [default: migrations] Stage that will be used when loading config values
```

_See code: [src/commands/list.ts](https://github.com/theBenForce/data-migration/blob/v2.4.4/src/commands/list.ts)_

## `migrate new NAME`

Create a new migration script

```
USAGE
  $ migrate new NAME

OPTIONS
  -h, --help       show CLI help
  --config=config  [default: ./.dm.config.ts] Path to the configuration file to use
```

_See code: [src/commands/new.ts](https://github.com/theBenForce/data-migration/blob/v2.4.4/src/commands/new.ts)_

## `migrate up`

run all migration scripts

```
USAGE
  $ migrate up

OPTIONS
  -h, --help       show CLI help
  --config=config  [default: ./.dm.config.ts] Path to the configuration file to use
  --stage=stage    [default: migrations] Stage that will be used when loading config values
```

_See code: [src/commands/up.ts](https://github.com/theBenForce/data-migration/blob/v2.4.4/src/commands/up.ts)_
<!-- commandsstop -->
