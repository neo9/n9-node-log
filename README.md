# n9-node-log

Logging node module based on Pino.

[![npm version](https://img.shields.io/npm/v/@neo9/n9-node-log.svg)](https://www.npmjs.com/package/@neo9/n9-node-log)
[![Travis](https://img.shields.io/travis/neo9/n9-node-log/master.svg)](https://travis-ci.org/neo9/n9-node-log)
[![Coverage](https://img.shields.io/codecov/c/github/neo9/n9-node-log/master.svg)](https://codecov.io/gh/neo9/n9-node-log)
[![license](https://img.shields.io/github/license/neo9/n9-node-log.svg)](https://github.com/neo9/n9-node-log/blob/master/LICENSE)

## Requirements

- NodeJS >= 10.0.0

## Installation

```bash
npm install --save @neo9/n9-node-log
```

## Usage

```ts
import n9Log from '@neo9/n9-node-log';

const log = n9Log('my-app-name');

// Write on stdout
log.trace('This is a trace message');
log.debug('This is a debug message');
log.info('This is an information message');
log.warn('Warning, this feature will be removed soon');
// Write on stderr
log.error('An error appened');
```

```console
2017-05-12T15:57:14.474Z - info: [my-app-name] This is an information message
2017-05-12T15:57:14.689Z - warn: [my-app-name] Warning, this feature will be removed soon
2017-05-12T15:57:14.974Z - error: [my-app-name] An error appened
```

## Metadata

```ts
log.info('Log with metadata', { anything: 'this is metadata' });
log.error('Here an error', new Error('hello'));
```

```console
2017-05-12T15:57:14.474Z - info: [my-app-name] Log with metadata anything=this is metadata
2017-05-12T15:57:14.785Z - error: [node-ts-skeleton] Here an error Error: hello
     err: {
      "type": "Error",
      "message": "something-went-wrong",
      "stack":
          Error: something-went-wrong
              at /home/bdaniel/projects/neo9/n9-libs/n9-node-log/test/index.ts:110:29
    }
```

## Prefixing

```ts
const logUsers = log.module('users');

logUsers.info('Log specific to users module');
```

```console
2017-05-12T15:57:14.474Z - info: [my-app-name:users] Log specific to users module
```

## Profiling

```ts
log.profile('test');
setTimeout(() => log.profile('test'), 1000);
```

```console
2017-05-12T15:57:14.474Z - info: [my-app-name] test {"durationMs":1000}
```

## Log level

You can filter the list of logs on startup with the `N9LOG` environment or with the `level` option.

Possible values:

- `trace`: Display all logs
- `debug`: Display debug + info + warn + error logs
- `info`: Display info + warn + error logs
- `warn`: Display warn + error logs
- `error`: Display only error logs

Default value: `info`

Example: `N9LOG=error node server.js` will display only error logs.

For performance matter, you can check if you need to compute your log data :

```js
if (log.isLevelEnabled('debug')) {
	log.debug('My debug log', { complexDataAsOneField: JSON.stringify(data) });
}
```

# Breaking changes from V3 to V4

- Log level verbose renamed to log level trace
- JSON Format is enabled by default, it wasn't before
- Remove transports and filters features
