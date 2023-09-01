import { MathHelper } from "./math_helper";

/**
 * Implement a color.
 * All color components are expected to be in 0.0 - 1.0 range (and not 0-255).
 */
export class Color {
	private _r: number;
	private _g: number;
	private _b: number;
	private _a?: number;
	private _asHex: string | null;

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
		this._r = r;
		this._g = g;
		this._b = b;
		this._a = (a === undefined) ? 1 : a;
		this._asHex = null;
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
		this._r = r / 255.0;
		this._g = g / 255.0;
		this._b = b / 255.0;
		this._a = (a === undefined) ? 1 : (a / 255.0);
		this._asHex = null;
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
	public get r(): number {
		return this._r;
	}

	/**
	 * Get g component.
	 * @returns Green component.
	 */
	public get g(): number {
		return this._g;
	}

	/**
	 * Get b component.
	 * @returns Blue component.
	 */
	public get b(): number {
		return this._b;
	}

	/**
	 * Get a component.
	 * @returns Alpha component.
	 */
	public get a(): number {
		return this._a;
	}

	/**
	 * Set r component.
	 * @returns Red component after change.
	 */
	public set r(val: number): void {
		this._r = val;
		this._asHex = null;
		return this._r;
	}

	/**
	 * Set g component.
	 * @returns Green component after change.
	 */
	public set g(val: number): void {
		this._g = val;
		this._asHex = null;
		return this._g;
	}

	/**
	 * Set b component.
	 * @returns Blue component after change.
	 */
	public set b(val: number): void {
		this._b = val;
		this._asHex = null;
		return this._b;
	}

	/**
	 * Set a component.
	 * @returns Alpha component after change.
	 */
	public set a(val: number) {
		this._a = val;
		this._asHex = null;
		return this._a;
	}

