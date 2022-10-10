export = SoundMixer;
/**
 * A utility class to mix between two sounds.
 */
declare class SoundMixer {
    /**
     * Create the sound mixer.
     * @param {SoundInstance} sound1 Sound to mix from. Can be null to just fade in.
     * @param {SoundInstance} sound2 Sound to mix to. Can be null to just fade out.
     * @param {Boolean} allowOverlapping If true (default), will mix while overlapping sounds.
     *                                   If false, will first finish first sound before begining next.
     */
    constructor(sound1: SoundInstance, sound2: SoundInstance, allowOverlapping: boolean);
    _sound1: SoundInstance;
    _sound2: SoundInstance;
    fromSoundVolume: number;
    toSoundVolume: number;
    allowOverlapping: boolean;
    /**
     * Stop both sounds.
     */
    stop(): void;
    /**
     * Get first sound.
     * @returns {SoundInstance} First sound instance.
     */
    get fromSound(): SoundInstance;
    /**
     * Get second sound.
     * @returns {SoundInstance} Second sound instance.
     */
    get toSound(): SoundInstance;
    /**
     * Return current progress.
     * @returns {Number} Mix progress from 0 to 1.
     */
    get progress(): number;
    /**
     * Update the mixer progress with time delta instead of absolute value.
     * @param {Number} delta Progress delta, in seconds.
     */
    updateDelta(delta: number): void;
    /**
     * Update the mixer progress.
     * @param {Number} progress Transition progress from sound1 to sound2. Values must be between 0.0 to 1.0.
     */
    update(progress: number): void;
    _progress: number;
}
import SoundInstance = require("./sound_instance.js");
//# sourceMappingURL=sound_mixer.d.ts.map