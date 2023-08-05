/**
 * Class to generate random numbers with seed.
 */
export class SeededRandom {
	public seed: number;

	/**
	 * Create the seeded random object.
	 * @param seed Seed to start from. If not provided, will use 0.
	 */
	public constructor(seed?: number) {
		if(seed === undefined) { seed = 0; }
		this.seed = seed;
	}

	/**
	 * Get next random value.
	 * @param min Optional min value. If max is not provided, this will be used as max.
	 * @param max Optional max value.
	 * @returns A randomly generated value.
	 */
	public random(min?: number, max?: number): number {
		// generate next value
		this.seed = (this.seed * 9301 + 49297) % 233280;
		let rnd = this.seed / 233280;

		// got min and max?
		if(min && max) {
			return min + rnd * (max - min);
		}
		// got only min (used as max)?
		else if(min) {
			return rnd * min;
		}
		// no min nor max provided
		return rnd;
	}

	/**
	 * Pick a random value from array.
	 * @param options Options to pick random value from.
	 * @returns Random value from options array.
	 */
	public pick<T>(options: T[]): T {
		return options[Math.floor(this.random(options.length))];
	}
}
