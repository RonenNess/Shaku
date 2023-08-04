import SoundAsset from "../assets/sound_asset";
import _logger from "../logger.js";
import IManager from "../manager";
import SoundInstance from "./sound_instance";
import SoundMixer from "./sound_mixer";

const _loggggger = _logger.getLogger(sfx); // TODO




/**
 * Sfx manager.
 * Used to play sound effects and music.
 *
 * To access the Sfx manager use `Shaku.sfx`.
 */
class Sfx extends IManager {
	/**
	 * Create the manager.
	 */
	constructor() {
		super();
		this._playingSounds = null;
	}

	/**
	 * @inheritdoc
	 * @private
	 **/
	setup() {
		return new Promise((resolve, reject) => {
			_logger.info("Setup sfx manager..");
			this._playingSounds = new Set();
			resolve();
		});
	}

	/**
	 * @inheritdoc
	 * @private
	 **/
	startFrame() {
		// remove any sound no longer playing
		let playingSounds = Array.from(this._playingSounds);
		for(let sound of playingSounds) {
			if(!sound.isPlaying) {
				this._playingSounds.delete(sound);
			}
		}
	}

	/**
	 * @inheritdoc
	 * @private
	 **/
	endFrame() {
	}

	/**
	 * @inheritdoc
	 * @private
	 **/
	destroy() {
		this.stopAll();
		this.cleanup();
	}

	/**
	 * Get the SoundMixer class.
	 * @see SoundMixer
	 */
	get SoundMixer() {
		return SoundMixer;
	}

	/**
	 * Play a sound once without any special properties and without returning a sound instance.
	 * Its a more convinient method to play sounds, but less efficient than 'createSound()' if you want to play multiple times.
	 * @example
	 * let sound = await Shaku.assets.loadSound("assets/my_sound.ogg");
	 * Shaku.sfx.play(sound, 0.75);
	 * @param {SoundAsset} soundAsset Sound asset to play.
	 * @param {Number} volume Volume to play sound (default to max).
	 * @param {Number} playbackRate Optional playback rate factor.
	 * @param {Boolean} preservesPitch Optional preserve pitch when changing rate factor.
	 * @returns {Promise} Promise to resolve when sound starts playing.
	 */
	play(soundAsset, volume, playbackRate, preservesPitch) {
		let sound = this.createSound(soundAsset);
		sound.volume = volume !== undefined ? volume : 1;
		if(playbackRate !== undefined) { sound.playbackRate = playbackRate; }
		if(preservesPitch !== undefined) { sound.preservesPitch = preservesPitch; }
		let ret = sound.play();
		sound.disposeWhenDone();
		return ret;
	}

	/**
	 * Stop all playing sounds.
	 * @example
	 * Shaku.sfx.stopAll();
	 */
	stopAll() {
		let playingSounds = Array.from(this._playingSounds);
		for(let sound of playingSounds) {
			sound.stop();
		}
		this._playingSounds = new Set();
	}

	/**
	 * Get currently playing sounds count.
	 * @returns {Number} Number of sounds currently playing.
	 */
	get playingSoundsCount() {
		return this._playingSounds.size;
	}

	/**
	 * Create and return a sound instance you can use to play multiple times.
	 * @example
	 * let sound = await Shaku.assets.loadSound("assets/my_sound.ogg");
	 * let soundInstance = Shaku.sfx.createSound(sound);
	 * soundInstance.play();
	 * @param {SoundAsset} sound Sound asset to play.
	 * @returns {SoundInstance} Newly created sound instance.
	 */
	createSound(sound) {
		if(!(sound.isSoundAsset)) { throw new Error("Sound type must be an instance of SoundAsset!"); }
		var ret = new SoundInstance(this, sound.url);
		return ret;
	}

	/**
	 * Get master volume.
	 * This affect all sound effects volumes.
	 * @returns {Number} Current master volume value.
	 */
	get masterVolume() {
		return SoundInstance._masterVolume;
	}

	/**
	 * Set master volume.
	 * This affect all sound effects volumes.
	 * @param {Number} value Master volume to set.
	 */
	set masterVolume(value) {
		SoundInstance._masterVolume = value;
		return value;
	}
}

// export main object
export default new Sfx();
