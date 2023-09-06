import { MathHelper } from "./math_helper";

/**
 * Implement a color.
 * All color components are expected to be in 0.0 - 1.0 range (and not 0-255).
 */
export class Color {
	// cspell: disable
	/* eslint-disable @typescript-eslint/no-use-before-define */
	public static readonly aliceblue = hexToColor("#f0f8ff");
	public static readonly antiquewhite = hexToColor("#faebd7");
	public static readonly aqua = hexToColor("#00ffff");
	public static readonly aquamarine = hexToColor("#7fffd4");
	public static readonly azure = hexToColor("#f0ffff");
	public static readonly beige = hexToColor("#f5f5dc");
	public static readonly bisque = hexToColor("#ffe4c4");
	public static readonly black = hexToColor("#000000");
	public static readonly blanchedalmond = hexToColor("#ffebcd");
	public static readonly blue = hexToColor("#0000ff");
	public static readonly blueviolet = hexToColor("#8a2be2");
	public static readonly brown = hexToColor("#a52a2a");
	public static readonly burlywood = hexToColor("#deb887");
	public static readonly cadetblue = hexToColor("#5f9ea0");
	public static readonly chartreuse = hexToColor("#7fff00");
	public static readonly chocolate = hexToColor("#d2691e");
	public static readonly coral = hexToColor("#ff7f50");
	public static readonly cornflowerblue = hexToColor("#6495ed");
	public static readonly cornsilk = hexToColor("#fff8dc");
	public static readonly crimson = hexToColor("#dc143c");
	public static readonly cyan = hexToColor("#00ffff");
	public static readonly darkblue = hexToColor("#00008b");
	public static readonly darkcyan = hexToColor("#008b8b");
	public static readonly darkgoldenrod = hexToColor("#b8860b");
	public static readonly darkgray = hexToColor("#a9a9a9");
	public static readonly darkgreen = hexToColor("#006400");
	public static readonly darkkhaki = hexToColor("#bdb76b");
	public static readonly darkmagenta = hexToColor("#8b008b");
	public static readonly darkolivegreen = hexToColor("#556b2f");
	public static readonly darkorange = hexToColor("#ff8c00");
	public static readonly darkorchid = hexToColor("#9932cc");
	public static readonly darkred = hexToColor("#8b0000");
	public static readonly darksalmon = hexToColor("#e9967a");
	public static readonly darkseagreen = hexToColor("#8fbc8f");
	public static readonly darkslateblue = hexToColor("#483d8b");
	public static readonly darkslategray = hexToColor("#2f4f4f");
	public static readonly darkturquoise = hexToColor("#00ced1");
	public static readonly darkviolet = hexToColor("#9400d3");
	public static readonly deeppink = hexToColor("#ff1493");
	public static readonly deepskyblue = hexToColor("#00bfff");
	public static readonly dimgray = hexToColor("#696969");
	public static readonly dodgerblue = hexToColor("#1e90ff");
	public static readonly firebrick = hexToColor("#b22222");
	public static readonly floralwhite = hexToColor("#fffaf0");
	public static readonly forestgreen = hexToColor("#228b22");
	public static readonly fuchsia = hexToColor("#ff00ff");
	public static readonly gainsboro = hexToColor("#dcdcdc");
	public static readonly ghostwhite = hexToColor("#f8f8ff");
	public static readonly gold = hexToColor("#ffd700");
	public static readonly goldenrod = hexToColor("#daa520");
	public static readonly gray = hexToColor("#808080");
	public static readonly green = hexToColor("#008000");
	public static readonly greenyellow = hexToColor("#adff2f");
	public static readonly honeydew = hexToColor("#f0fff0");
	public static readonly hotpink = hexToColor("#ff69b4");
	public static readonly indianred = hexToColor("#cd5c5c");
	public static readonly indigo = hexToColor("#4b0082");
	public static readonly ivory = hexToColor("#fffff0");
	public static readonly khaki = hexToColor("#f0e68c");
	public static readonly lavender = hexToColor("#e6e6fa");
	public static readonly lavenderblush = hexToColor("#fff0f5");
	public static readonly lawngreen = hexToColor("#7cfc00");
	public static readonly lemonchiffon = hexToColor("#fffacd");
	public static readonly lightblue = hexToColor("#add8e6");
	public static readonly lightcoral = hexToColor("#f08080");
	public static readonly lightcyan = hexToColor("#e0ffff");
	public static readonly lightgoldenrodyellow = hexToColor("#fafad2");
	public static readonly lightgrey = hexToColor("#d3d3d3");
	public static readonly lightgreen = hexToColor("#90ee90");
	public static readonly lightpink = hexToColor("#ffb6c1");
	public static readonly lightsalmon = hexToColor("#ffa07a");
	public static readonly lightseagreen = hexToColor("#20b2aa");
	public static readonly lightskyblue = hexToColor("#87cefa");
	public static readonly lightslategray = hexToColor("#778899");
	public static readonly lightsteelblue = hexToColor("#b0c4de");
	public static readonly lightyellow = hexToColor("#ffffe0");
	public static readonly lime = hexToColor("#00ff00");
	public static readonly limegreen = hexToColor("#32cd32");
	public static readonly linen = hexToColor("#faf0e6");
	public static readonly magenta = hexToColor("#ff00ff");
	public static readonly maroon = hexToColor("#800000");
	public static readonly mediumaquamarine = hexToColor("#66cdaa");
	public static readonly mediumblue = hexToColor("#0000cd");
	public static readonly mediumorchid = hexToColor("#ba55d3");
	public static readonly mediumpurple = hexToColor("#9370d8");
	public static readonly mediumseagreen = hexToColor("#3cb371");
	public static readonly mediumslateblue = hexToColor("#7b68ee");
	public static readonly mediumspringgreen = hexToColor("#00fa9a");
	public static readonly mediumturquoise = hexToColor("#48d1cc");
	public static readonly mediumvioletred = hexToColor("#c71585");
	public static readonly midnightblue = hexToColor("#191970");
	public static readonly mintcream = hexToColor("#f5fffa");
	public static readonly mistyrose = hexToColor("#ffe4e1");
	public static readonly moccasin = hexToColor("#ffe4b5");
	public static readonly navajowhite = hexToColor("#ffdead");
	public static readonly navy = hexToColor("#000080");
	public static readonly oldlace = hexToColor("#fdf5e6");
	public static readonly olive = hexToColor("#808000");
	public static readonly olivedrab = hexToColor("#6b8e23");
	public static readonly orange = hexToColor("#ffa500");
	public static readonly orangered = hexToColor("#ff4500");
	public static readonly orchid = hexToColor("#da70d6");
	public static readonly palegoldenrod = hexToColor("#eee8aa");
	public static readonly palegreen = hexToColor("#98fb98");
	public static readonly paleturquoise = hexToColor("#afeeee");
	public static readonly palevioletred = hexToColor("#d87093");
	public static readonly papayawhip = hexToColor("#ffefd5");
	public static readonly peachpuff = hexToColor("#ffdab9");
	public static readonly peru = hexToColor("#cd853f");
	public static readonly pink = hexToColor("#ffc0cb");
	public static readonly plum = hexToColor("#dda0dd");
	public static readonly powderblue = hexToColor("#b0e0e6");
	public static readonly purple = hexToColor("#800080");
	public static readonly rebeccapurple = hexToColor("#663399");
	public static readonly red = hexToColor("#ff0000");
	public static readonly rosybrown = hexToColor("#bc8f8f");
	public static readonly royalblue = hexToColor("#4169e1");
	public static readonly saddlebrown = hexToColor("#8b4513");
	public static readonly salmon = hexToColor("#fa8072");
	public static readonly sandybrown = hexToColor("#f4a460");
	public static readonly seagreen = hexToColor("#2e8b57");
	public static readonly seashell = hexToColor("#fff5ee");
	public static readonly sienna = hexToColor("#a0522d");
	public static readonly silver = hexToColor("#c0c0c0");
	public static readonly skyblue = hexToColor("#87ceeb");
	public static readonly slateblue = hexToColor("#6a5acd");
	public static readonly slategray = hexToColor("#708090");
	public static readonly snow = hexToColor("#fffafa");
	public static readonly springgreen = hexToColor("#00ff7f");
	public static readonly steelblue = hexToColor("#4682b4");
	public static readonly tan = hexToColor("#d2b48c");
	public static readonly teal = hexToColor("#008080");
	public static readonly thistle = hexToColor("#d8bfd8");
	public static readonly tomato = hexToColor("#ff6347");
	public static readonly turquoise = hexToColor("#40e0d0");
	public static readonly violet = hexToColor("#ee82ee");
	public static readonly wheat = hexToColor("#f5deb3");
	public static readonly white = hexToColor("#ffffff");
	public static readonly whitesmoke = hexToColor("#f5f5f5");
	public static readonly yellow = hexToColor("#ffff00");
	public static readonly yellowgreen = hexToColor("#9acd32");

