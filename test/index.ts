import ava from 'ava';
import * as tmp from 'tmp-promise';

import src, { N9Log } from '../src';
import { getLogsFromFile } from './fixtures/helper';

ava.beforeEach(() => {
	process.env.NODE_ENV = 'development';
});

ava('Simple use case', async (t) => {
	process.env.N9LOG = 'trace';
	const file = await tmp.file();
	const log = src('test', { formatJSON: false, developmentOutputFilePath: file.path });
	log.trace('Trace message');
	log.debug('Debug message');
	log.info('Info message');
	log.warn('Warning message');
	log.error('Error message');

	const output = await getLogsFromFile(file.path);

	t.is(output.length, 5);
	// Check order
	t.true(output[0].includes('[test] Trace message'));
	t.true(output[1].includes('[test] Debug message'));
	t.true(output[2].includes('[test] Info message'));
	t.true(output[3].includes('[test] Warning message'));
	t.true(output[4].includes('[test] Error message'));
	t.true(log.isLevelEnabled('trace'));
	t.true(log.isLevelEnabled('debug'));
	t.true(log.isLevelEnabled('info'));
	t.true(log.isLevelEnabled('warn'));
	t.true(log.isLevelEnabled('error'));
	delete process.env.N9LOG;
});

ava('Check getters', (t) => {
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

ava('Profiling', async (t) => {
	const file = await tmp.file();
	const log = src('test', { formatJSON: false, developmentOutputFilePath: file.path });

	log.profile('foo');
	log.profile('foo');

	const output = await getLogsFromFile(file.path);

	t.true(output[0].includes('[test] foo {"durationMs":'));

	t.false(log.isLevelEnabled('trace')); // default level is info
	t.false(log.isLevelEnabled('debug')); // default level is info
	t.true(log.isLevelEnabled('info'));
	t.true(log.isLevelEnabled('warn'));
	t.true(log.isLevelEnabled('error'));
});

ava('Simple use case with modules', async (t) => {
	const file = await tmp.file();
	const log = src('test', {
		formatJSON: false,
		level: 'trace',
		developmentOutputFilePath: file.path,
	}).module('ava');

	log.trace('Trace message');
	log.debug('Debug message');
	log.info('Info message');
	log.warn('Warning message');
	log.error('Error message');

	const output = await getLogsFromFile(file.path);

	t.is(output.length, 5);
	// Check order
	t.true(output[0].includes('[test:ava] Trace message'));
	t.true(output[1].includes('[test:ava] Debug message'));
	t.true(output[2].includes('[test:ava] Info message'));
	t.true(output[3].includes('[test:ava] Warning message'));
	t.true(output[4].includes('[test:ava] Error message'));
});

ava('With no transport', async (t) => {
	const file = await tmp.file();
	const log = src('test', {
		formatJSON: false,
		console: false,
		developmentOutputFilePath: file.path,
	});
	log.trace('Trace message');
	log.debug('Debug message');
	log.info('Info message');
	log.warn('Warning message');
	log.error('Error message');
	const output = await getLogsFromFile(file.path, true);
	// Check that logs are not written
	t.is(output.length, 0);
});

ava('Stream property', async (t) => {
	const file = await tmp.file();
	const log = src('stream', { formatJSON: false, developmentOutputFilePath: file.path });

	t.truthy(log.stream);
	t.is<string, string>(typeof log.stream.write, 'function');
	log.stream.write('foo');

	const output = await getLogsFromFile(file.path);
	t.true(output[0].includes('[stream] foo'));
});

ava('Log an error', async (t) => {
	process.env.N9LOG = 'trace';
	const file = await tmp.file();
	const log = src('test', { formatJSON: false, developmentOutputFilePath: file.path });
	log.error('Error message', new Error('something-went-wrong'));

	const output = await getLogsFromFile(file.path);

	t.is(output.length, 8);
	// Check order
	t.true(output[0].includes('[test] Error message'));
	t.true(output[1].includes('err: {'));
	t.true(output[2].includes('"type": "Error",'));
	t.true(output[3].includes('"message": "something-went-wrong",'));
	t.true(output[4].includes('"stack":'));
	t.true(output[5].includes('Error: something-went-wrong'));
	t.true(output[6].includes('at '));
	delete process.env.N9LOG;
});

ava('Log a warning outside dev', async (t) => {
	process.env.NODE_ENV = 'production';
	const file = await tmp.file();
	src('test', { formatJSON: false, developmentOutputFilePath: file.path });

	const output = await getLogsFromFile(file.path);

	t.is(output.length, 1);
	t.true(
		output[0].includes(
			'[test] It is recommended to use JSON format outside development environment',
		),
	);
	delete process.env.N9LOG;
});

ava('Create many modules, should avoid error "Out of memory: wasm memory"', async (t) => {
	const file = await tmp.file();
	const log = src('test', { formatJSON: false, developmentOutputFilePath: file.path });
	log.info('Simple message 1');
	let lastModule: N9Log;
	const nbModules = 100;
	for (let i = 0; i < nbModules; i += 1) {
		lastModule = log.module(`sub-module-${i}`);
	}
	lastModule.info('Simple message 2');

	const output = await getLogsFromFile(file.path);
	t.is(output.length, 2);
	t.true(output[0].includes('[test] Simple message 1'));
	t.true(output[1].includes(`[test:sub-module-${nbModules - 1}] Simple message 2`));
});
