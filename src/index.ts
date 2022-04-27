import { pino } from 'pino';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace N9Log {
	export type Level = 'silent' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
	export type Filter = (logObject: object & { message: string; level: string }) => object;

	export interface Options {
		level?: Level;
		console?: boolean;
		formatJSON?: boolean;
		developmentOutputFilePath?: string;
		filters?: Filter[];
	}
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export class N9Log {
	public stream: { write: (message: string) => void };

	private readonly name: string;
	// eslint-disable-next-line no-use-before-define
	private readonly level: N9Log.Level;
	// eslint-disable-next-line no-use-before-define
	private readonly options: N9Log.Options;
	private log: pino.Logger;
	// eslint-disable-next-line no-use-before-define
	private isLevelEnabledCache: Partial<Record<N9Log.Level, boolean>>;
	private profilers: Record<string, number> = {};

	constructor(name: string, options?: N9Log.Options) {
		this.options = options || {};
		// Options
		this.name = name;
		// tslint:disable-next-line:no-console
		this.level = (process.env.N9LOG as N9Log.Level) || this.options.level || 'info';
		this.options.console = typeof this.options.console === 'boolean' ? this.options.console : true;
		if (!this.options.console) {
			this.level = 'silent';
		}
		this.initIsLevelEnabledCache();
		this.options.formatJSON =
			typeof this.options.formatJSON === 'boolean' ? this.options.formatJSON : true;
		this.initLogger();
	}

	public module(name: string, options?: N9Log.Options): N9Log {
		return new N9Log(`${this.name}:${name}`, options || this.options);
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
		this.log.error(context, message);
	}
	public warn(message: string, context?: object): void {
		this.log.warn(context, message);
	}
	public info(message: string, context?: object): void {
		this.log.info(context, message);
	}
	public debug(message: string, context?: object): void {
		this.log.debug(context, message);
	}
	public trace(message: string, context?: object): void {
		this.log.trace(context, message);
	}

	public addFilter(filter: N9Log.Filter): void {
		if (!this.options.filters) this.options.filters = [];
		this.options.filters.push(filter);
	}

	private initLogger(): void {
		// Logger
		this.log = this.createLogger();
		if (
			!this.options.formatJSON &&
			process.env.NODE_ENV &&
			process.env.NODE_ENV !== 'development'
		) {
			this.log.warn(`It is recommended to use JSON format outside development environment`);
		}
		// Add stream for morgan middleware
		this.stream = {
			write: (message) => this.info(message.replace(/\n$/, '')), // remove \n added by morgan at the end
		};
	}

	private createLogger(): pino.Logger {
		// eslint-disable-next-line new-cap
		let transport: pino.TransportPipelineOptions;
		if (!this.options.formatJSON) {
			transport = {
				pipeline: [
					{
						target: './custom-pino-pretty',
						options: {
							colorize: false,
							messageKey: 'message',
							levelKey: 'level',
							levelLabel: 'level',
							singleLine: true,
							ignore: 'pid,hostname,label',
							destination: this.options.developmentOutputFilePath,
						},
					},
				],
			};
		}
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this;
		return pino(
			{
				timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
				messageKey: 'message',
				level: this.level,
				transport,
				mixin: () => ({
					label: this.name,
				}),
				formatters: {
					level: (label) => ({ level: label }),
				},
				base: undefined,
				hooks: {
					logMethod(args: any[], method: pino.LogFn) {
						let message;
						let obj;
						if (typeof args[0] === 'string') {
							message = args[0];
							obj = args[1];
						} else {
							message = args[1];
							obj = args[0];
						}
						if (obj instanceof Error) {
							obj = { err: obj };
						}

						let result = obj ?? {};
						result.message = message;

						if (that.options.filters) {
							for (const filter of that.options.filters) {
								result = {
									...result,
									...filter.call(null, result),
								};
							}
						}
						message = result.message;
						result.message = undefined;
						return method.apply(this, [result, message]);
					},
				},
			},
			pino.multistream(
				[
					{ level: 'error', stream: process.stderr },
					{ level: 'warn', stream: process.stdout },
					{ level: 'info', stream: process.stdout },
					{ level: 'debug', stream: process.stdout },
					{ level: 'trace', stream: process.stdout },
				],
				{
					dedupe: true,
				},
			),
		);
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
}

export default (name: string, options?: N9Log.Options): N9Log => new N9Log(name, options);
