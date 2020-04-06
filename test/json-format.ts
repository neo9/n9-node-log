import ava from 'ava';
import { readFile } from 'fs-extra';
import * as nock from 'nock';
import * as stdMock from 'std-mocks';
import * as tmp from 'tmp-promise';

import src from '../src';

ava('Simple use case', (t) => {
	process.env.N9LOG = 'verbose';
	const log = src('test', {
		formatJSON: true,
	});
	stdMock.use();
	log.verbose('Verbose message');
	log.debug('Debug message');
	log.info('Info message');
	log.warn('Warning message');
	log.error('Error message');
	stdMock.restore();
	const output = stdMock.flush();
	// Check that logs are written in the right std
	t.is(output.stdout.length, 4);
	t.is(output.stderr.length, 1);
	// Check order
	t.true(
		output.stdout[0].includes('{"level":"verbose","message":"Verbose message","label":"test"'),
	);
	t.true(output.stdout[1].includes('{"level":"debug","message":"Debug message","label":"test"'));
	t.true(output.stdout[2].includes('{"level":"info","message":"Info message","label":"test"'));
	t.true(output.stdout[3].includes('{"level":"warn","message":"Warning message","label":"test"'));
	t.true(output.stderr[0].includes('{"level":"error","message":"Error message","label":"test"'));

	delete process.env.N9LOG;
});

ava('Profiling', (t) => {
	const log = src('test', { formatJSON: true });
	stdMock.use();
	log.profile('foo');
	log.profile('foo');
	stdMock.restore();
	const output = stdMock.flush();
	t.true(output.stdout[0].includes(',"level":"info","message":"foo","label":"test"'));
	t.true(output.stdout[0].includes('"durationMs":'));
});

ava('Simple use case with modules', (t) => {
	const log = src('test', { formatJSON: true, level: 'verbose' }).module('ava');
	stdMock.use();
	log.verbose('Verbose message');
	log.debug('Debug message');
	log.info('Info message');
	log.warn('Warning message');
	log.error('Error message');
	log.addFilter((level, msg, meta) => {
		return { msg: `(filter) ${msg}`, meta: { method: 'GET', path: '/foo' } };
	});
	log.info('Info message with filter');
	stdMock.restore();
	const output = stdMock.flush();
	// Check that logs are written in the right std
	t.is(output.stdout.length, 5);
	t.is(output.stderr.length, 1);
	// Check order
	t.true(
		output.stdout[0].includes('{"level":"verbose","message":"Verbose message","label":"test:ava"'),
	);
	t.true(
		output.stdout[1].includes('{"level":"debug","message":"Debug message","label":"test:ava"'),
	);
	t.true(output.stdout[2].includes('{"level":"info","message":"Info message","label":"test:ava"'));
	t.true(
		output.stdout[3].includes('{"level":"warn","message":"Warning message","label":"test:ava"'),
	);
	t.true(
		output.stderr[0].includes('{"level":"error","message":"Error message","label":"test:ava"'),
	);
	t.true(
		output.stdout[4].includes(
			'{"method":"GET","path":"/foo","level":"info","message":"(filter) Info message with filter","label":"test:ava"',
		),
	);
});

ava('With no transport', (t) => {
	const log = src('test', { console: false });
	stdMock.use();
	log.verbose('Verbose message');
	log.debug('Debug message');
	log.info('Info message');
	log.warn('Warning message');
	log.error('Error message');
	stdMock.restore();
	const output = stdMock.flush();
	// Check that logs are not written in std
	t.is(output.stdout.length, 0);
	t.is(output.stderr.length, 0);
});

ava('File transport', async (t) => {
	const file = await tmp.file();
	const log = src('test', {
		level: 'verbose',
		console: false,
		formatJSON: true,
		files: [
			{
				filename: file.path,
			},
		],
	});
	log.verbose('Verbose message');
	log.debug('Debug message');
	log.info('Info message');
	log.warn('Warning message');
	log.error('Error message');
	await new Promise((resolve) => setTimeout(resolve, 1000));
	const output = await readFile(file.path, 'utf-8');
	const lines = output.split('\n');
	t.is(lines.length, 6); // count last empty line
	// Check info log
	const traceLog = JSON.parse(lines[0]);
	t.is(traceLog.level, 'verbose');
	t.is(traceLog.message, 'Verbose message');
	t.true(!!traceLog.timestamp);
	// Check info log
	const debugLog = JSON.parse(lines[1]);
	t.is(debugLog.level, 'debug');
	t.is(debugLog.message, 'Debug message');
	t.true(!!debugLog.timestamp);
	// Check info log
	const infoLog = JSON.parse(lines[2]);
	t.is(infoLog.level, 'info');
	t.is(infoLog.message, 'Info message');
	t.true(!!infoLog.timestamp);
	// Check warn log
	const warnLog = JSON.parse(lines[3]);
	t.is(warnLog.level, 'warn');
	t.is(warnLog.message, 'Warning message');
	t.true(!!warnLog.timestamp);
	// Check error log
	const errorLog = JSON.parse(lines[4]);
	t.is(errorLog.level, 'error');
	t.is(errorLog.message, 'Error message');
	t.true(!!errorLog.timestamp);
});

ava('Stream property', async (t) => {
	const log = src('stream', { formatJSON: true });
	stdMock.use();
	t.truthy(log.stream);
	t.is(typeof log.stream.write, 'function');
	log.stream.write('foo');
	stdMock.restore();
	const output = stdMock.flush();
	t.true(output.stdout[0].includes('level":"info","message":"foo","label":"stream"'));
});

ava('Http transport', async (t) => {
	const URL = 'http://localhost:1234';
	const PATH = '/log';
	const log = src('test', {
		console: false,
		formatJSON: true,
		http: [
			{
				port: 1234,
				path: PATH,
			},
		],
	});
	const scope = nock(URL).post(PATH).reply(200);
	log.info('Info message');
	t.pass();
});
