# n9-node-log

Logging node module based on Winston.

[![npm version](https://img.shields.io/npm/v/@neo9/n9-node-log.svg)](https://www.npmjs.com/package/@neo9/n9-node-log)
[![Travis](https://img.shields.io/travis/neo9/n9-node-log/master.svg)](https://travis-ci.org/neo9/n9-node-log)
[![Coverage](https://img.shields.io/codecov/c/github/neo9/n9-node-log/master.svg)](https://codecov.io/gh/neo9/n9-node-log)
[![license](https://img.shields.io/github/license/neo9/n9-node-log.svg)](https://github.com/neo9/n9-node-log/blob/master/LICENSE)

## Installation

```bash
npm install --save @neo9/n9-node-log
```

## Usage

```ts
import n9Log from '@neo9/n9-node-log'

const log = n9Log('my-app-name')

// Write on stdout
log.verbose('This is a verbose message')
log.debug('This is a debug message')
log.info('This is an information message')
log.warn('Warning, this feature will be removed soon')
// Write on stderr
log.error('An error appened')
```

```bash
2017-05-12T15:57:14.474Z - info: [my-app-name] This is an information message
2017-05-12T15:57:14.689Z - warn: [my-app-name] Warning, this feature will be removed soon
2017-05-12T15:57:14.974Z - error: [my-app-name] An error appened
```

## Metadata

```ts
log.info('Log with metadata', { anything: 'this is metadata' })
log.error('Here an error', new Error('hello'))
```

```bash
2017-05-12T15:57:14.474Z - info: [my-app-name] Log with metadata anything=this is metadata
2017-05-12T15:57:14.785Z - error: [node-ts-skeleton] Here an error Error: hello
    at Object.<anonymous> (/home/schopin/Neo9/node-ts-skeleton/src/index.ts:16:28)
    at Module._compile (module.js:571:32)
    at ...
```

## Prefixing

```ts
const logUsers = log.module('users')

logUsers.info('Log specific to users module')
```

```bash
2017-05-12T15:57:14.474Z - info: [my-app-name:users] Log specific to users module
```

## Profiling

```ts
log.profile('test')
setTimeout(() => log.profile('test'), 1000)
```

```bash
2017-05-12T15:57:14.474Z - info: [my-app-name] test durationMs=1000
```

## Log level

You can filter the list of logs on startup with the `N9LOG` environement or with the `level` option.

Possible values:

- `verbose`: Display all logs
- `debug`: Display debug + info + warn + error logs
- `info`: Display info + warn + error logs
- `warn`: Display info + warn logs
- `error`: Display only error logs

Default value: `verbose`

Example: `N9LOG=error node server.js` will display only error logs.

## Transports

Define the transporter(s) you want to use to store your logs, notice that you can combine them.

### `console`

Will output the logs into `process.stdout` and `process.stderr`.

- Type: `Boolean`
- Default: `true`

Example:

```ts
const log = n9Log('my-app-name', {
  console: false, // Don't output the logs into the console
})
```

### `files`

Will write the log output into specified file(s).

- Type: `Array`
- Default: `[]`
- Properties:
  - `level`: Level of messages to write into the file (default: `'info'`)
  - `filename`: Path of the logfile
  - `maxsize`: Max sizes in bytes of the logfile
  - `maxFiles`: Limit the number of files created

Example:

```ts
const log = n9Log('my-app-name', {
  files: [
    {
      level: 'info',
      filename: '/tmp/info-log.log'
    }
  ]
})
```

### `http`

- Type: `Array`
- Default: `[]`
- Properties:
  - `host`: (Default: `'localhost'`) Remote host of the HTTP logging endpoint
  - `port`: (Default: `80` or `443`) Remote port of the HTTP logging endpoint
  - `path`: (Default: `'/'`) Remote URI of the HTTP logging endpoint
  - `auth`: (Default: None) An object representing the `username` and `password` for HTTP Basic Auth
  - `ssl`: (Default: `false`) Value indicating if we should us HTTPS

Example:

```ts
const log = n9Log('my-app-name', {
  http: [
    {
      host: 'my-logs.io',
      path: '/save',
      ssl: true
    }
  ]
})
```

### `transports`

Useful for adding custom transports into `n9-node-log`:

- Type: `Array`
- Default: `[]`

Example:

```ts
import * as WinstonElasticSearch from 'winston-elasticsearch'

const log = n9Log('test', {
  console: false,
  transports: [
    new WinstonElasticSearch({
      index: 'n9-log',
      level: 'info',
      mappingTemplate: require('winston-elasticsearch/index-template-mapping.json'),
      flushInterval: 200
    })
  ]
})
```
