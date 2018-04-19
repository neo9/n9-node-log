import * as winston from 'winston'

export namespace N9Log {
	export interface Options {
		level?: string
		console?: boolean
		files?: FilesOptions[]
		http?: HttpOptions[]
		transports?: any[]
		filters?: winston.MetadataFilter[]
	}

	export interface FilesOptions {
		level?: 'error' | 'warn' | 'info' | 'debug' | 'verbose'
		filename: string
		maxsize?: number
		maxFiles?: number
	}

	export interface HttpOptions {
		host?: string
		port?: number
		path?: string
		auth?: {
			username: string
			password: string
		}
		ssl?: boolean
	}
	export type ProfileMethod = (id: string, msg?: string, meta?: any, callback?: (err: Error, level: string, msg: string, meta: any) => void) => winston.LoggerInstance
}

export class N9Log {

	public error: winston.LeveledLogMethod
	public warn: winston.LeveledLogMethod
	public info: winston.LeveledLogMethod
	public debug: winston.LeveledLogMethod
	public verbose: winston.LeveledLogMethod
	public profile: N9Log.ProfileMethod
	public stream: { write: (message) => winston.LoggerInstance }

	private name: string
	private level: string
	private options: N9Log.Options
	private log: winston.LoggerInstance

	constructor(name: string, options?: N9Log.Options) {
		this.options = options || {}
		// Options
		this.name = name
		// tslint:disable-next-line:no-console
		this.level = process.env.N9LOG || this.options.level || 'verbose'
		this.options.console = (typeof this.options.console === 'boolean' ? this.options.console : true)
		this.options.files = this.options.files || []
		this.options.http = this.options.http || []
		this.options.transports = this.options.transports || []
		this.options.filters = this.options.filters || []
		this.initLogger()
	}

	public addFilter(filter: winston.MetadataFilter) {
		this.options.filters.push(filter)
		this.initLogger()
	}

	public module(name: string, options?: N9Log.Options) {
		return new N9Log(`${this.name}:${name}`)
	}

	private initLogger() {
		// Logger
		this.log = this.createLogger(this.level)

		// Add methods
		this.error = this.log.error.bind(this.log)
		this.warn = this.log.warn.bind(this.log)
		this.info = this.log.info.bind(this.log)
		this.debug = this.log.debug.bind(this.log)
		this.verbose = this.log.verbose.bind(this.log)
		this.profile = this.log.profile.bind(this.log)

		// Add stream for morgan middleware
		this.stream = {
			write: (message) => this.info(message.replace(/\n$/, '')) // remove \n added by morgan at the end
		}
	}

	private createLogger(level: string) {
		const transports = this.getTransporters()
		// Instanciate the logger
		return new winston.Logger({
			transports,
			filters: this.options.filters,
			levels: {
				error: 0,
				warn: 1,
				info: 2,
				debug: 3,
				verbose: 4
			},
			colors: {
				error: 'red',
				warn: 'yellow',
				info: 'cyan',
				debug: 'green',
				verbose: 'blue'
			}
		})
	}

	private getTransporters() {
		const transports = []

		// Add console transport
		if (this.options.console) {
			transports.push(
				new winston.transports.Console({
					colorize: true,
					level: this.level,
					label: this.name,
					timestamp: true,
					stderrLevels: ['error']
				})
			)
		}
		// Add file transport
		this.options.files.forEach((fileOptions, index) => {
			transports.push(
				new winston.transports.File({
					name: `file-transport-${index}`,
					level: this.level,
					...fileOptions
				})
			)
		})
		// Add http transport
		this.options.http.forEach((httpOptions, index) => {
			transports.push(
				new winston.transports.Http({
					name: `http-transport-${index}`,
					level: this.level,
					...httpOptions
				})
			)
		})
		// Add custom transports
		this.options.transports.forEach((transport) => {
			transports.push(transport)
		})

		return transports
	}
}

export default function(name: string, options?: N9Log.Options): N9Log {
	return new N9Log(name, options)
}
