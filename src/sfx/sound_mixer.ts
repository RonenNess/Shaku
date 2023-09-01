import { SoundInstance } from "./sound_instance";

/**
 * A utility class to mix between two sounds.
 */
export class SoundMixer {
	/**
	 * Create the sound mixer.
	 * @param {SoundInstance} sound1 Sound to mix from. Can be null to just fade in.
	 * @param {SoundInstance} sound2 Sound to mix to. Can be null to just fade out.
	 * @param {Boolean} allowOverlapping If true (default), will mix while overlapping sounds.
	 *                                   If false, will first finish first sound before begining next.
	 */
	public constructor(sound1, sound2, allowOverlapping) {
		this._sound1 = sound1;
		this._sound2 = sound2;
		this.fromSoundVolume = this._sound1 ? this._sound1.volume : 0;
		this.toSoundVolume = this._sound2 ? this._sound2.volume : 0;
		this.allowOverlapping = allowOverlapping;
		this.update(0);
	}

	/**
	 * Stop both sounds.
	 */
	stop() {
		if(this._sound1) { this._sound1.stop(); }
		if(this._sound2) { this._sound2.stop(); }
	}

	/**
	 * Get first sound.
	 * @returns {SoundInstance} First sound instance.
	 */
	get fromSound() {
		return this._sound1;
	}

	/**
	 * Get second sound.
	 * @returns {SoundInstance} Second sound instance.
	 */
	get toSound() {
		return this._sound2;
	}

	/**
	 * Return current progress.
	 * @returns {Number} Mix progress from 0 to 1.
	 */
	get progress() {
		return this._progress;
	}

	/**
	 * Update the mixer progress with time delta instead of absolute value.
	 * @param {Number} delta Progress delta, in seconds.
	 */
	updateDelta(delta) {
		this.update(this._progress + delta);
	}

	/**
	 * Update the mixer progress.
	 * @param {Number} progress Transition progress from sound1 to sound2. Values must be between 0.0 to 1.0.
	 */
	update(progress) {
		// special case - start
		if(progress <= 0) {
			if(this._sound1) {
				this._sound1.volume = this.fromSoundVolume;
			}
			if(this._sound2) {
				this._sound2.volume = 0;
				this._sound2.stop();
			}
			this._progress = 0;
		}
		// special case - finish
		if(progress >= 1) {
			if(this._sound2) {
				this._sound2.volume = this.toSoundVolume;
			}
			if(this._sound1) {
				this._sound1.volume = 0;
				this._sound1.stop();
			}
			this._progress = 1;
		}
		// transition
		else {
			this._progress = progress;
			if(this._sound1) { this._sound1.play(); }
			if(this._sound2) { this._sound2.play(); }

			if(this.allowOverlapping) {
				if(this._sound1) { this._sound1.volume = this.fromSoundVolume * (1 - progress); }
				if(this._sound2) { this._sound2.volume = this.toSoundVolume * progress; }
			}
			else {
				progress *= 2;
				if(this._sound1) { this._sound1.volume = Math.max(this.fromSoundVolume * (1 - progress), 0); }
				if(this._sound2) { this._sound2.volume = Math.max(this.toSoundVolume * (progress - 1), 0); }
			}
		}
	}
}
