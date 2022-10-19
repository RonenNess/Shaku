export = SoundInstance;
/**
 * A sound effect instance you can play and stop.
 */
declare class SoundInstance {
    /**
    * Create a sound instance.
    * @param {Sfx} sfxManager Sfx manager instance.
    * @param {String} url Sound URL or source.
    */
    constructor(sfxManager: Sfx, url: string);
    _sfx: Sfx;
    _audio: HTMLAudioElement;
    _volume: number;
    /**
     * Dispose the audio object when done playing the sound.
     * This will call dispose() automatically when audio ends.
     */
    disposeWhenDone(): void;
    /**
     * Dispose the audio object and clear its resources.
     * When playing lots of sounds its important to call dispose on sounds you no longer use, to avoid getting hit by
     * "Blocked attempt to create a WebMediaPlayer" exception.
     */
    dispose(): void;
    /**
    * Play sound.
    * @returns {Promise} Promise to return when sound start playing.
    */
    play(): Promise<any>;
    /**
    * Set playback rate.
    * @param {Number} val Playback value to set.
    */
    set playbackRate(arg: number);
    /**
    * Get sound effect playback rate.
    * @returns {Number} Playback rate.
    */
    get playbackRate(): number;
    /**
    * Set if to preserve pitch while changing playback rate.
    * @param {Boolean} val New preserve pitch value to set.
    */
    set preservesPitch(arg: boolean);
    /**
    * Get if to preserve pitch while changing playback rate.
    * @returns {Boolean} Preserve pitch state of the sound instance.
    */
    get preservesPitch(): boolean;
    /**
    * Pause the sound.
    */
    pause(): void;
    /**
    * Replay sound from start.
    * @returns {Promise} Promise to return when sound start playing.
    */
    replay(): Promise<any>;
    /**
    * Stop the sound and go back to start.
    * @returns {Boolean} True if successfully stopped sound, false otherwise.
    */
    stop(): boolean;
    /**
    * Set current time in track.
    * @param {Number} value Set current playing time in sound track.
    */
    set currentTime(arg: number);
    /**
    * Get current time in track.
    * @returns {Number} Current time in playing sound.
    */
    get currentTime(): number;
    /**
    * Set if playing in loop.
    * @param {Boolean} value If this sound should play in loop.
    */
    set loop(arg: boolean);
    /**
    * Get if playing in loop.
    * @returns {Boolean} If this sound should play in loop.
    */
    get loop(): boolean;
    /**
    * Set volume.
    * @param {Number} value Sound effect volume to set.
    */
    set volume(arg: number);
    /**
    * Get volume.
    * @returns {Number} Sound effect volume.
    */
    get volume(): number;
    /**
    * Get track duration.
    * @returns {Number} Sound duration in seconds.
    */
    get duration(): number;
    /**
    * Get if sound is currently paused.
    * @returns {Boolean} True if sound is currently paused.
    */
    get paused(): boolean;
    /**
    * Get if sound is currently playing.
    * @returns {Boolean} True if sound is currently playing.
    */
    get playing(): boolean;
    /**
    * Get if finished playing.
    * @returns {Boolean} True if sound reached the end and didn't loop.
    */
    get finished(): boolean;
}
declare namespace SoundInstance {
    const _masterVolume: number;
}
//# sourceMappingURL=sound_instance.d.ts.map