	/**
	 * Convert a single component to hex value.
	 * @param c Value to convert to hex.
	 * @returns Component as hex value.
	 */
	public static componentToHex(c: number): string {
		const hex = Math.round(c).toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	/**
	 * Convert this color to hex string (starting with "#").
	 * @returns Color as hex.
	 */
	public get asHex(): string {
		if(!this._asHex) {
			this._asHex = "#" + Color.componentToHex(this.r * 255) + Color.componentToHex(this.g * 255) + Color.componentToHex(this.b * 255) + Color.componentToHex(this.a * 255);
		}
		return this._asHex;
	}

	/**
	 * Create color from hex value.
	 * @param val Number value (hex), as #rrggbbaa.
	 * @returns New color value.
	 */
	public static fromHex(val: string): Color {
		if(typeof val !== "string" && val[0] != "#") {
			throw new PintarJS.Error("Invalid color format!");
		}
		const parsed = hexToColor(val);
		if(!parsed) { throw new Error("Invalid hex value to parse!"); }
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
		if(includeAlpha) { ret.a = (val & 0xff) / 255.0; val = val >> 8; }
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
	public get asDecimalRGBA(): number {
		return ((Math.round(this.r * 255) << (8 * 3)) | (Math.round(this.g * 255) << (8 * 2)) | (Math.round(this.b * 255) << (8 * 1)) | (Math.round(this.a * 255))) >>> 0;
	}

	/**
	 * Convert this color to decimal number.
	 * @returns Color as decimal ARGB.
	 */
	public get asDecimalABGR(): number {
		return ((Math.round(this.a * 255) << (8 * 3)) | (Math.round(this.b * 255) << (8 * 2)) | (Math.round(this.g * 255) << (8 * 1)) | (Math.round(this.r * 255))) >>> 0;
	}

	/**
	 * Convert this color to a float array.
	 */
	public get floatArray() {
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
	public get isBlack(): boolean {
		return this.r == 0 && this.g == 0 && this.b == 0;
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
	public get isTransparentBlack(): boolean {
		return this._r == this._g && this._g == this._b && this._b == this._a && this._a == 0;
	}

	/**
	 * Get array with all built-in web color names.
	 * @returns Array with color names.
	 */
	public static get webColorNames(): string[] {
		return colorKeys;
	}

	/**
	 * Check if equal to another color.
	 * @param other Other color to compare to.
	 */
	public equals(other: Color): boolean {
		return (this === other) ||
			(other && (other.constructor === this.constructor) &&
				(this._r == other._r) && (this._g == other._g) && (this._b == other._b) && (this._a == other._a));
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

// table to convert common color names to hex
const colorNameToHex = {
	"aliceblue": "#f0f8ff",
	"antiquewhite": "#faebd7",
	"aqua": "#00ffff",
	"aquamarine": "#7fffd4",
	"azure": "#f0ffff",
	"beige": "#f5f5dc",
	"bisque": "#ffe4c4",
	"black": "#000000",
	"blanchedalmond": "#ffebcd",
	"blue": "#0000ff",
	"blueviolet": "#8a2be2",
	"brown": "#a52a2a",
	"burlywood": "#deb887",
	"cadetblue": "#5f9ea0",
	"chartreuse": "#7fff00",
	"chocolate": "#d2691e",
	"coral": "#ff7f50",
	"cornflowerblue": "#6495ed",
	"cornsilk": "#fff8dc",
	"crimson": "#dc143c",
	"cyan": "#00ffff",
	"darkblue": "#00008b",
	"darkcyan": "#008b8b",
	"darkgoldenrod": "#b8860b",
	"darkgray": "#a9a9a9",
	"darkgreen": "#006400",
	"darkkhaki": "#bdb76b",
	"darkmagenta": "#8b008b",
	"darkolivegreen": "#556b2f",
	"darkorange": "#ff8c00",
	"darkorchid": "#9932cc",
	"darkred": "#8b0000",
	"darksalmon": "#e9967a",
	"darkseagreen": "#8fbc8f",
	"darkslateblue": "#483d8b",
	"darkslategray": "#2f4f4f",
	"darkturquoise": "#00ced1",
	"darkviolet": "#9400d3",
	"deeppink": "#ff1493",
	"deepskyblue": "#00bfff",
	"dimgray": "#696969",
	"dodgerblue": "#1e90ff",
	"firebrick": "#b22222",
	"floralwhite": "#fffaf0",
	"forestgreen": "#228b22",
	"fuchsia": "#ff00ff",
	"gainsboro": "#dcdcdc",
	"ghostwhite": "#f8f8ff",
	"gold": "#ffd700",
	"goldenrod": "#daa520",
	"gray": "#808080",
	"green": "#008000",
	"greenyellow": "#adff2f",
	"honeydew": "#f0fff0",
	"hotpink": "#ff69b4",
	"indianred ": "#cd5c5c",
	"indigo": "#4b0082",
	"ivory": "#fffff0",
	"khaki": "#f0e68c",
	"lavender": "#e6e6fa",
	"lavenderblush": "#fff0f5",
	"lawngreen": "#7cfc00",
	"lemonchiffon": "#fffacd",
	"lightblue": "#add8e6",
	"lightcoral": "#f08080",
	"lightcyan": "#e0ffff",
	"lightgoldenrodyellow": "#fafad2",
	"lightgrey": "#d3d3d3",
	"lightgreen": "#90ee90",
	"lightpink": "#ffb6c1",
	"lightsalmon": "#ffa07a",
	"lightseagreen": "#20b2aa",
	"lightskyblue": "#87cefa",
	"lightslategray": "#778899",
	"lightsteelblue": "#b0c4de",
	"lightyellow": "#ffffe0",
	"lime": "#00ff00",
	"limegreen": "#32cd32",
	"linen": "#faf0e6",
	"magenta": "#ff00ff",
	"maroon": "#800000",
	"mediumaquamarine": "#66cdaa",
	"mediumblue": "#0000cd",
	"mediumorchid": "#ba55d3",
	"mediumpurple": "#9370d8",
	"mediumseagreen": "#3cb371",
	"mediumslateblue": "#7b68ee",
	"mediumspringgreen": "#00fa9a",
	"mediumturquoise": "#48d1cc",
	"mediumvioletred": "#c71585",
	"midnightblue": "#191970",
	"mintcream": "#f5fffa",
	"mistyrose": "#ffe4e1",
	"moccasin": "#ffe4b5",
	"navajowhite": "#ffdead",
	"navy": "#000080",
	"oldlace": "#fdf5e6",
	"olive": "#808000",
	"olivedrab": "#6b8e23",
	"orange": "#ffa500",
	"orangered": "#ff4500",
	"orchid": "#da70d6",
	"palegoldenrod": "#eee8aa",
	"palegreen": "#98fb98",
	"paleturquoise": "#afeeee",
	"palevioletred": "#d87093",
	"papayawhip": "#ffefd5",
	"peachpuff": "#ffdab9",
	"peru": "#cd853f",
	"pink": "#ffc0cb",
	"plum": "#dda0dd",
	"powderblue": "#b0e0e6",
	"purple": "#800080",
	"rebeccapurple": "#663399",
	"red": "#ff0000",
	"rosybrown": "#bc8f8f",
	"royalblue": "#4169e1",
	"saddlebrown": "#8b4513",
	"salmon": "#fa8072",
	"sandybrown": "#f4a460",
	"seagreen": "#2e8b57",
	"seashell": "#fff5ee",
	"sienna": "#a0522d",
	"silver": "#c0c0c0",
	"skyblue": "#87ceeb",
	"slateblue": "#6a5acd",
	"slategray": "#708090",
	"snow": "#fffafa",
	"springgreen": "#00ff7f",
	"steelblue": "#4682b4",
	"tan": "#d2b48c",
	"teal": "#008080",
	"thistle": "#d8bfd8",
	"tomato": "#ff6347",
	"turquoise": "#40e0d0",
	"violet": "#ee82ee",
	"wheat": "#f5deb3",
	"white": "#ffffff",
	"whitesmoke": "#f5f5f5",
	"yellow": "#ffff00",
	"yellowgreen": "#9acd32",
};

// create getter function for all named color
for(const key in colorNameToHex) {
	const colorValue = hexToColor(colorNameToHex[key as keyof typeof colorNameToHex]);
	(function(_colValue) {

		Object.defineProperty(Color, key, {
			get: function() {
				return _colValue.clone();
			},
		});

	})(colorValue);
}

// built-in color keys
const colorKeys = Object.keys(colorNameToHex);
Object.freeze(colorKeys);

// add transparent getter
Object.defineProperty(Color, "transparent", {
	get: function() {
		return new Color(0, 0, 0, 0);
	},
});

// add transparent white getter
Object.defineProperty(Color, "transwhite", {
	get: function() {
		return new Color(1, 1, 1, 0);
	},
});

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
	if(!components) { throw new Error("Invalid hex value to parse!"); }
	return new Color(components.r, components.g, components.b, 1);
}
