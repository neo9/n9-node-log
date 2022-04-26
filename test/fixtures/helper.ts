import * as fs from 'fs-extra';

export const print = true;

export function removeDatesInJSONLogs(logs: { stdout: string[]; stderr: string[] }): {
	stdout: string[];
	stderr: string[];
} {
	const iso8601Regexp = /,"time":"\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?"/;
	return {
		stdout: logs.stdout.map((line) => line.replace(iso8601Regexp, '')),
		stderr: logs.stderr.map((line) => line.replace(iso8601Regexp, '')),
	};
}

export async function waitFor(durationMs: number = 2_000): Promise<void> {
	return await new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, durationMs);
	});
}

export async function getLogsFromFile(filePath: string): Promise<string[]> {
	process.stdout.write(`Waiting for logs to be treated ...\n`);
	await waitFor();

	const output = (await fs.readFile(filePath))
		.toString()
		.split('\n')
		.filter((line) => !!line);

	if (print) {
		for (const outputLine of output) {
			process.stdout.write(`${outputLine}\n`);
		}
	}

	return output;
}
