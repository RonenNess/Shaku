export = GameTime;
/**
 * Class to hold current game time, both elapse and delta from last frame.
 */
declare class GameTime {
    /**
     * Update game time.
     */
    static update(): void;
    /**
     * Get raw timestamp in milliseconds.
     * @returns {Number} raw timestamp in milliseconds.
     */
    static rawTimestamp(): number;
    /**
     * Reset elapsed and delta time.
     */
    static reset(): void;
    /**
     * Reset current frame's delta time.
     */
    static resetDelta(): void;
    /**
     * Current timestamp
     */
    timestamp: number;
    /**
     * Delta time struct.
     * Contains: milliseconds, seconds.
     */
    deltaTime: {
        milliseconds: number;
        seconds: number;
    };
    /**
     * Elapsed time struct.
     * Contains: milliseconds, seconds.
     */
    elapsedTime: {
        milliseconds: number;
        seconds: number;
    };
    /**
     * Delta time, in seconds, since last frame.
     */
    delta: number;
    /**
     * Total time, in seconds, since Shaku was initialized.
     */
    elapsed: number;
}
//# sourceMappingURL=game_time.d.ts.map