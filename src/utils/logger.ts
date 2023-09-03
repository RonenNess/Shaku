// default logger drivers.
let _drivers: Console = console;

// application name
let _application = "Shaku";

/**
 * A logger manager.
 * By default writes logs to console.
 */
export class Logger {
	private nameHeader: string;
	private throwErrors: boolean;

	public constructor(name: string) {
		this.nameHeader = ("[" + _application + "][" + name + "]").padEnd(25, " ");
		this.throwErrors = false;
	}

	/**
	 * Write a trace level log message.
	 * @param sg Message to write.
	 */
	public trace(msg: string): void {
		_drivers.trace(this.nameHeader, msg);
	}

	/**
	 * Write a debug level log message.
	 * @param msg Message to write.
	 */
	public debug(msg: string): void {
		_drivers.debug(this.nameHeader, msg);
	}

	/**
	 * Write an info level log message.
	 * @param msg Message to write.
	 */
	public info(msg: string): void {
		_drivers.info(this.nameHeader, msg);
	}

	/**
	 * Write a warning level log message.
	 * @param msg Message to write.
	 */
	public warn(msg: string): void {
		_drivers.warn(this.nameHeader, msg);
		if(this.throwErrors) throw new Error(msg);
	}

	/**
	 * Write an error level log message.
	 * @param msg Message to write.
	 */
	public error(msg: string): void {
		_drivers.error(this.nameHeader, msg);
		if(this.throwErrors) throw new Error(msg);
	}

	/**
	 * Set logger to throw an error every time a log message with severity higher than warning is written.
	 * @param enable Set to true to throw error on warnings.
	 */
	public throwErrorOnWarnings(enable: boolean): void {
		this.throwErrors = Boolean(enable);
	}
}

/**
 * Null logger drivers to silent logs.
 * @private
 */
export class NullDrivers {
	/**
	 * @private
	 */
	public constructor() { }

	public trace(msg: string): void { }

	public debug(msg: string): void { }

	public info(msg: string): void { }

	public warn(msg: string): void { }

	public error(msg: string): void { }
}

// cached loggers
const _cachedLoggers: Record<string, unknown> = {};

/**
 * The Logger module is a small object to get loggers and control the underlying logger drivers.
 */
export class LoggerFactory {

	private constructor() { }

	/**
	 * Get a logger object for a given logger name.
	 * @param name Logger name.
	 * @returns Logger to use.
	 */
	public static getLogger(name: string): Logger {
		if(!_cachedLoggers[name]) _cachedLoggers[name] = new Logger(name);
		return _cachedLoggers[name];
	}

	/**
	 * Silent the logger.
	 */
	public static silent(): void {
		_drivers = new NullDrivers();
	}

	/**
	 * Set log drivers that implement trace, debug, info, warn and error that all loggers will use.
	 */
	public static setDrivers(drivers): void {
		_drivers = drivers;
	}

	/**
	 * Set logger application name.
	 * @param {String} name Set application name to replace the "Shaku" in the headers.
	 */
	public static setApplicationName(name: string): typeof LoggerFactory {
		_application = name;
		return LoggerFactory;
	}
}
