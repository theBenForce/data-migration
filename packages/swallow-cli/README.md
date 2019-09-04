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
swallow-cli/1.0.1 darwin-x64 node-v10.16.0
$ swallow --help [COMMAND]
USAGE
  $ swallow COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`swallow hello [FILE]`](#swallow-hello-file)
* [`swallow help [COMMAND]`](#swallow-help-command)

## `swallow hello [FILE]`

describe the command here

```
USAGE
  $ swallow hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ swallow hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/drg-adaptive/swallow-migration/blob/v1.0.1/src/commands/hello.ts)_

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
<!-- commandsstop -->
