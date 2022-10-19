export = SeededRandom;
/**
 * Class to generate random numbers with seed.
 */
declare class SeededRandom {
    /**
     * Create the seeded random object.
     * @param {Number} seed Seed to start from. If not provided, will use 0.
     */
    constructor(seed: number);
    seed: number;
    /**
     * Get next random value.
     * @param {Number} min Optional min value. If max is not provided, this will be used as max.
     * @param {Number} max Optional max value.
     * @returns {Number} A randomly generated value.
     */
    random(min: number, max: number): number;
    /**
     * Pick a random value from array.
     * @param {Array} options Options to pick random value from.
     * @returns {*} Random value from options array.
     */
    pick(options: any[]): any;
}
//# sourceMappingURL=seeded_random.d.ts.map