	public static readonly transparent = new Color(0, 0, 0, 0);
	public static readonly transwhite = new Color(1, 1, 1, 0);
	/* eslint-enable @typescript-eslint/no-use-before-define */
	// cspell: enable

	private r: number;
	private g: number;
	private b: number;
	private a?: number;
	private asHex: string | null;

	/**
	 * Create the color.
	 * @param r Color red component (value range: 0-1).
	 * @param g Color green component (value range: 0-1).
	 * @param b Color blue component (value range: 0-1).
	 * @param a Color alpha component (value range: 0-1).
	 */
	public constructor(r: number, g: number, b: number, a?: number) {
		this.set(r, g, b, a);
	}

	/**
	 * Set the color components.
	 * @param r Color red component (value range: 0-1).
	 * @param g Color green component (value range: 0-1).
	 * @param b Color blue component (value range: 0-1).
	 * @param a Color alpha component (value range: 0-1).
	 * @returns this.
	 */
	public set(r: number, g: number, b: number, a = 1): Color {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = (a === undefined) ? 1 : a;
		this.asHex = null;
		return this;
	}

	/**
	 * Set the color components from byte values (0-255).
	 * @param r Color red component (value range: 0-255).
	 * @param g Color green component (value range: 0-255).
	 * @param b Color blue component (value range: 0-255).
	 * @param a Color alpha component (value range: 0-255).
	 * @returns this.
	 */
	public setByte(r: number, g: number, b: number, a?: number): Color {
		this.r = r / 255.0;
		this.g = g / 255.0;
		this.b = b / 255.0;
		this.a = (a === undefined) ? 1 : (a / 255.0);
		this.asHex = null;
		return this;
	}

