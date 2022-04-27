import ava from 'ava';
import * as stdMock from 'std-mocks';

import src from '../src';
import { print, removeDatesInJSONLogs } from './fixtures/helper';

ava('Simple use case', (t) => {
	process.env.N9LOG = 'trace';
	const log = src('test');
	stdMock.use({ print });
	log.trace('Trace message');
	log.debug('Debug message');
	log.info('Info message');
	log.warn('Warning message');
	log.error('Error message');
	stdMock.restore();
	const output = removeDatesInJSONLogs(stdMock.flush());

	// Check that logs are written in the right std
	t.is(output.stdout.length, 4);
	t.is(output.stderr.length, 1);

	// Check order
	t.true(output.stdout[0].includes('{"'), 'is JSON shape');
	t.deepEqual(JSON.parse(output.stdout[0]), {
		level: 'trace',
		message: 'Trace message',
		label: 'test',
	});
	t.deepEqual(JSON.parse(output.stdout[1]), {
		level: 'debug',
		message: 'Debug message',
		label: 'test',
	});
	t.deepEqual(JSON.parse(output.stdout[2]), {
		level: 'info',
		message: 'Info message',
		label: 'test',
	});
	t.deepEqual(JSON.parse(output.stdout[3]), {
		level: 'warn',
		message: 'Warning message',
		label: 'test',
	});
	t.deepEqual(JSON.parse(output.stderr[0]), {
		level: 'error',
		message: 'Error message',
		label: 'test',
	});

	delete process.env.N9LOG;
});

ava('Print context object', (t) => {
	process.env.N9LOG = 'trace';
	const log = src('test');
	stdMock.use({ print });
	log.trace('Trace message', { contextValue: 'a value' });
	log.debug('Debug message', { contextValue: 'a value' });
	log.info('Info message', { contextValue: 'a value' });
	log.warn('Warning message', { contextValue: 'a value' });
	log.error('Error message', { contextValue: 'a value' });
	stdMock.restore();
	const output = removeDatesInJSONLogs(stdMock.flush());

	// Check that logs are written in the right std
	t.is(output.stdout.length, 4);
	t.is(output.stderr.length, 1);

	// Check order
	t.true(output.stdout[0].includes('{"'), 'is JSON shape');
	t.deepEqual(JSON.parse(output.stdout[0]), {
		level: 'trace',
		message: 'Trace message',
		label: 'test',
		contextValue: 'a value',
	});
	t.deepEqual(JSON.parse(output.stdout[1]), {
		level: 'debug',
		message: 'Debug message',
		label: 'test',
		contextValue: 'a value',
	});
	t.deepEqual(JSON.parse(output.stdout[2]), {
		level: 'info',
		message: 'Info message',
		label: 'test',
		contextValue: 'a value',
	});
	t.deepEqual(JSON.parse(output.stdout[3]), {
		level: 'warn',
		message: 'Warning message',
		label: 'test',
		contextValue: 'a value',
	});
	t.deepEqual(JSON.parse(output.stderr[0]), {
		level: 'error',
		message: 'Error message',
		label: 'test',
		contextValue: 'a value',
	});

	delete process.env.N9LOG;
});

ava('Profiling', (t) => {
	const log = src('test', { formatJSON: true });
	stdMock.use();
	log.profile('foo');
	log.profile('foo');
	stdMock.restore();
	const output = removeDatesInJSONLogs(stdMock.flush());
	const line0 = JSON.parse(output.stdout[0]);
	delete line0.durationMs;
	t.deepEqual(line0, {
		level: 'info',
		message: 'foo',
		label: 'test',
	});
	t.true(output.stdout[0].includes('"durationMs":'));
});

ava('Simple use case with modules', (t) => {
	const log = src('test', { formatJSON: true, level: 'trace' }).module('ava');
	stdMock.use({ print });
	log.trace('Trace message');
	log.debug('Debug message');
	log.info('Info message');
	log.warn('Warning message');
	log.error('Error message');
	// log.addFilter((level, msg) => ({
	// 	msg: `(filter) ${msg}`,
	// 	meta: { method: 'GET', path: '/foo' },
	// }));
	// log.info('Info message with filter');
	stdMock.restore();
	const output = removeDatesInJSONLogs(stdMock.flush());

	// Check that logs are written in the right std
	t.is(output.stdout.length, 4);
	t.is(output.stderr.length, 1);

	// Check order
	t.true(output.stdout[0].includes('{"'), 'is JSON shape');
	t.deepEqual(JSON.parse(output.stdout[0]), {
		level: 'trace',
		message: 'Trace message',
		label: 'test:ava',
	});
	t.deepEqual(JSON.parse(output.stdout[1]), {
		level: 'debug',
		message: 'Debug message',
		label: 'test:ava',
	});
	t.deepEqual(JSON.parse(output.stdout[2]), {
		level: 'info',
		message: 'Info message',
		label: 'test:ava',
	});
	t.deepEqual(JSON.parse(output.stdout[3]), {
		level: 'warn',
		message: 'Warning message',
		label: 'test:ava',
	});
	t.deepEqual(JSON.parse(output.stderr[0]), {
		level: 'error',
		message: 'Error message',
		label: 'test:ava',
	});
	// t.true(
	// 	output.stdout[4].includes(
	// 		'{"method":"GET","path":"/foo","level":"info","message":"(filter) Info message with filter","label":"test:ava"',
	// 	),
	// );
});

ava('With no transport', (t) => {
	const log = src('test', { console: false });
	stdMock.use({ print });
	log.trace('Trace message');
	log.debug('Debug message');
	log.info('Info message');
	log.warn('Warning message');
	log.error('Error message');
	stdMock.restore();
	const output = removeDatesInJSONLogs(stdMock.flush());

	// Check that logs are not written in std
	t.is(output.stdout.length, 0);
	t.is(output.stderr.length, 0);
});

ava('Stream property', (t) => {
	const log = src('stream', { formatJSON: true });
	stdMock.use({ print });
	t.truthy(log.stream);
	t.is<string, string>(typeof log.stream.write, 'function');
	log.stream.write('foo');
	stdMock.restore();
	const output = removeDatesInJSONLogs(stdMock.flush());

	t.deepEqual(JSON.parse(output.stdout[0]), {
		level: 'info',
		message: 'foo',
		label: 'stream',
	});
});
