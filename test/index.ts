import test from 'ava'
import * as stdMock from 'std-mocks'
import * as tmp from 'tmp-promise'
import * as nock from 'nock'
import { readFile } from 'fs-extra'

import N9Log from '../src'

test('Simple use case', (t) => {
	const log = new N9Log('test')
	stdMock.use()
	log.info('Info message')
	log.warn('Warning message')
	log.error('Error message')
	stdMock.restore()
	const output = stdMock.flush()
	// Check that logs are written in the right std
	t.is(output.stdout.length, 2)
	t.is(output.stderr.length, 1)
	// Check order
	t.true(output.stdout[0].includes('[test] Info message'))
	t.true(output.stdout[1].includes('[test] Warning message'))
	t.true(output.stderr[0].includes('[test] Error message'))
})

test('Simple use case with modules', (t) => {
	const log = new N9Log('test').module('ava')
	stdMock.use()
	log.info('Info message')
	log.warn('Warning message')
	log.error('Error message')
	stdMock.restore()
	const output = stdMock.flush()
	// Check that logs are written in the right std
	t.is(output.stdout.length, 2)
	t.is(output.stderr.length, 1)
	// Check order
	t.true(output.stdout[0].includes('[test:ava] Info message'))
	t.true(output.stdout[1].includes('[test:ava] Warning message'))
	t.true(output.stderr[0].includes('[test:ava] Error message'))
})


test('With no transport', (t) => {
	const log = new N9Log('test', { console: false })
	stdMock.use()
	log.info('Info message')
	log.warn('Warning message')
	log.error('Error message')
	stdMock.restore()
	const output = stdMock.flush()
	// Check that logs are not written in std
	t.is(output.stdout.length, 0)
	t.is(output.stderr.length, 0)
})

test('File transport', async (t) => {
	const file = await tmp.file()
	const log = new N9Log('test', {
		console: false,
		files: [{
			filename: file.path
		}]
	})
	log.info('Info message')
	log.warn('Warning message')
	log.error('Error message')
	const output = await readFile(file.path, 'utf-8')
	const lines = output.split('\n')
	t.is(lines.length, 4) // count last empty line
	// Check info log
	const infoLog = JSON.parse(lines[0])
	t.is(infoLog.level, 'info')
	t.is(infoLog.message, 'Info message')
	t.true(!!infoLog.timestamp)
	// Check warn log
	const warnLog = JSON.parse(lines[1])
	t.is(warnLog.level, 'warn')
	t.is(warnLog.message, 'Warning message')
	t.true(!!warnLog.timestamp)
	// Check error log
	const errorLog = JSON.parse(lines[2])
	t.is(errorLog.level, 'error')
	t.is(errorLog.message, 'Error message')
	t.true(!!errorLog.timestamp)
})

test('Http transport', async (t) => {
	const URL = 'http://localhost:1234'
	const PATH = '/log'
	const log = new N9Log('test', {
		console: false,
		http: [{
			port: 1234,
			path: PATH
		}]
	})
	const scope = nock(URL).post(PATH).reply(200)
	log.info('Info message')
	t.pass()
})
