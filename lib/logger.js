/**
 * Implement basic logger.
 * By default, uses console for logging, but it can be replaced with setDrivers().
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\logger.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

// default logger drivers.
var _drivers = console;

/**
 * A logger manager.
 * By default writes logs to console.
 */
class Logger
{
    constructor(name)
    {
        this._nameHeader = '[Shaku][' + name + ']';
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
    }

    /**
     * Write an error level log message.
     * @param {String} msg Message to write.
     */
    error(msg)
    {
        _drivers.error(this._nameHeader, msg);
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

// export the seeded random class.
module.exports = {

    /**
     * Get a logger object.
     * @param {String} name Logger name.
     */
    getLogger: function(name) {
        return new Logger(name);
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
    }
};