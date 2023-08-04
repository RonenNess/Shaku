import _logger from "../logger.js";

const _loggggger = _logger.getLogger(sfx); // TODO

/**
 * A sound effect instance you can play and stop.
 */
class SoundInstance {
	/**
	* Create a sound instance.
	* @param {Sfx} sfxManager Sfx manager instance.
	* @param {String} url Sound URL or source.
	*/
	constructor(sfxManager, url) {
		if(!url) {
			_logger.error("Sound type can't be null or invalid!");
			throw new Error("Invalid sound type to play in SoundInstance!");
		}
		this._sfx = sfxManager;
		this._audio = new Audio(url);
		this._volume = 1;
	}

	/**
	 * Dispose the audio object when done playing the sound.
	 * This will call dispose() automatically when audio ends.
	 */
	disposeWhenDone() {
		this._audio.onended = () => {
			this.dispose();
		};
	}

	/**
	 * Dispose the audio object and clear its resources.
	 * When playing lots of sounds its important to call dispose on sounds you no longer use, to avoid getting hit by
	 * "Blocked attempt to create a WebMediaPlayer" exception.
	 */
	dispose() {
		if(this._audio) {
			try {
				this._audio.pause();
				this._audio.remove();
			} catch(e) { _logger.warn(`Error while disposing sound instance: ${e}.`); }
			this._audio.src = "";
			this._audio.srcObject = null;
		}
		this._audio = null;
	}

	/**
	* Play sound.
	* @returns {Promise} Promise to return when sound start playing.
	*/
	play() {
		if(!this._audio) { throw new Error("Sound instance was already disposed!"); }
		if(this.playing) { return; }
		let promise = this._audio.play();
		this._sfx._playingSounds.add(this);
		return promise;
	}

	/**
	* Get sound effect playback rate.
	* @returns {Number} Playback rate.
	*/
	get playbackRate() {
		if(!this._audio) { return 0; }
		return this._audio.playbackRate;
	}

	/**
	* Set playback rate.
	* @param {Number} val Playback value to set.
	*/
	set playbackRate(val) {
		if(!this._audio) { return 0; }
		if(val < 0.1) { _logger.error("playbackRate value set is too low, value was capped to 0.1."); }
		if(val > 10) { _logger.error("playbackRate value set is too high, value was capped to 10."); }
		this._audio.playbackRate = val;
		return val;
	}

	/**
	* Get if to preserve pitch while changing playback rate.
	* @returns {Boolean} Preserve pitch state of the sound instance.
	*/
	get preservesPitch() {
		if(!this._audio) { return false; }
		return Boolean(this._audio.preservesPitch || this._audio.mozPreservesPitch);
	}

	/**
	* Set if to preserve pitch while changing playback rate.
	* @param {Boolean} val New preserve pitch value to set.
	*/
	set preservesPitch(val) {
		if(!this._audio) { return false; }
		return this._audio.preservesPitch = this._audio.mozPreservesPitch = Boolean(val);
	}

	/**
	* Pause the sound.
	*/
	pause() {
		if(!this._audio) { throw new Error("Sound instance was already disposed!"); }
		this._audio.pause();
	}

	/**
	* Replay sound from start.
	* @returns {Promise} Promise to return when sound start playing.
	*/
	replay() {
		if(!this._audio) { throw new Error("Sound instance was already disposed!"); }
		this.stop();
		return this.play();
	}

	/**
	* Stop the sound and go back to start.
	* @returns {Boolean} True if successfully stopped sound, false otherwise.
	*/
	stop() {
		if(!this._audio) { throw new Error("Sound instance was already disposed!"); }
		try {
			this.pause();
			this.currentTime = 0;
			return true;
		}
		catch(e) {
			return false;
		}
	}

	/**
	* Get if playing in loop.
	* @returns {Boolean} If this sound should play in loop.
	*/
	get loop() {
		if(!this._audio) { return false; }
		return this._audio.loop;
	}

	/**
	* Set if playing in loop.
	* @param {Boolean} value If this sound should play in loop.
	*/
	set loop(value) {
		if(!this._audio) { return false; }
		this._audio.loop = value;
		return this._audio.loop;
	}

	/**
	* Get volume.
	* @returns {Number} Sound effect volume.
	*/
	get volume() {
		if(!this._audio) { return 0; }
		return this._volume;
	}

	/**
	* Set volume.
	* @param {Number} value Sound effect volume to set.
	*/
	set volume(value) {
		if(!this._audio) { return 0; }
		this._volume = value;
		var volume = (value * SoundInstance._masterVolume);
		if(volume < 0) { volume = 0; }
		if(volume > 1) { volume = 1; }
		this._audio.volume = volume;
		return this._volume;
	}

	/**
	* Get current time in track.
	* @returns {Number} Current time in playing sound.
	*/
	get currentTime() {
		if(!this._audio) { return 0; }
		return this._audio.currentTime;
	}

	/**
	* Set current time in track.
	* @param {Number} value Set current playing time in sound track.
	*/
	set currentTime(value) {
		if(!this._audio) { return 0; }
		return this._audio.currentTime = value;
	}

	/**
	* Get track duration.
	* @returns {Number} Sound duration in seconds.
	*/
	get duration() {
		if(!this._audio) { return 0; }
		return this._audio.duration;
	}

	/**
	* Get if sound is currently paused.
	* @returns {Boolean} True if sound is currently paused.
	*/
	get paused() {
		if(!this._audio) { return false; }
		return this._audio.paused;
	}

	/**
	* Get if sound is currently playing.
	* @returns {Boolean} True if sound is currently playing.
	*/
	get playing() {
		if(!this._audio) { return false; }
		return !this.paused && !this.finished;
	}

	/**
	* Get if finished playing.
	* @returns {Boolean} True if sound reached the end and didn't loop.
	*/
	get finished() {
		if(!this._audio) { return false; }
		return this._audio.ended;
	}
}

// master volume
SoundInstance._masterVolume = 1;

// export main object
export default SoundInstance;