	/**
	 * Copy all component values from another color.
	 * @param other Color to copy values from.
	 * @returns this.
	 */
	public copy(other: Color): Color {
		this.set(other.r, other.g, other.b, other.a);
		return this;
	}

	/**
	 * Get r component.
	 * @returns Red component.
	 */
	public getR(): number {
		return this.r;
	}

	/**
	 * Get g component.
	 * @returns Green component.
	 */
	public getG(): number {
		return this.g;
	}

	/**
	 * Get b component.
	 * @returns Blue component.
	 */
	public getB(): number {
		return this.b;
	}

	/**
	 * Get a component.
	 * @returns Alpha component.
	 */
	public getA(): number {
		return this.a;
	}

	/**
	 * Set r component.
	 * @returns Red component after change.
	 */
	public setR(val: number): void {
		this.r = val;
		this.asHex = null;
		return this.r;
	}

	/**
	 * Set g component.
	 * @returns Green component after change.
	 */
	public setG(val: number): void {
		this.g = val;
		this.asHex = null;
		return this.g;
	}

	/**
	 * Set b component.
	 * @returns Blue component after change.
	 */
	public setB(val: number): void {
		this.b = val;
		this.asHex = null;
		return this.b;
	}

	/**
	 * Set a component.
	 * @returns Alpha component after change.
	 */
	public setA(val: number) {
		this.a = val;
		this.asHex = null;
		return this.a;
	}

