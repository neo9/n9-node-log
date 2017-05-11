# n9-node-log

Logging module based on Winston for Neo9.

## Installation

```bash
npm install --save n9-node-log
```

## Usage

```ts
import N9Log from 'n9-node-log'

const log = N9Log('my-app-name')

// Write on stdout
log.info('This is an information message')
log.warn('Warning, this feature will be removed soon')
// Write on stderr
log.error('An error appened')
```

```bash
info: [my-app-name] This is an information message
warn: [my-app-name] Warning, this feature will be removed soon
error: [my-app-name] An error appened
```

## Metadata

```ts
log.info('Log with metadata', { anything: 'this is metadata' })
log.error('Here an error', new Error('hello'))
```

```bash
info: [my-app-name] Log with metadata anything=this is metadata
error: [node-ts-skeleton] Here an error Error: hello
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
info: [my-app-name:users] Log specific to users module
```

## Profiling

```ts
log.profile('test')
setTimeout(() => log.profile('test'), 1000)
```

```bash
info: [my-app-name] test durationMs=1000
```

## Log level

You can filter the list of logs on startup with the `N9LOG` environement.

Possible values:
- `info`: Display all logs (info + warn + error)
- `warn`: Display info + warn logs
- `error`: Display only error logs

Default value: `info`

Example: `N9LOG=error node server.js`

## Transports

Define the transporter(s) you want to use to store your logs, notice that you can combine them.

### `console`

Will output the logs into `process.stdout` and `process.stderr`.

- Type: `Boolean`
- Default: `true`

Example:

```ts
const log = N9Log('my-app-name', {
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
const log = N9Log('my-app-name', {
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
const log = N9Log('my-app-name', {
	http: [
		{
			host: 'my-logs.io',
			path: '/save',
			ssl: true
		}
	]
})
```
