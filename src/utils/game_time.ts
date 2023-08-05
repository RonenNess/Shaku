/**
 * Class to hold current game time, both elapse and delta from last frame.
 */
export default class GameTime {
	public timestamp: number;
	public deltaTime: { milliseconds: number; seconds: number; };
	public elapsedTime: { milliseconds: number; seconds: number; };
	public delta: number | null;
	public elapsed: number;
	public rawTimestamp: number;

	/**
	 * create the gametime object with current time.
	 */
	public constructor() {
		/**
		 * Current timestamp
		 */
		this.timestamp = _currElapsed;

		/**
		 * Delta time struct.
		 * Contains: milliseconds, seconds.
		 */
		this.deltaTime = {
			milliseconds: _currDelta,
			seconds: _currDelta / 1000.0,
		};

		/**
		 * Elapsed time struct.
		 * Contains: milliseconds, seconds.
		 */
		this.elapsedTime = {
			milliseconds: _currElapsed,
			seconds: _currElapsed / 1000.0
		};

		/**
		 * Delta time, in seconds, since last frame.
		 */
		this.delta = this.deltaTime ? this.deltaTime.seconds : null;

		/**
		 * Total time, in seconds, since Shaku was initialized.
		 */
		this.elapsed = this.elapsedTime.seconds;

		/**
		 * Raw timestamp in milliseconds.
		 * This value updates only as long as you run Shaku frames, and continue to update even if game is paused.
		 */
		this.rawTimestamp = _rawTimestampMs;

		// freeze object
		Object.freeze(this);
	}

	/**
	 * Update raw time-related data.
	 * Called automatically from "update".
	 * @private
	 */
	public static updateRawData() {
		_rawTimestampMs = getAccurateTimestampMs();
	}

	/**
	 * Update game time.
	 * @private
	 */
	public static update() {
		// update raw data
		GameTime.updateRawData();

		// calculate delta time
		let delta = 0;
		if(_prevTime) {
			delta = _rawTimestampMs - _prevTime;
		}

		// update previous time
		_prevTime = _rawTimestampMs;

		// update delta and elapsed
		_currDelta = delta;
		_currElapsed += delta;
	}

	/**
	 * Get raw timestamp in milliseconds.
	 * This value updates only as long as you run Shaku frames, and continue to update even if game is paused.
	 * @returns raw timestamp in milliseconds.
	 */
	public static rawTimestamp(): number {
		return _rawTimestampMs;
	}

	/**
	 * Reset elapsed and delta time.
	 */
	public static reset() {
		_prevTime = null;
		_currDelta = 0;
		_currElapsed = 0;
	}

	/**
	 * Reset current frame's delta time.
	 */
	public static resetDelta() {
		_prevTime = null;
		_currDelta = 0;
	}
}

// do we have the performance.now method?
const gotPerformance = (typeof performance !== "undefined") && performance.now;

// get most accurate timestamp in milliseconds.
function getAccurateTimestampMs(): number {
	if(gotPerformance) {
		return performance.now();
	}
	return Date.now();
}

// previous time (to calculate delta).
var _prevTime: number | null = null;

// current delta and elapsed
var _currDelta = 0;
var _currElapsed = 0;
var _rawTimestampMs = getAccurateTimestampMs();
