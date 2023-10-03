import test from 'ava';

import src, { N9Log } from '../src';
import { mockAndCatchStd } from './fixtures/helper';

test.beforeEach(() => {
	process.env.NODE_ENV = 'development';
});

test.serial('Simple use case', async (t) => {
	process.env.N9LOG = 'trace';
	const { stdout, stderr, stdLength, result } = await mockAndCatchStd(() => {
		const log = src('test', { formatJSON: false });
		log.trace('Trace message');
		log.debug('Debug message');
		log.info('Info message');
		log.warn('Warning message');
		log.error('Error message');
		return log;
	});

	t.is(stdLength, 5);
	// Check order
	t.true(stdout[0].includes('[test] Trace message'));
	t.true(stdout[0].endsWith('[test] Trace message')); // not trailing space
	t.true(stdout[1].includes('[test] Debug message'));
	t.true(stdout[2].includes('[test] Info message'));
	t.true(stdout[3].includes('[test] Warning message'));
	t.true(stderr[0].includes('[test] Error message'));
	t.true(result.isLevelEnabled('trace'));
	t.true(result.isLevelEnabled('debug'));
	t.true(result.isLevelEnabled('info'));
	t.true(result.isLevelEnabled('warn'));
	t.true(result.isLevelEnabled('error'));
	delete process.env.N9LOG;
});

test.serial('Check getters', (t) => {
	process.env.N9LOG = 'trace';
	const log = src('test', { formatJSON: false });
	t.is(log.name, 'test', 'Getter name return the name');
	t.is(log.level, 'trace', 'Getter level return the level');
	t.is(log.formatJSON, false, 'Getter formatJSON return the formatJSON enabled or not');
	delete process.env.N9LOG;

	const log2 = src('test-2', { formatJSON: true, level: 'debug' });
	t.is(log2.name, 'test-2', 'Getter name return the name test-2');
	t.is(log2.level, 'debug', 'Getter level return the level default debug');
	t.is(log2.formatJSON, true, 'Getter formatJSON return the formatJSON enabled or not : true');

	const subLogger = log2.module('module-1');
	t.is(subLogger.name, 'test-2:module-1', 'Should sub logger name be ');
});

test.serial('Profiling', async (t) => {
	const { stdout, result } = await mockAndCatchStd(() => {
		const log = src('test', { formatJSON: false });

		log.profile('foo');
		log.profile('foo');
		return log;
	});

	t.true(stdout[0].includes('[test] foo'));
	t.true(stdout[1].includes('{'));
	t.true(stdout[2].includes('"durationMs":'));
	t.true(stdout[3].includes('}'));

	t.false(result.isLevelEnabled('trace')); // default level is info
	t.false(result.isLevelEnabled('debug')); // default level is info
	t.true(result.isLevelEnabled('info'));
	t.true(result.isLevelEnabled('warn'));
	t.true(result.isLevelEnabled('error'));
});

test.serial('Simple use case with modules', async (t) => {
	const { stdout, stderr, stdLength } = await mockAndCatchStd(() => {
		const log = src('test', {
			formatJSON: false,
			level: 'trace',
		}).module('ava');

		log.trace('Trace message');
		log.debug('Debug message');
		log.info('Info message');
		log.warn('Warning message');
		log.error('Error message');
	});

	t.is(stdLength, 5);
	// Check order
	t.true(stdout[0].includes('[test:ava] Trace message'));
	t.true(stdout[1].includes('[test:ava] Debug message'));
	t.true(stdout[2].includes('[test:ava] Info message'));
	t.true(stdout[3].includes('[test:ava] Warning message'));
	t.true(stderr[0].includes('[test:ava] Error message'));
});

test.serial('With no transport', async (t) => {
	const { stdout } = await mockAndCatchStd(() => {
		const log = src('test', {
			formatJSON: false,
			level: 'silent',
		});
		log.trace('Trace message');
		log.debug('Debug message');
		log.info('Info message');
		log.warn('Warning message');
		log.error('Error message');
	});
	// Check that logs are not written
	t.is(stdout.length, 0);
});

test.serial('Stream property', async (t) => {
	const { stdout } = await mockAndCatchStd(() => {
		const log = src('stream', { formatJSON: false });

		t.truthy(log.stream);
		t.is<string, string>(typeof log.stream.write, 'function');
		log.stream.write('foo');
	});

	t.true(stdout[0].includes('[stream] foo'));
});

test.serial('Log an error', async (t) => {
	process.env.N9LOG = 'trace';
	const { stderr, stdLength } = await mockAndCatchStd(() => {
		const log = src('test', { formatJSON: false });
		log.error('Error message', new Error('something-went-wrong'));
	});
	t.true(stdLength > 12, 'Stack trace is preinted'); // stack trace change sometimes in the ava part

	// Check order
	t.true(stderr[0].includes('[test] Error message'));
	t.true(stderr[1].includes('{'));
	t.true(stderr[2].includes(' "err": {'));
	t.true(stderr[3].includes('"name": "Error",'));
	t.true(stderr[4].includes('"message": "something-went-wrong",'));
	t.true(stderr[5].includes('"stack": "Error: something-went-wrong'));
	t.true(stderr[7].includes('  at '));
	t.true(stderr[8].includes('  at '));
	t.true(stderr[9].includes('  at '));
	t.true(stderr[10].includes('  at '));
	t.true(stderr[11].includes('  at '));
	delete process.env.N9LOG;
});

test.serial('Log a warning outside dev', async (t) => {
	process.env.NODE_ENV = 'production';
	const { stdout, stdLength } = await mockAndCatchStd(() => {
		src('test', { formatJSON: false });
	});

	t.is(stdLength, 1);
	t.true(
		stdout[0].includes(
			'[test] It is recommended to use JSON format outside development environment',
		),
	);
	delete process.env.N9LOG;
});

test.serial('Create many modules, should avoid error "Out of memory: wasm memory"', async (t) => {
	const nbModules = 100;
	const { stdout, stdLength } = await mockAndCatchStd(() => {
		const log = src('test', { formatJSON: false });
		log.info('Simple message 1');
		let lastModule: N9Log;
		for (let i = 0; i < nbModules; i += 1) {
			lastModule = log.module(`sub-module-${i}`);
		}
		lastModule.info('Simple message 2');
	});

	t.is(stdLength, 2);
	t.true(stdout[0].includes('[test] Simple message 1'));
	t.true(stdout[1].includes(`[test:sub-module-${nbModules - 1}] Simple message 2`));
});

test.serial('Print with wrong level', async (t) => {
	process.env.N9LOG = 'trace';
	const { stdLength, result } = await mockAndCatchStd(() => {
		const log = src('test', { formatJSON: false });
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		log.print('wrong-level', 'my message');
		return log;
	});

	t.is(stdLength, 0); // level unknown so it is not enabled

	t.is(
		result
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			.getLevelColored('wrong-level')
			// eslint-disable-next-line no-control-regex
			.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''),
		'wrong-level',
		'Check unknown level case',
	);

	t.true(
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		process.stdout === result.getStreamOutputFromLevel('wrong-level'),
		'Check getStreamOutputFromLevel with wrong-level',
	);

	t.true(
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		process.stdout === result.getStreamOutputFromLevel('silent'),
		'Check getStreamOutputFromLevel with silent',
	);

	delete process.env.N9LOG;
});