	/**
	 * Convert a single component to hex value.
	 * @param c Value to convert to hex.
	 * @returns Component as hex value.
	 */
	public static componentToHex(c: number): string {
		const hex = Math.round(c).toString(16);
		return hex.length === 1 ? "0" + hex : hex;
	}

	/**
	 * Convert this color to hex string (starting with "#").
	 * @returns Color as hex.
	 */
	public getAsHex(): string {
		if(!this.asHex) {
			this.asHex = "#"
				+ Color.componentToHex(this.r * 255)
				+ Color.componentToHex(this.g * 255)
				+ Color.componentToHex(this.b * 255)
				+ Color.componentToHex(this.a * 255);
		}
		return this.asHex;
	}

	/**
	 * Create color from hex value.
	 * @param val Number value (hex), as #rrggbbaa.
	 * @returns New color value.
	 */
	public static fromHex(val: string): Color {
		if(typeof val !== "string" && val[0] !== "#") throw new Error("Invalid color format!");
		const parsed = hexToColor(val);
		if(!parsed) throw new Error("Invalid hex value to parse!");
		return new Color(parsed.r, parsed.g, parsed.b, 1);
	}

	/**
	 * Create color from decimal value.
	 * @param val Number value (int).
	 * @param includeAlpha If true, will include alpha value.
	 * @returns New color value.
	 */
	public static fromDecimal(val: number, includeAlpha: number): Color {
		const ret = new Color(1, 1, 1, 1);
		if(includeAlpha) ret.a = (val & 0xff) / 255.0; val = val >> 8;
		ret.b = (val & 0xff) / 255.0; val = val >> 8;
		ret.g = (val & 0xff) / 255.0; val = val >> 8;
		ret.r = (val & 0xff) / 255.0;
		return ret;
	}

	/**
	 * Create color from a dictionary.
	 * @param data Dictionary with {r,g,b,a}.
	 * @returns Newly created color.
	 */
	public static fromDict(data: Partial<SerializedColor>): Color {
		return new Color(
			data.r ?? 1,
			data.g ?? 1,
			data.b ?? 1,
			data.a ?? 1,
		);
	}

	/**
	 * Convert to dictionary.
	 * @param minimized If true, will not include keys that their values are 1. You can use fromDict on minimized dicts.
	 * @returns Dictionary with {r,g,b,a}
	 */
	public toDict(minimized: true): Partial<SerializedColor>;
	public toDict(minimized?: false): SerializedColor;
	public toDict(minimized?: boolean): Partial<SerializedColor> {
		if(minimized) {
			const ret: Partial<SerializedColor> = {};
			if(this.r !== 1) ret.r = this.r;
			if(this.g !== 1) ret.g = this.g;
			if(this.b !== 1) ret.b = this.b;
			if(this.a !== 1) ret.a = this.a;
			return ret;
		}
		return { r: this.r, g: this.g, b: this.b, a: this.a };
	}

	/**
	 * Convert this color to decimal number.
	 * @returns Color as decimal RGBA.
	 */
	public getAsDecimalRGBA(): number {
		return ((Math.round(this.r * 255) << (8 * 3)) | (Math.round(this.g * 255) << (8 * 2)) | (Math.round(this.b * 255) << (8 * 1)) | (Math.round(this.a * 255))) >>> 0;
	}

