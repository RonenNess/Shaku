// import some utilities
import MathHelper from "./math_helper";

const lerp = MathHelper.lerp;

// do fade
function fade(t: number): number {
	return t * t * t * (t * (t * 6 - 15) + 10);
}

class Grad {
	public x: number;
	public y: number;
	public z: number;

	public constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	public dot2(x: number, y: number): number {
		return this.x * x + this.y * y;
	}
}

// const premutations
const p = [151, 160, 137, 91, 90, 15,
	131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
	190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
	88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
	77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
	102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
	135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
	5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
	223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
	129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
	251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
	49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
	138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];

/**
 * Generate 2d perlin noise.
 * Based on code from noisejs by Stefan Gustavson.
 * https://github.com/josephg/noisejs/blob/master/perlin.js
 */
export default class Perlin {
	private _perm: number[];
	private _gradP: Grad[];

	/**
	 * Create the perlin noise generator.
	 * @param seed Seed for perlin noise, or undefined for random.
	 */
	constructor(seed?: number) {
		if(seed === undefined) { seed = Math.random(); }
		this.seed(seed);
	}

	/**
	 * Set the perlin noise seed.
	 * @param seed New seed value. May be either a decimal between 0 to 1, or an unsigned short between 0 to 65536.
	 */
	public seed(seed: number) {
		// scale the seed out
		if(seed > 0 && seed < 1) {
			seed *= 65536;
		}

		// make sure round and current number of bits
		seed = Math.floor(seed);
		if(seed < 256) {
			seed |= seed << 8;
		}

		// create perm, gradP and grad3 arrays
		var perm = new Array(512);
		var gradP = new Array(512);
		var grad3 = [new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0),
		new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1),
		new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1)];

		// apply seed
		for(var i = 0; i < 256; i++) {
			var v;
			if(i & 1) {
				v = p[i] ^ (seed & 255);
			} else {
				v = p[i] ^ ((seed >> 8) & 255);
			}

			perm[i] = perm[i + 256] = v;
			gradP[i] = gradP[i + 256] = grad3[v % 12];
		}

		// store new params
		this._perm = perm;
		this._gradP = gradP;
	}

	/**
	 * Generate a perlin noise value for x,y coordinates.
	 * @param x X coordinate to generate perlin noise for.
	 * @param y Y coordinate to generate perlin noise for.
	 * @param blurDistance Distance to take neighbors to blur returned value with. Defaults to 0.25.
	 * @param contrast Optional contrast factor.
	 * @returns Perlin noise value for given point.
	 */
	public generateSmooth(x: number, y: number, blurDistance: number, contrast: number): number {
		if(blurDistance === undefined) {
			blurDistance = 0.25;
		}
		let a = this.generate(x - blurDistance, y - blurDistance, contrast);
		let b = this.generate(x + blurDistance, y + blurDistance, contrast);
		let c = this.generate(x - blurDistance, y + blurDistance, contrast);
		let d = this.generate(x + blurDistance, y - blurDistance, contrast);
		return (a + b + c + d) / 4;
	}

	/**
	 * Generate a perlin noise value for x,y coordinates.
	 * @param x X coordinate to generate perlin noise for.
	 * @param y Y coordinate to generate perlin noise for.
	 * @param contrast Optional contrast factor.
	 * @returns Perlin noise value for given point, ranged from 0 to 1.
	 */
	public generate(x: number, y: number, contrast: number): number {
		// default contrast
		if(contrast === undefined) {
			contrast = 1;
		}

		// store new params
		let perm = this._perm;
		let gradP = this._gradP;

		// find unit grid cell containing point
		var X = Math.floor(x), Y = Math.floor(y);

		// get relative xy coordinates of point within that cell
		x = x - X; y = y - Y;

		// wrap the integer cells at 255 (smaller integer period can be introduced here)
		X = X & 255; Y = Y & 255;

		// calculate noise contributions from each of the four corners
		var n00 = gradP[X + perm[Y]].dot2(x, y) * contrast;
		var n01 = gradP[X + perm[Y + 1]].dot2(x, y - 1) * contrast;
		var n10 = gradP[X + 1 + perm[Y]].dot2(x - 1, y) * contrast;
		var n11 = gradP[X + 1 + perm[Y + 1]].dot2(x - 1, y - 1) * contrast;

		// compute the fade curve value for x
		var u = fade(x);

		// interpolate the four results
		return Math.min(lerp(
			lerp(n00, n10, u),
			lerp(n01, n11, u),
			fade(y)) + 0.5, 1);
	};
}
