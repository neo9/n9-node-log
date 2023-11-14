import * as StdMocks from 'std-mocks';

import { removeColors } from '../../src';

interface CatchStdLogReturn<T> {
	stdout: string[];
	stderr: string[];
	stdLength: number;
	error?: unknown;
	result: T;
}
export interface MockAndCatchStdOptions {
	throwError: boolean;
}

export const print = true;

export function removeDatesInJSONLogs(logs: { stdout?: string[]; stderr?: string[] }): void {
	const iso8601Regexp = /,"timestamp":"\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?"/;
	if (logs.stdout) {
		for (let i = 0; i < logs.stdout.length; i += 1) {
			logs.stdout[i] = logs.stdout[i].replace(iso8601Regexp, '');
		}
	}
	if (logs.stderr) {
		for (let i = 0; i < logs.stderr.length; i += 1) {
			logs.stderr[i] = logs.stderr[i].replace(iso8601Regexp, '');
		}
	}
}

export async function mockAndCatchStd<T>(
	fn: () => Promise<T> | T,
	options?: MockAndCatchStdOptions,
): Promise<CatchStdLogReturn<T>> {
	StdMocks.use({ print });
	let error: unknown;
	let result: T;
	try {
		result = await fn();
	} catch (e) {
		error = e;

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
		if (options?.throwError !== false) {
			throw error;
		}
	}
	const flushResult = StdMocks.flush();
	StdMocks.restore();

	const stdout = flushResult.stdout
		.flatMap((value) => {
			if (value.endsWith('\n')) return value.slice(0, -1).split('\n');
			return value.split('\n');
		})
		.map((line) => removeColors(line));
	const stderr = flushResult.stderr
		.flatMap((value) => {
			if (value.endsWith('\n')) return value.slice(0, -1).split('\n');
			return value.split('\n');
		})
		.map((line) => removeColors(line));

	const stdLength = stdout.length + stderr.length;
	return { stdout, stderr, stdLength, error, result };
}
