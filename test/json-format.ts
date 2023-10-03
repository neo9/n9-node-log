import test from 'ava';

import src from '../src';
import { mockAndCatchStd, removeDatesInJSONLogs } from './fixtures/helper';

test.serial('Simple use case', async (t) => {
	process.env.N9LOG = 'trace';
	const { stdout, stderr } = await mockAndCatchStd(() => {
		const log = src('test');
		log.trace('Trace message');
		log.debug('Debug message');
		log.info('Info message');
		log.warn('Warning message');
		log.error('Error message');
	});
	removeDatesInJSONLogs({ stdout, stderr });

	// Check that logs are written in the right std
	t.is(stdout.length, 4);
	t.is(stderr.length, 1);

	// Check order
	t.true(stdout[0].includes('{"'), 'is JSON shape');
	t.deepEqual(JSON.parse(stdout[0]), {
		level: 'trace',
		message: 'Trace message',
		label: 'test',
	});
	t.deepEqual(JSON.parse(stdout[1]), {
		level: 'debug',
		message: 'Debug message',
		label: 'test',
	});
	t.deepEqual(JSON.parse(stdout[2]), {
		level: 'info',
		message: 'Info message',
		label: 'test',
	});
	t.deepEqual(JSON.parse(stdout[3]), {
		level: 'warn',
		message: 'Warning message',
		label: 'test',
	});
	t.deepEqual(JSON.parse(stderr[0]), {
		level: 'error',
		message: 'Error message',
		label: 'test',
	});

	delete process.env.N9LOG;
});

test.serial('Print context object', async (t) => {
	process.env.N9LOG = 'trace';
	const { stdout, stderr } = await mockAndCatchStd(() => {
		const log = src('test');
		log.trace('Trace message', { contextValue: 'a value' });
		log.debug('Debug message', { contextValue: 'a value' });
		log.info('Info message', { contextValue: 'a value' });
		log.warn('Warning message', { contextValue: 'a value' });
		log.error('Error message', { contextValue: 'a value' });
		log.info('Info message with array in context', {
			contextValue: { anArray: [1, 2, 3, new Date('2016-03-14T00:00:00.000Z')] },
		});
	});
	removeDatesInJSONLogs({ stdout, stderr });
	// Check that logs are written in the right std
	t.is(stdout.length, 5);
	t.is(stderr.length, 1);

	// Check order
	t.true(stdout[0].includes('{"'), 'is JSON shape');
	t.deepEqual(JSON.parse(stdout[0]), {
		level: 'trace',
		message: 'Trace message',
		label: 'test',
		contextValue: 'a value',
	});
	t.deepEqual(JSON.parse(stdout[1]), {
		level: 'debug',
		message: 'Debug message',
		label: 'test',
		contextValue: 'a value',
	});
	t.deepEqual(JSON.parse(stdout[2]), {
		level: 'info',
		message: 'Info message',
		label: 'test',
		contextValue: 'a value',
	});
	t.deepEqual(JSON.parse(stdout[3]), {
		level: 'warn',
		message: 'Warning message',
		label: 'test',
		contextValue: 'a value',
	});
	t.deepEqual(JSON.parse(stdout[4]), {
		level: 'info',
		message: 'Info message with array in context',
		label: 'test',
		contextValue: { anArray: [1, 2, 3, new Date('2016-03-14T00:00:00.000Z').toISOString()] },
	});
	t.deepEqual(JSON.parse(stderr[0]), {
		level: 'error',
		message: 'Error message',
		label: 'test',
		contextValue: 'a value',
	});

	delete process.env.N9LOG;
});

test.serial('Profiling', async (t) => {
	const { stdout, stderr } = await mockAndCatchStd(() => {
		const log = src('test', { formatJSON: true });
		log.profile('foo');
		log.profile('foo');
	});
	removeDatesInJSONLogs({ stdout, stderr });

	const line0 = JSON.parse(stdout[0]);
	delete line0.durationMs;
	t.deepEqual(line0, {
		level: 'info',
		message: 'foo',
		label: 'test',
	});
	t.true(stdout[0].includes('"durationMs":'));
});

