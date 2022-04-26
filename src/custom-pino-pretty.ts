// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies
const { colorizerFactory } = require('pino-pretty');

const levelColorize = colorizerFactory(true);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = (opts) =>
	// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require,import/no-extraneous-dependencies
	require('pino-pretty')({
		...opts,
		messageFormat: (log, messageKey) => `[${log.label}] ${log[messageKey]}`,
		customPrettifiers: {
			time: (timestamp) => `${timestamp} -`,
			level: (logLevel) => `${levelColorize(logLevel, {}).toLowerCase()} `,
		},
	});
