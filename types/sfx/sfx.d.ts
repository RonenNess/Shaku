declare const _exports: Sfx;
export = _exports;
/**
 * Sfx manager.
 * Used to play sound effects and music.
 *
 * To access the Sfx manager use `Shaku.sfx`.
 */
declare class Sfx extends IManager {
    _playingSounds: Set<any>;
    /**
     * Get the SoundMixer class.
     * @see SoundMixer
     */
    get SoundMixer(): typeof SoundMixer;
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
    play(soundAsset: SoundAsset, volume: number, playbackRate: number, preservesPitch: boolean): Promise<any>;
    /**
     * Stop all playing sounds.
     * @example
     * Shaku.sfx.stopAll();
     */
    stopAll(): void;
    /**
     * Get currently playing sounds count.
     * @returns {Number} Number of sounds currently playing.
     */
    get playingSoundsCount(): number;
    /**
     * Create and return a sound instance you can use to play multiple times.
     * @example
     * let sound = await Shaku.assets.loadSound("assets/my_sound.ogg");
     * let soundInstance = Shaku.sfx.createSound(sound);
     * soundInstance.play();
     * @param {SoundAsset} sound Sound asset to play.
     * @returns {SoundInstance} Newly created sound instance.
     */
    createSound(sound: SoundAsset): SoundInstance;
    /**
     * Set master volume.
     * This affect all sound effects volumes.
     * @param {Number} value Master volume to set.
     */
    set masterVolume(arg: number);
    /**
     * Get master volume.
     * This affect all sound effects volumes.
     * @returns {Number} Current master volume value.
     */
    get masterVolume(): number;
}
import IManager = require("../manager.js");
import SoundMixer = require("./sound_mixer.js");
import SoundAsset = require("../assets/sound_asset.js");
import SoundInstance = require("./sound_instance.js");
//# sourceMappingURL=sfx.d.ts.map