	/**
	 * Convert this color to decimal number.
	 * @returns Color as decimal ARGB.
	 */
	public getAsDecimalABGR(): number {
		return ((Math.round(this.a * 255) << (8 * 3))
			| (Math.round(this.b * 255) << (8 * 2))
			| (Math.round(this.g * 255) << (8 * 1))
			| (Math.round(this.r * 255))) >>> 0;
	}

	/**
	 * Convert this color to a float array.
	 */
	public getFloatArray() {
		return [this.r, this.g, this.b, this.a];
	}

	/**
	 * Return a clone of this color.
	 * @returns Cloned color.
	 */
	public clone(): Color {
		return new Color(this.r, this.g, this.b, this.a);
	}

	/**
	 * Convert to string.
	 */
	public string(): string {
		return this.r + "," + this.g + "," + this.b + "," + this.a;
	}

	/**
	 * Get if this color is pure black (ignoring alpha).
	 */
	public isBlack(): boolean {
		return this.r === 0 && this.g === 0 && this.b === 0;
	}

	/**
	 * Return a random color.
	 * @param includeAlpha If true, will also randomize alpha.
	 * @returns Randomized color.
	 */
	public static random(includeAlpha: boolean): Color {
		return new Color(Math.random(), Math.random(), Math.random(), includeAlpha ? Math.random() : 1);
	}

	/**
	 * Build and return new color from bytes array.
	 * @param bytes Bytes array to build color from.
	 * @param offset Optional offset to read bytes from.
	 * @returns Newly created color.
	 */
	public static fromBytesArray(bytes: [number, number, number, number]): Color;
	public static fromBytesArray(bytes: number[] | Uint8ClampedArray, offset?: number): Color;
	public static fromBytesArray(bytes: [number, number, number, number] | number[] | Uint8ClampedArray, offset?: number): Color {
		offset = offset || 0;
		return new Color(bytes[offset] / 255, bytes[offset + 1] / 255, bytes[offset + 2] / 255, (bytes[offset + 3] !== undefined) ? (bytes[offset + 3] / 255) : 1);
	}

	/**
	 * Get if this color is transparent black.
	 */
	public isTransparentBlack(): boolean {
		return this.r === this.g
			&& this.g === this.b
			&& this.b === this.a
			&& this.a === 0;
	}

	/**
	 * Get array with all built-in web color names.
	 * @returns Array with color names.
	 */
	public static getWebColorNames(): string[] {
		return colorKeys;
	}

	/**
	 * Check if equal to another color.
	 * @param other Other color to compare to.
	 */
	public equals(other: Color): boolean {
		return (this === other)
			|| (other &&
				(other.constructor === this.constructor) &&
				(this.r === other.r) &&
				(this.g === other.g) &&
				(this.b === other.b) &&
				(this.a === other.a));
	}

	/**
	 * Lerp between two colors.
	 * @param p1 First color.
	 * @param p2 Second color.
	 * @param a Lerp factor (0.0 - 1.0).
	 * @returns result color.
	 */
	public static lerp(p1: Color, p2: Color, a: number): Color {
		const lerpScalar = MathHelper.lerp;
		return new Color(lerpScalar(p1.r, p2.r, a),
			lerpScalar(p1.g, p2.g, a),
			lerpScalar(p1.b, p2.b, a),
			lerpScalar(p1.a, p2.a, a)
		);
	}
}

export interface SerializedColor {
	r: number;
	g: number;
	b: number;
	a: number;
}

/**
 * Convert Hex value to Color instance.
 * @param hex Hex value to parse.
 */
function hexToColor(hex: string) {
	// expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		return r + r + g + g + b + b;
	});

	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	const components = result ? {
		r: parseInt(result[1], 16) / 255.0,
		g: parseInt(result[2], 16) / 255.0,
		b: parseInt(result[3], 16) / 255.0,
	} : null;

	// create Color instance
	if(!components) throw new Error("Invalid hex value to parse!");
	return new Color(components.r, components.g, components.b, 1);
}
