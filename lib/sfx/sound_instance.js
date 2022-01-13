/**
 * Implement a sound effect instance.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\sfx\sound_instance.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const _logger = require('../logger.js').getLogger('sfx');


/**
 * A sound effect instance you can play and stop.
 */
class SoundInstance
{
    /**
    * Create a sound instance.
    * @param {Sfx} sfxManager Sfx manager instance.
    * @param {String} url Sound URL or source.
    */
    constructor(sfxManager, url)
    {
        if (!url) {
            _logger.error("Sound type can't be null or invalid!");
            throw new Error("Invalid sound type to play in SoundInstance!");
        }
        this._sfx = sfxManager;
        this._audio = new Audio(url);
        this._volume = 1;
    }

    /**
    * Play sound.
    */
    play()
    {
        if (this.playing) { return; }
        this._audio.play();
        this._sfx._playingSounds.add(this);
    }

    /**
    * Get sound effect playback rate.
    * @returns {Number} Playback rate.
    */
    get playbackRate()
    {
        return this._audio.playbackRate;
    }

    /**
    * Set playback rate.
    * @param {Number} val Playback value to set.
    */
    set playbackRate(val)
    {
        if (val < 0.1) { _logger.error("playbackRate value set is too low, value was capped to 0.1."); }
        if (val > 10) { _logger.error("playbackRate value set is too high, value was capped to 10."); }
        this._audio.playbackRate = val;
    }
    
    /**
    * Get if to preserve pitch while changing playback rate.
    * @returns {Boolean} Preserve pitch state of the sound instance.
    */
    get preservesPitch()
    {
        return Boolean(this._audio.preservesPitch || this._audio.mozPreservesPitch);
    }

    /**
    * Set if to preserve pitch while changing playback rate.
    * @param {Boolean} val New preserve pitch value to set.
    */
    set preservesPitch(val)
    {
        return this._audio.preservesPitch = this._audio.mozPreservesPitch = Boolean(val);
    }

    /**
    * Pause the sound.
    */
    pause()
    {
        this._audio.pause();
    }

    /**
    * Replay sound from start.
    */
    replay()
    {
        this.stop();
        this.play();
    }

    /**
    * Stop the sound and go back to start.
    */
    stop()
    {
        this.pause();
        this.currentTime = 0;
    }

    /**
    * Get if playing in loop.
    * @returns {Boolean} If this sound should play in loop.
    */
    get loop()
    {
        return this._audio.loop;
    }

    /**
    * Set if playing in loop.
    * @param {Boolean} value If this sound should play in loop.
    */
    set loop(value)
    {
        this._audio.loop = value;
        return this._audio.loop;
    }

    /**
    * Get volume.
    * @returns {Number} Sound effect volume.
    */
    get volume()
    {
        return this._volume;
    }

    /**
    * Set volume.
    * @param {Number} value Sound effect volume to set.
    */
    set volume(value)
    {
        this._volume = value;
        var volume = (value * SoundInstance._masterVolume);
        if (volume < 0) { volume = 0; }
        if (volume > 1) { volume = 1; }
        this._audio.volume = volume;
        return this._volume;
    }

    /**
    * Get current time in track.
    * @returns {Number} Current time in playing sound.
    */
    get currentTime()
    {
        return this._audio.currentTime;
    }

    /**
    * Set current time in track.
    * @param {Number} value Set current playing time in sound track.
    */
    set currentTime(value)
    {
        return this._audio.currentTime = value;
    }

    /**
    * Get track duration.
    * @returns {Number} Sound duration in seconds.
    */
    get duration()
    {
        return this._audio.duration;
    }

    /**
    * Get if sound is currently paused.
    * @returns {Boolean} True if sound is currently paused.
    */
    get paused()
    {
        return this._audio.paused;
    }

    /**
    * Get if sound is currently playing.
    * @returns {Boolean} True if sound is currently playing.
    */
    get playing()
    {
        return !this.paused && !this.finished;
    }

    /**
    * Get if finished playing.
    * @returns {Boolean} True if sound reached the end and didn't loop.
    */
    get finished()
    {
        return this._audio.ended;
    }
}


// master volume
SoundInstance._masterVolume = 1;


// export main object
module.exports = SoundInstance;