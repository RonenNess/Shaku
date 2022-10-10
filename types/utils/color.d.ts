export = Color;
/**
 * Implement a color.
 * All color components are expected to be in 0.0 - 1.0 range (and not 0-255).
 */
declare class Color {
    /**
     * Convert a single component to hex value.
     * @param {Number} c Value to convert to hex.
     * @returns {String} Component as hex value.
     */
    static componentToHex(c: number): string;
    /**
     * Create color from hex value.
     * @param {String} val Number value (hex), as #rrggbbaa.
     * @returns {Color} New color value.
     */
    static fromHex(val: string): Color;
    /**
     * Create color from decimal value.
     * @param {Number} val Number value (int).
     * @param {Number} includeAlpha If true, will include alpha value.
     * @returns {Color} New color value.
     */
    static fromDecimal(val: number, includeAlpha: number): Color;
    /**
     * Create color from a dictionary.
     * @param {*} data Dictionary with {r,g,b,a}.
     * @returns {Color} Newly created color.
     */
    static fromDict(data: any): Color;
    /**
     * Return a random color.
     * @param {Boolean} includeAlpha If true, will also randomize alpha.
     * @returns {Color} Randomized color.
     */
    static random(includeAlpha: boolean): Color;
    /**
     * Build and return new color from bytes array.
     * @param {Array<Number>} bytes Bytes array to build color from.
     * @returns {Color} Newly created color.
     */
    static fromBytesArray(bytes: Array<number>): Color;
    /**
     * Get array with all built-in web color names.
     * @returns {Array<String>} Array with color names.
     */
    static get webColorNames(): string[];
    /**
     * Lerp between two colors.
     * @param {Color} p1 First color.
     * @param {Color} p2 Second color.
     * @param {Number} a Lerp factor (0.0 - 1.0).
     * @returns {Color} result color.
     */
    static lerp(p1: Color, p2: Color, a: number): Color;
    /**
     * Create the color.
     * @param {Number} r Color red component (value range: 0-1).
     * @param {Number} g Color green component (value range: 0-1).
     * @param {Number} b Color blue component (value range: 0-1).
     * @param {Number=} a Color alpha component (value range: 0-1).
     */
    constructor(r: number, g: number, b: number, a?: number | undefined);
    /**
     * Set the color components.
     * @param {Number} r Color red component (value range: 0-1).
     * @param {Number} g Color green component (value range: 0-1).
     * @param {Number} b Color blue component (value range: 0-1).
     * @param {Number} a Color alpha component (value range: 0-1).
     * @returns {Color} this.
     */
    set(r: number, g: number, b: number, a: number): Color;
    _r: number;
    _g: number;
    _b: number;
    _a: number;
    _asHex: string;
    /**
     * Set the color components from byte values (0-255).
     * @param {Number} r Color red component (value range: 0-255).
     * @param {Number} g Color green component (value range: 0-255).
     * @param {Number} b Color blue component (value range: 0-255).
     * @param {Number} a Color alpha component (value range: 0-255).
     * @returns {Color} this.
     */
    setByte(r: number, g: number, b: number, a: number): Color;
    /**
     * Copy all component values from another color.
     * @param {Color} other Color to copy values from.
     * @returns {Color} this.
     */
    copy(other: Color): Color;
    /**
     * Set r component.
     * @returns {Number} Red component after change.
     */
    set r(arg: number);
    /**
     * Get r component.
     * @returns {Number} Red component.
     */
    get r(): number;
    /**
     * Set g component.
     * @returns {Number} Green component after change.
     */
    set g(arg: number);
    /**
     * Get g component.
     * @returns {Number} Green component.
     */
    get g(): number;
    /**
     * Set b component.
     * @returns {Number} Blue component after change.
     */
    set b(arg: number);
    /**
     * Get b component.
     * @returns {Number} Blue component.
     */
    get b(): number;
    /**
     * Set a component.
     * @returns {Number} Alpha component after change.
     */
    set a(arg: number);
    /**
     * Get a component.
     * @returns {Number} Alpha component.
     */
    get a(): number;
    /**
     * Convert this color to hex string (starting with '#').
     * @returns {String} Color as hex.
     */
    get asHex(): string;
    /**
     * Convert to dictionary.
     * @param {Boolean} minimized If true, will not include keys that their values are 1. You can use fromDict on minimized dicts.
     * @returns {*} Dictionary with {r,g,b,a}
     */
    toDict(minimized: boolean): any;
    /**
     * Convert this color to decimal number.
     * @returns {Number} Color as decimal RGBA.
     */
    get asDecimalRGBA(): number;
    /**
     * Convert this color to decimal number.
     * @returns {Number} Color as decimal ARGB.
     */
    get asDecimalABGR(): number;
    /**
     * Convert this color to a float array.
     */
    get floatArray(): number[];
    /**
     * Return a clone of this color.
     * @returns {Number} Cloned color.
     */
    clone(): number;
    /**
     * Convert to string.
     */
    string(): string;
    /**
     * Get if this color is pure black (ignoring alpha).
     */
    get isBlack(): boolean;
    /**
     * Get if this color is transparent black.
     */
    get isTransparentBlack(): boolean;
    /**
     * Check if equal to another color.
     * @param {Color} other Other color to compare to.
     */
    equals(other: Color): boolean;
}
declare namespace Color {
	const aliceblue: Color;
	const antiquewhite: Color;
	const aqua: Color;
	const aquamarine: Color;
	const azure: Color;
	const beige: Color;
	const bisque: Color;
	const black: Color;
	const blanchedalmond: Color;
	const blue: Color;
	const blueviolet: Color;
	const brown: Color;
	const burlywood: Color;
	const cadetblue: Color;
	const chartreuse: Color;
	const chocolate: Color;
	const coral: Color;
	const cornflowerblue: Color;
	const cornsilk: Color;
	const crimson: Color;
	const cyan: Color;
	const darkblue: Color;
	const darkcyan: Color;
	const darkgoldenrod: Color;
	const darkgray: Color;
	const darkgreen: Color;
	const darkkhaki: Color;
	const darkmagenta: Color;
	const darkolivegreen: Color;
	const darkorange: Color;
	const darkorchid: Color;
	const darkred: Color;
	const darksalmon: Color;
	const darkseagreen: Color;
	const darkslateblue: Color;
	const darkslategray: Color;
	const darkturquoise: Color;
	const darkviolet: Color;
	const deeppink: Color;
	const deepskyblue: Color;
	const dimgray: Color;
	const dodgerblue: Color;
	const firebrick: Color;
	const floralwhite: Color;
	const forestgreen: Color;
	const fuchsia: Color;
	const gainsboro: Color;
	const ghostwhite: Color;
	const gold: Color;
	const goldenrod: Color;
	const gray: Color;
	const green: Color;
	const greenyellow: Color;
	const honeydew: Color;
	const hotpink: Color;
	const indianred : Color;
	const indigo: Color;
	const ivory: Color;
	const khaki: Color;
	const lavender: Color;
	const lavenderblush: Color;
	const lawngreen: Color;
	const lemonchiffon: Color;
	const lightblue: Color;
	const lightcoral: Color;
	const lightcyan: Color;
	const lightgoldenrodyellow: Color;
	const lightgrey: Color;
	const lightgreen: Color;
	const lightpink: Color;
	const lightsalmon: Color;
	const lightseagreen: Color;
	const lightskyblue: Color;
	const lightslategray: Color;
	const lightsteelblue: Color;
	const lightyellow: Color;
	const lime: Color;
	const limegreen: Color;
	const linen: Color;
	const magenta: Color;
	const maroon: Color;
	const mediumaquamarine: Color;
	const mediumblue: Color;
	const mediumorchid: Color;
	const mediumpurple: Color;
	const mediumseagreen: Color;
	const mediumslateblue: Color;
	const mediumspringgreen: Color;
	const mediumturquoise: Color;
	const mediumvioletred: Color;
	const midnightblue: Color;
	const mintcream: Color;
	const mistyrose: Color;
	const moccasin: Color;
	const navajowhite: Color;
	const navy: Color;
	const oldlace: Color;
	const olive: Color;
	const olivedrab: Color;
	const orange: Color;
	const orangered: Color;
	const orchid: Color;
	const palegoldenrod: Color;
	const palegreen: Color;
	const paleturquoise: Color;
	const palevioletred: Color;
	const papayawhip: Color;
	const peachpuff: Color;
	const peru: Color;
	const pink: Color;
	const plum: Color;
	const powderblue: Color;
	const purple: Color;
	const rebeccapurple: Color;
	const red: Color;
	const rosybrown: Color;
	const royalblue: Color;
	const saddlebrown: Color;
	const salmon: Color;
	const sandybrown: Color;
	const seagreen: Color;
	const seashell: Color;
	const sienna: Color;
	const silver: Color;
	const skyblue: Color;
	const slateblue: Color;
	const slategray: Color;
	const snow: Color;
	const springgreen: Color;
	const steelblue: Color;
	const tan: Color;
	const teal: Color;
	const thistle: Color;
	const tomato: Color;
	const turquoise: Color;
	const violet: Color;
	const wheat: Color;
	const white: Color;
	const whitesmoke: Color;
	const yellow: Color;
	const yellowgreen: Color;
    const transparent: Color;
    const transwhite: Color;
}
//# sourceMappingURL=color.d.ts.map