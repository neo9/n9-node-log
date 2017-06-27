import * as winston from 'winston'

export namespace N9Log {
	export interface Options {
		console?: boolean
		files?: FilesOptions[]
		http?: HttpOptions[]
	}

	export interface FilesOptions {
		level?: 'error' | 'warn' | 'info' | 'trace' | 'debug'
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

	public trace: winston.LeveledLogMethod
	public debug: winston.LeveledLogMethod
	public info: winston.LeveledLogMethod
	public warn: winston.LeveledLogMethod
	public error: winston.LeveledLogMethod
	public profile: N9Log.ProfileMethod

	private name: string
	private level: 'error' | 'warn' | 'info' | 'trace' | 'debug'
	private options: N9Log.Options
	private log: winston.LoggerInstance

	constructor(name: string, options?: N9Log.Options) {
		// Options
		this.name = name
		this.level = process.env.N9LOG || 'info'
		this.options = options || {}
		this.options.console = (typeof this.options.console === 'boolean' ? this.options.console : true)
		this.options.files = this.options.files || []
		this.options.http = this.options.http || []
		// Logger
		this.log = this.createLogger(this.level)
		// Add methods
		this.info = this.log.info.bind(this.log)
		this.warn = this.log.warn.bind(this.log)
		this.error = this.log.error.bind(this.log)
		this.profile = this.log.profile.bind(this.log)
	}

	public module(name: string) {
		return new N9Log(`${this.name}:${name}`, this.options)
	}

	private createLogger(level: string) {
		const transports = this.getTransporters()
		// Instanciate the logger
		return new winston.Logger({
			transports,
			levels: {
				error: 0,
				warn: 1,
				info: 2,
				debug: 3,
				trace: 4
			},
			colors: {
				trace: 'blue',
				debug: 'green',
				info: 'cyan',
				warn: 'yellow',
				error: 'red'
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
					timestamp: true
				})
			)
		}
		// Add file transport
		this.options.files.forEach((fileOptions, index) => {
			transports.push(
				new winston.transports.File({
					name: `file-transport-${index}`,
					...fileOptions
				})
			)
		})
		// Add http transport
		this.options.http.forEach((httpOptions, index) => {
			transports.push(
				new winston.transports.Http({
					name: `http-transport-${index}`,
					...httpOptions
				})
			)
		})
		return transports
	}

}

export default function(name: string, options?: N9Log.Options): N9Log {
	return new N9Log(name, options)
}
