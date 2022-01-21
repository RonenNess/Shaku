/**
 * Define a color object.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\color.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

const MathHelper = require("./math_helper");


/**
 * Implement a color.
 * All color components are expected to be in 0.0 - 1.0 range (and not 0-255).
 */
class Color
{
    /**
     * Create the color.
     * @param {Number} r Color red component (value range: 0-1).
     * @param {Number} g Color green component (value range: 0-1).
     * @param {Number} b Color blue component (value range: 0-1).
     * @param {Number} a Color alpha component (value range: 0-1).
     */
    constructor(r, g, b, a)
    {
        this.set(r, g, b, a);
    }

    /**
     * Set the color components.
     * @param {Number} r Color red component (value range: 0-1).
     * @param {Number} g Color green component (value range: 0-1).
     * @param {Number} b Color blue component (value range: 0-1).
     * @param {Number} a Color alpha component (value range: 0-1).
     * @returns {Color} this.
     */
    set(r, g, b, a)
    {
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = (a === undefined) ? 1 : a;
        this._asHex = null;
        return this;
    }

    /**
     * Set the color components from byte values (0-255).
     * @param {Number} r Color red component (value range: 0-255).
     * @param {Number} g Color green component (value range: 0-255).
     * @param {Number} b Color blue component (value range: 0-255).
     * @param {Number} a Color alpha component (value range: 0-255).
     * @returns {Color} this.
     */
    setByte(r, g, b, a)
    {
        this._r = r / 255.0;
        this._g = g / 255.0;
        this._b = b / 255.0;
        this._a = (a === undefined) ? 1 : (a / 255.0);
        this._asHex = null;
        return this;
    }

    /**
     * Copy all component values from another color.
     * @param {Color} other Color to copy values from.
     * @returns {Color} this.
     */
    copy(other)
    {
        this.set(other.r, other.g, other.b, other.a);
        return this;
    }

    /**
     * Get r component.
     * @returns {Number} Red component.
     */
    get r()
    {
        return this._r;
    }

    /**
     * Get g component.
     * @returns {Number} Green component.
     */
    get g()
    {
        return this._g;
    }

    /**
     * Get b component.
     * @returns {Number} Blue component.
     */
    get b()
    {
        return this._b;
    }
    
    /**
     * Get a component.
     * @returns {Number} Alpha component.
     */
    get a()
    {
        return this._a;
    }

    /**
     * Set r component.
     * @returns {Number} Red component after change.
     */
    set r(val)
    {
        this._r = val;
        this._asHex = null;
        return this._r;
    }

    /**
     * Set g component.
     * @returns {Number} Green component after change.
     */
    set g(val)
    {
        this._g = val;
        this._asHex = null;
        return this._g;
    }

    /**
     * Set b component.
     * @returns {Number} Blue component after change.
     */
    set b(val)
    {
        this._b = val;
        this._asHex = null;
        return this._b;
    }
    
    /**
     * Set a component.
     * @returns {Number} Alpha component after change.
     */
    set a(val)
    {
        this._a = val;
        this._asHex = null;
        return this._a;
    }