test.serial('Simple use case with modules', async (t) => {
	const initialNodeEnv = process.env.NODE_ENV;
	process.env.NODE_ENV = 'production';

	const { stdout, stderr } = await mockAndCatchStd(() => {
		const log = src('test', { formatJSON: true, level: 'trace' }).module('ava');
		log.trace('Trace message');
		log.debug('Debug message');
		log.info('Info message');
		log.warn('Warning message');
		log.error('Error message');
		log.addFilter(({ message, context }) => ({
			message: `(filter) ${message}`,
			context: {
				meta: { method: 'GET', path: '/foo' },
				...context,
			},
		}));
		log.info('Info message with filter');
		log.info('Info message with filter and some context not override', { test: 1 });

		log.module('module2-not-json', { formatJSON: false }).info(`A message not in " JSON`);
	});
	removeDatesInJSONLogs({ stdout, stderr });

	// Check that logs are written in the right std
	t.is(stdout.length, 8);
	t.is(stderr.length, 1);

	// Check order
	t.true(stdout[0].includes('{"'), 'is JSON shape');
	t.deepEqual(JSON.parse(stdout[0]), {
		level: 'trace',
		message: 'Trace message',
		label: 'test:ava',
	});
	t.deepEqual(JSON.parse(stdout[1]), {
		level: 'debug',
		message: 'Debug message',
		label: 'test:ava',
	});
	t.deepEqual(JSON.parse(stdout[2]), {
		level: 'info',
		message: 'Info message',
		label: 'test:ava',
	});
	t.deepEqual(JSON.parse(stdout[3]), {
		level: 'warn',
		message: 'Warning message',
		label: 'test:ava',
	});
	t.deepEqual(JSON.parse(stderr[0]), {
		level: 'error',
		message: 'Error message',
		label: 'test:ava',
	});
	t.deepEqual(JSON.parse(stdout[4]), {
		meta: {
			method: 'GET',
			path: '/foo',
		},
		level: 'info',
		message: '(filter) Info message with filter',
		label: 'test:ava',
	});
	t.deepEqual(JSON.parse(stdout[5]), {
		meta: {
			method: 'GET',
			path: '/foo',
		},
		level: 'info',
		message: '(filter) Info message with filter and some context not override',
		label: 'test:ava',
		test: 1,
	});
	t.true(
		stdout[6].includes('It is recommended to use JSON format outside development environment'),
		`1 log found : the warning`,
	);
	t.true(stdout[7].includes('A message not in " JSON'), `1 log found : the printed message`);
	t.true(
		stdout[7].includes('test:ava:module2-not-json'),
		`1 log found : check the label test:ava:module2-not-json`,
	);

	process.env.NODE_ENV = initialNodeEnv;
});

test.serial('With no transport', async (t) => {
	const { stdout, stderr } = await mockAndCatchStd(() => {
		const log = src('test', { level: 'silent' });
		log.trace('Trace message');
		log.debug('Debug message');
		log.info('Info message');
		log.warn('Warning message');
		log.error('Error message');
	});

	// Check that logs are not written in std
	t.is(stdout.length, 0);
	t.is(stderr.length, 0);
});

test.serial('Stream property', async (t) => {
	const { stdout } = await mockAndCatchStd(() => {
		const log = src('stream', { formatJSON: true });
		t.truthy(log.stream);
		t.is<string, string>(typeof log.stream.write, 'function');
		log.stream.write('foo');
	});

	removeDatesInJSONLogs({ stdout });

	t.deepEqual(JSON.parse(stdout[0]), {
		level: 'info',
		message: 'foo',
		label: 'stream',
	});
});

test.serial('Log an error', async (t) => {
	const { stderr } = await mockAndCatchStd(() => {
		const log = src('test');

		log.error('Error message', new Error('something-went-wrong'));
	});
	removeDatesInJSONLogs({ stderr });

	const logLineParsed = JSON.parse(stderr[0]);
	logLineParsed.err.stack = logLineParsed.err.stack.substring(0, 27);
	t.deepEqual(logLineParsed, {
		err: {
			message: 'something-went-wrong',
			name: 'Error',
			stack: `Error: something-went-wrong`,
		},
		label: 'test',
		level: 'error',
		message: 'Error message',
	});
});

test.serial('Use a predefined filter', async (t) => {
	process.env.N9LOG = 'trace';
	const { stdout, stderr } = await mockAndCatchStd(() => {
		const log = src('test', {
			filters: [
				(logObject): object => ({
					message: `a message prefix ${logObject.message}`,
				}),
			],
		});
		log.trace('Trace message');
		log.addFilter(() => ({
			context: {
				meta: 'metadata',
			},
		}));
		log.trace('Trace message');
	});
	removeDatesInJSONLogs({ stdout, stderr });

	// Check that logs are written in the right std
	t.is(stdout.length, 2);
	t.is(stderr.length, 0);

	// Check order
	t.true(stdout[0].includes('{"'), 'is JSON shape');
	t.deepEqual(JSON.parse(stdout[0]), {
		level: 'trace',
		message: 'a message prefix Trace message',
		label: 'test',
	});
	t.is(stdout[0].match(/"message"/g).length, 1, 'one key message only');
	t.deepEqual(JSON.parse(stdout[1]), {
		level: 'trace',
		message: 'a message prefix Trace message',
		label: 'test',
		meta: 'metadata',
	});

	delete process.env.N9LOG;
});
