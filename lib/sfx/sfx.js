/**
 * Implement the sfx manager.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\sfx\sfx.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const SoundAsset = require('../assets/sound_asset.js');
const IManager = require('../manager.js');
const _logger = require('../logger.js').getLogger('sfx');
const SoundInstance = require('./sound_instance.js');
const SoundMixer = require('./sound_mixer.js');
 

/**
 * Sfx manager. 
 * Used to play sound effects and music.
 * 
 * To access the Sfx manager use `Shaku.sfx`. 
 */
class Sfx extends IManager
{
    /**
     * Create the manager.
     */
    constructor()
    {
        super();
        this._playingSounds = null;
        this._soundsNotDisposed = null;
    }

    /** 
     * @inheritdoc 
     * @private
     **/
    setup()
    {        
        return new Promise((resolve, reject) => {    
            _logger.info("Setup sfx manager..");
            if (this._soundsNotDisposed) { this.cleanup(); }
            this._playingSounds = new Set();
            this._soundsNotDisposed = new Set();
            resolve();
        });
    }

    /** 
     * @inheritdoc
     * @private
     **/
    startFrame()
    {
        // remove any sound no longer playing
        let playingSounds = Array.from(this._playingSounds);
        for (let sound of playingSounds) {
            if (!sound.isPlaying) {
                this._playingSounds.delete(sound);
            }
        }
    }

    /** 
     * @inheritdoc 
     * @private
     **/
    endFrame()
    {
    }

    /** 
     * @inheritdoc 
     * @private
     **/
    destroy()
    {
        this.stopAll();
        this.cleanup();
    }

    /**
     * Get the SoundMixer class.
     * @see SoundMixer
     */
    get SoundMixer()
    {
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
    play(soundAsset, volume, playbackRate, preservesPitch)
    {
        let sound = this.createSound(soundAsset);
        sound.volume = volume !== undefined ? volume : 1;
        if (playbackRate !== undefined) { sound.playbackRate = playbackRate; }
        if (preservesPitch !== undefined) { sound.preservesPitch = preservesPitch; }
        let ret = sound.play();
        sound.disposeWhenDone();
        return ret;
    }

    /**
     * Stop all playing sounds.
     * @example
     * Shaku.sfx.stopAll();
     */
    stopAll()
    {
        let playingSounds = Array.from(this._playingSounds);
        for (let sound of playingSounds) {
            sound.stop();
        }
        this._playingSounds = new Set();
    }

    /**
     * Dispose any sound instance that isn't playing at the moment.
     * Note: if you hold the instance externally and try to use it, it may break.
     */
    cleanup()
    {
        let notDisposedSounds = Array.from(this._soundsNotDisposed);
        for (let sound of notDisposedSounds) {
            if (!sound.isPlaying) {
                sound.dispose();
            }
        }
        this._soundsNotDisposed = new Set();
    }

    /**
     * Get currently playing sounds count.
     * @returns {Number} Number of sounds currently playing.
     */
    get playingSoundsCount()
    {
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
    createSound(sound)
    {
        if (!(sound instanceof SoundAsset)) { throw new Error("Sound type must be an instance of SoundAsset!"); }
        var ret = new SoundInstance(this, sound.url);
        return ret;
    }

    /**
     * Get master volume.
     * This affect all sound effects volumes.
     * @returns {Number} Current master volume value.
     */
    get masterVolume()
    {
        return SoundInstance._masterVolume;
    }
    
    /**
     * Set master volume.
     * This affect all sound effects volumes.
     * @param {Number} value Master volume to set.
     */
    set masterVolume(value)
    {
        SoundInstance._masterVolume = value;
        return value;
    }
}

// export main object
module.exports = new Sfx();