    /**
     * Convert a single component to hex value.
     * @param {Number} c Value to convert to hex.
     * @returns {String} Component as hex value.
     */
    static componentToHex(c) 
    {
        var hex = Math.round(c).toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
     
    /**
     * Convert this color to hex string (starting with '#').
     * @returns {String} Color as hex.
     */
    get asHex() 
    {
        if (!this._asHex) {
            this._asHex = "#" + Color.componentToHex(this.r * 255) + Color.componentToHex(this.g * 255) + Color.componentToHex(this.b * 255) + Color.componentToHex(this.a * 255);
        }
        return this._asHex;
    }

    /**
     * Create color from hex value.
     * @param {Number} val Number value (hex), as 0xrrggbbaa.
     * @returns {Color} New color value.
     */
    static fromHex(val)
    {
        if (typeof val !== 'string' && val[0] != '#') {
            throw new PintarJS.Error("Invalid color format!");
        }
        var parsed = hexToColor(val);
        if (!parsed) { throw new Error("Invalid hex value to parse!"); }
        return new Color(parsed.r, parsed.g, parsed.b, 1);
    }

    /**
     * Create color from decimal value.
     * @param {Number} val Number value (int).
     * @param {Number} includeAlpha If true, will include alpha value.
     * @returns {Color} New color value.
     */
    static fromDecimal(val, includeAlpha)
    {
        let ret = new Color(1, 1, 1, 1);
        if (includeAlpha) { ret.a = (val & 0xff) / 255.0; val = val >> 8; }
        ret.b = (val & 0xff) / 255.0; val = val >> 8;
        ret.g = (val & 0xff) / 255.0; val = val >> 8;
        ret.r = (val & 0xff) / 255.0;
    }

    /**
     * Convert this color to decimal number.
     * @returns {Number} Color as decimal RGBA.
     */
    get asDecimalRGBA()
    {
      return ((Math.round(this.r * 255) << (8 * 3)) | (Math.round(this.g * 255) << (8 * 2)) | (Math.round(this.b * 255) << (8 * 1)) | (Math.round(this.a * 255)))>>>0;
    }

    /**
     * Convert this color to decimal number.
     * @returns {Number} Color as decimal ARGB.
     */
    get asDecimalABGR()
    {
      return ((Math.round(this.a * 255) << (8 * 3)) | (Math.round(this.b * 255) << (8 * 2)) | (Math.round(this.g * 255) << (8 * 1)) | (Math.round(this.r * 255)))>>>0;
    }

    /**
     * Convert this color to a float array.
     */
    get floatArray()
    {
        return [this.r, this.g, this.b, this.a];
    }

    /**
     * Return a clone of this color.
     * @returns {Number} Cloned color.
     */
    clone()
    {
        return new Color(this.r, this.g, this.b, this.a);
    }

    /**
     * Convert to string.
     */
    string() 
    {
        return this.r + ',' + this.g + ',' + this.b + ',' + this.a;
    }

    /**
     * Get if this color is pure black (ignoring alpha).
     */
    get isBlack()
    {
        return this.r == 0 && this.g == 0 && this.b == 0;
    }

    /**
     * Return a random color.
     * @param {Boolean} includeAlpha If true, will also randomize alpha.
     * @returns {Color} Randomized color.
     */
    static random(includeAlpha)
    {
        return new Color(Math.random(), Math.random(), Math.random(), includeAlpha ? Math.random() : 1);
    }

    /**
     * Build and return new color from bytes array.
     * @param {Array<Number>} bytes Bytes array to build color from.
     * @returns {Color} Newly created color.
     */
    static fromBytesArray(bytes)
    {
        return new Color(bytes[0] / 255, bytes[1] / 255, bytes[2] / 255, (bytes[3] / 255) || 1);
    }

    /**
     * Get if this color is transparent black.
     */
    get isTransparentBlack()
    {
        return this._r == this._g && this._g == this._b && this._b == this._a && this._a == 0;
    }

    /**
     * Get array with all built-in web color names.
     * @returns {Array<String>} Array with color names.
     */
    static get webColorNames()
    {
        return colorKeys;
    }

    /**
     * Check if equal to another color.
     * @param {PintarJS.Color} other Other color to compare to.
     */
    equals(other)
    {
        return (this === other) ||
                (other && (other.constructor === this.constructor) && this._r == other._r && this._g == other._g && this._b == other._b && this._a == other._a);
    }

    /**
     * Lerp between two colors.
     * @param {Color} p1 First color.
     * @param {Color} p2 Second color.
     * @param {Number} a Lerp factor (0.0 - 1.0).
     * @returns {Color} result color.
     */
    static lerp(p1, p2, a)
    {
    let lerpScalar = MathHelper.lerp;
        return new Color(  lerpScalar(p1.r, p2.r, a), 
                        lerpScalar(p1.g, p2.g, a), 
                        lerpScalar(p1.b, p2.b, a), 
                        lerpScalar(p1.a, p2.a, a)
                    );
    }
}

// table to convert common color names to hex
const colorNameToHex = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

// create getter function for all named color
for (var key in colorNameToHex) {
    if (colorNameToHex.hasOwnProperty(key)) {
        var colorValue = hexToColor(colorNameToHex[key]);
        (function(_colValue) {

            Object.defineProperty (Color, key, {
                get: function () { 
                    return _colValue.clone();
                }
            });

        })(colorValue);
    }
}

// built-in color keys
const colorKeys = Object.keys(colorNameToHex);
Object.freeze(colorKeys);

// add transparent getter
Object.defineProperty (Color, 'transparent', {
    get: function () { 
        return new Color(0, 0, 0, 0);
    }
});

// add transparent white getter
Object.defineProperty (Color, 'transwhite', {
    get: function () { 
        return new Color(1, 1, 1, 0);
    }
});


/**
 * Convert Hex value to Color instance.
 * @param {String} hex Hex value to parse.
 */
function hexToColor(hex) 
{
    // expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });
    
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var components = result ? {
        r: parseInt(result[1], 16) / 255.0,
        g: parseInt(result[2], 16) / 255.0,
        b: parseInt(result[3], 16) / 255.0
    } : null;

    // create Color instance
    if (!components) { throw new PintarConsole.Error("Invalid hex value to parse!"); }
    return new Color(components.r, components.g, components.b, 1);
}


// export Color object
module.exports = Color;