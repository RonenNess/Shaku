export = Animator;
/**
 * Implement an animator object that change values over time using Linear Interpolation.
 * Usage example:
 * (new Animator(sprite)).from({'position.x': 0}).to({'position.x': 100}).duration(1).play();
 */
declare class Animator {
    /**
     * Update all auto animators.
     * @private
     * @param {Number} delta Delta time in seconds.
     */
    private static updatePlayingAnimations;
    /**
     * Create the animator.
     * @param {*} target Any object you want to animate.
     */
    constructor(target: any);
    _target: any;
    _fromValues: {};
    _toValues: {};
    _progress: number;
    _onFinish: Function;
    _smoothDamp: boolean;
    _repeats: boolean;
    _repeatsWithReverseAnimation: boolean;
    _isInAutoUpdate: boolean;
    _originalFrom: {};
    _originalTo: {};
    _originalRepeats: number | boolean;
    /**
     * Speed factor to multiply with delta every time this animator updates.
     */
    speedFactor: number;
    /**
     * Update this animator with a given delta time.
     * @param {Number} delta Delta time to progress this animator by.
     */
    update(delta: number): void;
    /**
     * Set a method to run when animation ends.
     * @param {Function} callback Callback to invoke when done.
     * @returns {Animator} this.
     */
    then(callback: Function): Animator;
    /**
     * Set smooth damp.
     * If true, lerping will go slower as the animation reach its ending.
     * @param {Boolean} enable set smooth damp mode.
     * @returns {Animator} this.
     */
    smoothDamp(enable: boolean): Animator;
    /**
     * Set if the animator should repeat itself.
     * @param {Boolean|Number} enable false to disable repeating, true for endless repeats, or a number for limited number of repeats.
     * @param {Boolean} reverseAnimation if true, it will reverse animation to repeat it instead of just "jumping" back to starting state.
     * @returns {Animator} this.
     */
    repeats(enable: boolean | number, reverseAnimation: boolean): Animator;
    /**
     * If true, will reverse animation back to start values after done.
     * This is equivalent to calling `repeats(1, true)`.
     * @returns {Animator} this.
     */
    reverseBackToStart(): Animator;
    /**
     * Set 'from' values.
     * You don't have to provide 'from' values, when a value is not set the animator will just take whatever was set in target when first update is called.
     * @param {*} values Values to set as 'from' values.
     * Key = property name in target (can contain dots for nested), value = value to start animation from.
     * @returns {Animator} this.
     */
    from(values: any): Animator;
    /**
     * Set 'to' values, ie the result when animation ends.
     * @param {*} values Values to set as 'to' values.
     * Key = property name in target (can contain dots for nested), value = value to start animation from.
     * @returns {Animator} this.
     */
    to(values: any): Animator;
    /**
     * Flip between the 'from' and the 'to' states.
     */
    flipFromAndTo(): void;
    /**
     * Make this Animator update automatically with the gameTime delta time.
     * Note: this will change the speedFactor property.
     * @param {Number} seconds Animator duration time in seconds.
     * @returns {Animator} this.
     */
    duration(seconds: number): Animator;
    /**
     * Reset animator progress.
     * @returns {Animator} this.
     */
    reset(): Animator;
    /**
     * Make this Animator update automatically with the gameTime delta time, until its done.
     * @returns {Animator} this.
     */
    play(): Animator;
    /**
     * Get if this animator finished.
     * @returns {Boolean} True if animator finished.
     */
    get ended(): boolean;
    #private;
}
//# sourceMappingURL=animator.d.ts.map