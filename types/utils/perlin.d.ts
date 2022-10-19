export = Perlin;
/**
 * Generate 2d perlin noise.
 * Based on code from noisejs by Stefan Gustavson.
 * https://github.com/josephg/noisejs/blob/master/perlin.js
 */
declare class Perlin {
    /**
     * Create the perlin noise generator.
     * @param {Number} seed Seed for perlin noise, or undefined for random.
     */
    constructor(seed: number);
    /**
     * Set the perlin noise seed.
     * @param {Number} seed New seed value. May be either a decimal between 0 to 1, or an unsigned short between 0 to 65536.
     */
    seed(seed: number): void;
    _perm: any[];
    _gradP: any[];
    /**
     * Generate a perlin noise value for x,y coordinates.
     * @param {Number} x X coordinate to generate perlin noise for.
     * @param {Number} y Y coordinate to generate perlin noise for.
     * @param {Number} blurDistance Distance to take neighbors to blur returned value with. Defaults to 0.25.
     * @param {Number} contrast Optional contrast factor.
     * @returns {Number} Perlin noise value for given point.
     */
    generateSmooth(x: number, y: number, blurDistance: number, contrast: number): number;
    /**
     * Generate a perlin noise value for x,y coordinates.
     * @param {Number} x X coordinate to generate perlin noise for.
     * @param {Number} y Y coordinate to generate perlin noise for.
     * @param {Number} contrast Optional contrast factor.
     * @returns {Number} Perlin noise value for given point, ranged from 0 to 1.
     */
    generate(x: number, y: number, contrast: number): number;
}
//# sourceMappingURL=perlin.d.ts.map