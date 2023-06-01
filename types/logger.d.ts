/**
 * A logger manager.
 * By default writes logs to console.
 */
declare class Logger {
    constructor(name: any);
    _nameHeader: any;
    _throwErrors: boolean;
    /**
     * Write a trace level log message.
     * @param {String} msg Message to write.
     */
    trace(msg: string): void;
    /**
     * Write a debug level log message.
     * @param {String} msg Message to write.
     */
    debug(msg: string): void;
    /**
     * Write an info level log message.
     * @param {String} msg Message to write.
     */
    info(msg: string): void;
    /**
     * Write a warning level log message.
     * @param {String} msg Message to write.
     */
    warn(msg: string): void;
    /**
     * Write an error level log message.
     * @param {String} msg Message to write.
     */
    error(msg: string): void;
    /**
     * Set logger to throw an error every time a log message with severity higher than warning is written.
     * @param {Boolean} enable Set to true to throw error on warnings.
     */
    throwErrorOnWarnings(enable: boolean): void;
}
export function getLogger(name: string): Logger;
export function silent(): void;
export function setDrivers(drivers: any): void;
export function setApplicationName(name: string): {
    /**
     * Get a logger object for a given logger name.
     * @param {String} name Logger name.
     * @returns {Logger} Logger to use.
     */
    getLogger: (name: string) => Logger;
    /**
     * Silent the logger.
     */
    silent: () => void;
    /**
     * Set log drivers that implement trace, debug, info, warn and error that all loggers will use.
     */
    setDrivers: (drivers: any) => void;
    /**
     * Set logger application name.
     * @param {String} name Set application name to replace the 'Shaku' in the headers.
     */
    setApplicationName: (name: string) => any;
};
export {};
//# sourceMappingURL=logger.d.ts.map