import * as chalk from 'chalk';
import { fastISOString } from 'fast-iso-string';
import fastSafeStringify from 'fast-safe-stringify';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace N9Log {
	export type Level = 'silent' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
	export type OptionsParamsForFilter = Omit<N9Log.Options, 'filters'>;
	export interface FilterParameter {
		message: string;
		context: object;
		options: OptionsParamsForFilter;
	}

	export type Filter = (filterParameter: FilterParameter) => {
		message?: string;
		context?: object;
	};

	export interface Options {
		level?: Level; // default : info
		formatJSON?: boolean; // default : true
		filters?: Filter[]; // default: undefined
	}
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export class N9Log {
	public stream: { write: (message: string) => void };

	public readonly name: string;
	// eslint-disable-next-line no-use-before-define
	public readonly level: N9Log.Level;
	// eslint-disable-next-line no-use-before-define
	private readonly options: N9Log.Options;
	// eslint-disable-next-line no-use-before-define
	private isLevelEnabledCache: Partial<Record<N9Log.Level, boolean>>;
	private profilers: Record<string, number> = {};

	constructor(name: string, options?: N9Log.Options, parentLogger?: N9Log) {
		this.options = options || parentLogger?.options || {};
		// Options
		this.name = name;
		// tslint:disable-next-line:no-console
		this.level = (process.env.N9LOG as N9Log.Level) || this.options.level || 'info';
		this.initIsLevelEnabledCache();
		this.options.formatJSON =
			typeof this.options.formatJSON === 'boolean' ? this.options.formatJSON : true;
		this.initLogger();
	}

	get formatJSON(): boolean {
		return this.options.formatJSON;
	}

	public module(name: string, options?: N9Log.Options): N9Log {
		if (options) {
			return new N9Log(`${this.name}:${name}`, options);
		}
		return new N9Log(`${this.name}:${name}`, undefined, this);
	}

	public isLevelEnabled(level: N9Log.Level): boolean {
		return this.isLevelEnabledCache[level];
	}

	/**
	 * Tracks the time inbetween subsequent calls to this method with the same
	 * `id` parameter. The second call to this method will log the difference in
	 * milliseconds along with the message.
	 *
	 * @param id Unique id of the profiler
	 * @param message Message to print at the end
	 * @param meta Context to add to the log
	 */
	public profile(id: string, message: string = id, meta?: object): void {
		const time = Date.now();
		if (this.profilers[id]) {
			const timeEnd = this.profilers[id];
			delete this.profilers[id];
			this.info(message, { ...meta, durationMs: time - timeEnd });
		} else {
			this.profilers[id] = time;
		}
	}

	public error(message: string, context?: object): void {
		this.print('error', message, context);
	}
	public warn(message: string, context?: object): void {
		this.print('warn', message, context);
	}
	public info(message: string, context?: object): void {
		this.print('info', message, context);
	}
	public debug(message: string, context?: object): void {
		this.print('debug', message, context);
	}
	public trace(message: string, context?: object): void {
		this.print('trace', message, context);
	}

	public addFilter(filter: N9Log.Filter): void {
		if (!this.options.filters) this.options.filters = [];
		this.options.filters.push(filter);
	}

	private initLogger(): void {
		// Logger
		if (
			!this.options.formatJSON &&
			process.env.NODE_ENV &&
			!['development', 'test'].includes(process.env.NODE_ENV)
		) {
			this.print('warn', `It is recommended to use JSON format outside development environment`);
		}
		// Add stream for morgan middleware
		this.stream = {
			write: (message) => this.info(message.replace(/\n$/, '')), // remove \n added by morgan at the end
		};
	}

	private initIsLevelEnabledCache(): void {
		this.isLevelEnabledCache = {};
		for (const level of ['silent', 'error', 'warn', 'info', 'debug', 'trace'] as N9Log.Level[]) {
			switch (level) {
				case 'silent':
					this.isLevelEnabledCache[level] = false;
					continue;
				case 'error':
					this.isLevelEnabledCache[level] = ['error', 'warn', 'info', 'debug', 'trace'].includes(
						this.level,
					);
					continue;
				case 'warn':
					this.isLevelEnabledCache[level] = ['warn', 'info', 'debug', 'trace'].includes(this.level);
					continue;
				case 'info':
					this.isLevelEnabledCache[level] = ['info', 'debug', 'trace'].includes(this.level);
					continue;
				case 'debug':
					this.isLevelEnabledCache[level] = ['debug', 'trace'].includes(this.level);
					continue;
				case 'trace':
				default:
					this.isLevelEnabledCache[level] = ['trace'].includes(this.level);
			}
		}
	}

	private print(level: N9Log.Level, message: string, context?: object): void {
		if (this.isLevelEnabled(level)) {
			const stream = this.getStreamOutputFromLevel(level);
			stream.write(this.getOutputLine(level, message, context));
		}
	}

	private getStreamOutputFromLevel(level: N9Log.Level): NodeJS.WriteStream {
		switch (level) {
			case 'error':
				return process.stderr;
			case 'silent':
			case 'warn':
			case 'info':
			case 'debug':
			case 'trace':
			default:
				return process.stdout;
		}
	}

	private getOutputLine(level: N9Log.Level, message: string, context: object): string {
		let outputMessage = message;
		let outputContext = context instanceof Error ? { err: context } : context;

		if (this.options.filters) {
			for (const filter of this.options.filters) {
				const filterResult = filter({
					message: outputMessage,
					context: outputContext,
					options: {
						level: this.options.level,
						formatJSON: this.options.formatJSON,
					},
				});
				if (filterResult) {
					outputMessage = filterResult.message ? filterResult.message : outputMessage;
					outputContext = filterResult.context ?? outputContext;
				}
			}
		}
		if (this.formatJSON) {
			return `${fastSafeStringify({
				...this.jsonify(outputContext),
				level,
				timestamp: fastISOString(),
				label: this.name,
				message: outputMessage,
			})}\n`;
			// {"level":"warn","timestamp":"2023-10-02T12:36:15.480Z","label":"mongo","label":"mongo:mongo","argString":"{\"topologyId\":3}"}
		}
		const contextAsString = outputContext
			? `\n${fastSafeStringify(this.jsonify(outputContext), null, 2).replace(/\\n/g, '\n')}`
			: '';

		return [
			fastISOString(),
			' - ',
			this.getLevelColored(level),
			' : [',
			this.name,
			'] ',
			outputMessage,
			contextAsString,
			'\n',
		].join('');
		// 2023-10-02T10:56:26.444Z - info : [catalogue-scheduler-api:amqp] Connected to amqp server amqp://rabbitmq {"url":"amqp://rabbitmq"}
	}

	private getLevelColored(level: Omit<N9Log.Level, 'silent'>): string {
		switch (level) {
			case 'error':
				return chalk.red(level);
			case 'warn':
				return chalk.yellow(level);
			case 'info':
				return chalk.blue(level);
			case 'debug':
				return chalk.green(level);
			case 'trace':
			default:
				return chalk.bold(level);
		}
	}

	// inspired from https://github.com/dial-once/node-logtify/blob/23e2b41e5218bb0aaead92120cd655a455717e92/src/modules/message.js#L5
	private jsonify(obj: any): any {
		if (!obj || ['string', 'number'].includes(typeof obj)) return obj;

		if (Array.isArray(obj)) {
			const array = [];
			for (const item of obj) {
				array.push(this.jsonify(item));
			}
			return array;
		}

		if (obj instanceof Error) {
			return {
				name: obj.name,
				message: obj.message,
				stack: obj.stack,
			};
		}

		if (obj instanceof Date) {
			return obj;
		}

		const object = {};
		for (const [key, value] of Object.entries(obj)) {
			object[key] = this.jsonify(value);
		}
		return object;
	}
}

export default (name: string, options?: N9Log.Options): N9Log => new N9Log(name, options);
