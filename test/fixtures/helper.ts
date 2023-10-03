import * as stdMocks from 'std-mocks';

interface CatchStdLogReturn<T> {
	stdout: string[];
	stderr: string[];
	stdLength: number;
	error?: unknown;
	result: T;
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

export async function mockAndCatchStd<T>(fn: () => Promise<T> | T): Promise<CatchStdLogReturn<T>> {
	stdMocks.use({ print });
	let error: unknown;
	let result: T;
	try {
		result = await fn();
	} catch (e) {
		error = e;
	}
	const flushResult = stdMocks.flush();
	stdMocks.restore();

	const stdout = flushResult.stdout.flatMap((value) => {
		if (value.match(/^[^\n]+\n$/g)) return value.replace('\n', '');
		return value.split('\n');
	});
	const stderr = flushResult.stderr.flatMap((value) => {
		if (value.match(/^[^\n]+\n$/g)) return value.replace('\n', '');
		return value.split('\n');
	});

	const stdLength = stdout.length + stderr.length;
	return { stdout, stderr, stdLength, error, result };
}
