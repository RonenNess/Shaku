// default logger drivers.
let _drivers: Console = console;

// application name
var _application = "Shaku";

/**
 * A logger manager.
 * By default writes logs to console.
 */
export class Logger {
	private _nameHeader: string;
	private _throwErrors: boolean;

	public constructor(name: string) {
		this._nameHeader = ("[" + _application + "][" + name + "]").padEnd(25, " ");
		this._throwErrors = false;
	}

	/**
	 * Write a trace level log message.
	 * @param sg Message to write.
	 */
	public trace(msg: string): void {
		_drivers.trace(this._nameHeader, msg);
	}

	/**
	 * Write a debug level log message.
	 * @param msg Message to write.
	 */
	public debug(msg: string): void {
		_drivers.debug(this._nameHeader, msg);
	}

	/**
	 * Write an info level log message.
	 * @param msg Message to write.
	 */
	public info(msg: string): void {
		_drivers.info(this._nameHeader, msg);
	}

	/**
	 * Write a warning level log message.
	 * @param msg Message to write.
	 */
	public warn(msg: string): void {
		_drivers.warn(this._nameHeader, msg);
		if(this._throwErrors) {
			throw new Error(msg);
		}
	}

	/**
	 * Write an error level log message.
	 * @param msg Message to write.
	 */
	public error(msg: string): void {
		_drivers.error(this._nameHeader, msg);
		if(this._throwErrors) {
			throw new Error(msg);
		}
	}

	/**
	 * Set logger to throw an error every time a log message with severity higher than warning is written.
	 * @param enable Set to true to throw error on warnings.
	 */
	public throwErrorOnWarnings(enable: boolean): void {
		this._throwErrors = Boolean(enable);
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
	public constructor() {
	}

	public trace(msg: string): void {
	}

	public debug(msg: string): void {
	}

	public info(msg: string): void {
	}

	public warn(msg: string): void {
	}

	public error(msg: string): void {
	}
}

// cached loggers
const _cachedLoggers: Record<string, unknown> = {};

/**
 * The Logger module is a small object to get loggers and control the underlying logger drivers.
 */
export const LoggerModule = {

	/**
	 * Get a logger object for a given logger name.
	 * @param name Logger name.
	 * @returns Logger to use.
	 */
	getLogger: function(name: string): Logger {
		if(!_cachedLoggers[name]) {
			_cachedLoggers[name] = new Logger(name);
		}
		return _cachedLoggers[name];
	},

	/**
	 * Silent the logger.
	 */
	silent: function() {
		_drivers = new NullDrivers();
	},

	/**
	 * Set log drivers that implement trace, debug, info, warn and error that all loggers will use.
	 */
	setDrivers: function(drivers) {
		_drivers = drivers;
	},

	/**
	 * Set logger application name.
	 * @param {String} name Set application name to replace the "Shaku" in the headers.
	 */
	setApplicationName: function(name) {
		_application = name;
		return this;
	},
};
