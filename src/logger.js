/**
 * Implement basic logger.
 * By default, uses console for logging, but it can be replaced with setDrivers().
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\logger.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

// default logger drivers.
var _drivers = console;

// application name
var _application = "Shaku";

/**
 * A logger manager.
 * By default writes logs to console.
 */
class Logger
{
    constructor(name)
    {
        this._nameHeader = ('[' + _application + '][' + name + ']').padEnd(25, ' ');
        this._throwErrors = false;
    }

    /**
     * Write a trace level log message.
     * @param {String} msg Message to write.
     */
    trace(msg)
    {
        _drivers.trace(this._nameHeader, msg);
    }

    /**
     * Write a debug level log message.
     * @param {String} msg Message to write.
     */
    debug(msg)
    {
        _drivers.debug(this._nameHeader, msg);
    }

    /**
     * Write an info level log message.
     * @param {String} msg Message to write.
     */
    info(msg)
    {
        _drivers.info(this._nameHeader, msg);
    }

    /**
     * Write a warning level log message.
     * @param {String} msg Message to write.
     */
    warn(msg)
    {
        _drivers.warn(this._nameHeader, msg);
        if (this._throwErrors) {
            throw new Error(msg);
        }
    }

    /**
     * Write an error level log message.
     * @param {String} msg Message to write.
     */
    error(msg)
    {
        _drivers.error(this._nameHeader, msg);
        if (this._throwErrors) {
            throw new Error(msg);
        }
    }

    /**
     * Set logger to throw an error every time a log message with severity higher than warning is written.
     * @param {Boolean} enable Set to true to throw error on warnings.
     */
    throwErrorOnWarnings(enable)
    {
        this._throwErrors = Boolean(enable);
    }
}


/**
 * Null logger drivers to silent logs.
 * @private
 */
class NullDrivers
{
    /**
     * @private
     */
    constructor()
    {
    }
    trace(msg)
    {
    }
    debug(msg)
    {
    }
    info(msg)
    {
    }
    warn(msg)
    {
    }
    error(msg)
    {
    }
}


// cached loggers
const _cachedLoggers = {};


/**
 * The Logger module is a small object to get loggers and control the underlying logger drivers.
 */
const LoggerModule = {

    /**
     * Get a logger object for a given logger name.
     * @param {String} name Logger name.
     * @returns {Logger} Logger to use.
     */
    getLogger: function(name) 
    {
        if (!_cachedLoggers[name]) {
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
    setDrivers: function(drivers)
    {
        _drivers = drivers;
    },

    /**
     * Set logger application name.
     * @param {String} name Set application name to replace the 'Shaku' in the headers.
     */
    setApplicationName: function(name)
    {
        _application = name;
        return this;
    }
};

// export the logger module object.
module.exports = LoggerModule;