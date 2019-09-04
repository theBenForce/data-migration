swallow-cli
===========

A migration utility for AWS resources

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/swallow-cli.svg)](https://npmjs.org/package/swallow-cli)
[![Codecov](https://codecov.io/gh/drg-adaptive/swallow-migration/branch/master/graph/badge.svg)](https://codecov.io/gh/drg-adaptive/swallow-migration)
[![Downloads/week](https://img.shields.io/npm/dw/swallow-cli.svg)](https://npmjs.org/package/swallow-cli)
[![License](https://img.shields.io/npm/l/swallow-cli.svg)](https://github.com/drg-adaptive/swallow-migration/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g swallow-cli
$ swallow COMMAND
running command...
$ swallow (-v|--version|version)
swallow-cli/1.0.4 darwin-x64 node-v10.16.0
$ swallow --help [COMMAND]
USAGE
  $ swallow COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`swallow help [COMMAND]`](#swallow-help-command)
* [`swallow init`](#swallow-init)

## `swallow help [COMMAND]`

display help for swallow

```
USAGE
  $ swallow help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_

## `swallow init`

Creates a basic configuration in the current directory

```
USAGE
  $ swallow init

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/init.ts](https://github.com/drg-adaptive/swallow-migration/blob/v1.0.4/src/commands/init.ts)_
<!-- commandsstop -->
