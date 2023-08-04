import Rectangle from "../utils/rectangle";
import Vector2 from "../utils/vector2";
import Asset from "./asset";
import TextureAsset from "./texture_asset";

/**
 * A font texture asset, dynamically generated from loaded font and canvas.
 * This asset type creates an atlas of all the font's characters as textures, so we can later render them as sprites.
 */
class FontTextureAsset extends Asset {
	/** @inheritdoc */
	constructor(url) {
		super(url);
		this._fontName = null;
		this._fontSize = null;
		this._placeholderChar = null;
		this._sourceRects = null;
		this._texture = null;
		this._lineHeight = 0;
	}

	/**
	 * Get line height.
	 */
	get lineHeight() {
		return this._lineHeight;
	}

	/**
	 * Get font name.
	 */
	get fontName() {
		return this._fontName;
	}

	/**
	 * Get font size.
	 */
	get fontSize() {
		return this._fontSize;
	}

	/**
	 * Get placeholder character.
	 */
	get placeholderCharacter() {
		return this._placeholderChar;
	}

	/**
	 * Get the texture.
	 */
	get texture() {
		return this._texture;
	}

	/**
	 * Generate the font texture from a font found in given URL.
	 * @param {*} params Additional params. Possible values are:
	 *                      - fontName: mandatory font name. on some browsers if the font name does not match the font you actually load via the URL, it will not be loaded properly.
	 *                      - missingCharPlaceholder (default='?'): character to use for missing characters.
	 *                      - smoothFont (default=true): if true, will set font to smooth mode.
	 *                      - fontSize (default=52): font size in texture. larget font size will take more memory, but allow for sharper text rendering in larger scales.
	 *                      - enforceTexturePowerOfTwo (default=true): if true, will force texture size to be power of two.
	 *                      - maxTextureWidth (default=1024): max texture width.
	 *                      - charactersSet (default=FontTextureAsset.defaultCharactersSet): which characters to set in the texture.
	 *                      - extraPadding (default=0,0): Optional extra padding to add around characters in texture.
	 *                      - sourceRectOffsetAdjustment (default=0,0): Optional extra offset in characters source rectangles. Use this for fonts that are too low / height and bleed into other characters source rectangles.
	 * @returns {Promise} Promise to resolve when fully loaded.
	 */
	load(params) {
		return new Promise(async (resolve, reject) => {

			if(!params || !params.fontName) {
				return reject("When loading font texture you must provide params with a 'fontName' value!");
			}

			// set default missing char placeholder + store it
			this._placeholderChar = (params.missingCharPlaceholder || '?')[0];

			// set smoothing mode
			let smooth = params.smoothFont === undefined ? true : params.smoothFont;

			// set extra margins
			let extraPadding = params.extraPadding || { x: 0, y: 0 };

			// set max texture size
			let maxTextureWidth = params.maxTextureWidth || 1024;

			// default chars set
			let charsSet = params.charactersSet || FontTextureAsset.defaultCharactersSet;

			// make sure charSet got the placeholder char
			if(charsSet.indexOf(this._placeholderChar) === -1) {
				charsSet += this._placeholderChar;
			}

			// load font
			let fontFace = new FontFace(params.fontName, `url(${this.url})`);
			await fontFace.load();
			document.fonts.add(fontFace);

			// store font name and size
			this._fontName = params.fontName;
			this._fontSize = params.fontSize || 52;
			let margin = { x: 10, y: 5 };

			// measure font height
			let fontFullName = this.fontSize.toString() + 'px ' + this.fontName;
			let fontHeight = measureTextHeight(this.fontName, this.fontSize, undefined, extraPadding.y);
			let fontWidth = measureTextWidth(this.fontName, this.fontSize, undefined, extraPadding.x);

			// set line height
			this._lineHeight = fontHeight;

			// calc estimated size of a single character in texture
			let estimatedCharSizeInTexture = new Vector2(fontWidth + margin.x * 2, fontHeight + margin.y * 2);

			// calc texture size
			let charsPerRow = Math.floor(maxTextureWidth / estimatedCharSizeInTexture.x);
			let textureWidth = Math.min(charsSet.length * estimatedCharSizeInTexture.x, maxTextureWidth);
			let textureHeight = Math.ceil(charsSet.length / charsPerRow) * (estimatedCharSizeInTexture.y);

			// make width and height powers of two
			if(params.enforceTexturePowerOfTwo || params.enforceTexturePowerOfTwo === undefined) {
				textureWidth = makePowerTwo(textureWidth);
				textureHeight = makePowerTwo(textureHeight);
			}

			// a dictionary to store the source rect of every character
			this._sourceRects = {};

			// create a canvas to generate the texture on
			let canvas = document.createElement('canvas');
			canvas.width = textureWidth;
			canvas.height = textureHeight;
			if(!smooth) {
				canvas.style.webkitFontSmoothing = "none";
				canvas.style.fontSmooth = "never";
				canvas.style.textRendering = "geometricPrecision";
			}
			let ctx = canvas.getContext('2d');
			ctx.textBaseline = "bottom";

			// set font and white color
			ctx.font = fontFullName;
			ctx.fillStyle = '#ffffffff';
			ctx.imageSmoothingEnabled = smooth;

			// draw the font texture
			let x = 0; let y = 0;
			for(let i = 0; i < charsSet.length; ++i) {

				// get actual width of current character
				let currChar = charsSet[i];
				let currCharWidth = Math.ceil(ctx.measureText(currChar).width + extraPadding.x);

				// check if need to break line down in texture
				if(x + currCharWidth > textureWidth) {
					y += Math.round(fontHeight + margin.y);
					x = 0;
				}

				// calc source rect
				const offsetAdjustment = params.sourceRectOffsetAdjustment || { x: 0, y: 0 };
				let sourceRect = new Rectangle(x + offsetAdjustment.x, y + offsetAdjustment.y, currCharWidth, fontHeight);
				this._sourceRects[currChar] = sourceRect;

				// draw character
				ctx.fillText(currChar, x, y + fontHeight);

				// move to next spot in texture
				x += Math.round(currCharWidth + margin.x);
			}

			// do threshold effect
			if(!smooth) {
				let imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
				let data = imageData.data;
				for(let i = 0; i < data.length; i += 4) {
					if(data[i + 3] > 0 && (data[i + 3] < 255 || data[i] < 255 || data[i + 1] < 255 || data[i + 2] < 255)) {
						data[i + 3] = 0;
					}
				}
				ctx.putImageData(imageData, 0, 0);
			}

			// convert canvas to image
			let img = new Image();
			img.src = canvas.toDataURL("image/png");
			img.onload = () => {

				// convert image to texture
				let texture = new TextureAsset(this.url + '__font-texture');
				texture.fromImage(img);

				// success!
				this._texture = texture;
				this._notifyReady();
				resolve();

			};
		});
	}

	/**
	 * Get texture width.
	 * @returns {Number} Texture width.
	 */
	get width() {
		return this._texture._width;
	}

	/**
	 * Get texture height.
	 * @returns {Number} Texture height.
	 */
	get height() {
		return this._texture._height;
	}

	/**
	 * Get texture size as a vector.
	 * @returns {Vector2} Texture size.
	 */
	getSize() {
		return this._texture.getSize();
	}

	/** @inheritdoc */
	get valid() {
		return Boolean(this._texture);
	}

	/**
	 * Get the source rectangle for a given character in texture.
	 * @param {Character} character Character to get source rect for.
	 * @returns {Rectangle} Source rectangle for character.
	 */
	getSourceRect(character) {
		return this._sourceRects[character] || this._sourceRects[this.placeholderCharacter];
	}

	/**
	 * When drawing the character, get the offset to add to the cursor.
	 * @param {Character} character Character to get the offset for.
	 * @returns {Vector2} Offset to add to the cursor before drawing the character.
	 */
	getPositionOffset(character) {
		return Vector2.zero();
	}

	/**
	 * Get how much to advance the cursor when drawing this character.
	 * @param {Character} character Character to get the advance for.
	 * @returns {Number} Distance to move the cursor after drawing the character.
	 */
	getXAdvance(character) {
		return this.getSourceRect(character).width;
	}

	/** @inheritdoc */
	destroy() {
		if(this._texture) this._texture.destroy();
		this._fontName = null;
		this._fontSize = null;
		this._placeholderChar = null;
		this._sourceRects = null;
		this._texture = null;
		this._lineHeight = 0;
	}
}

// default ascii characters to generate font textures for
FontTextureAsset.defaultCharactersSet = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾";

// return the closest power-of-two value to a given number
function makePowerTwo(val) {
	let ret = 2;
	while(ret < val) {
		if(ret >= val) { return ret; }
		ret = ret * 2;
	}
	return ret;
}

/**
 * Measure font's actual height.
 */
function measureTextHeight(fontFamily, fontSize, char, extraHeight) {
	let text = document.createElement('pre');
	text.style.fontFamily = fontFamily;
	text.style.fontSize = fontSize + "px";
	text.style.paddingBottom = text.style.paddingLeft = text.style.paddingTop = text.style.paddingRight = '0px';
	text.style.marginBottom = text.style.marginLeft = text.style.marginTop = text.style.marginRight = '0px';
	text.textContent = char || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";
	document.body.appendChild(text);
	let result = text.getBoundingClientRect().height + (extraHeight || 0);
	document.body.removeChild(text);
	return Math.ceil(result);
};

/**
 * Measure font's actual width.
 */
function measureTextWidth(fontFamily, fontSize, char, extraWidth) {
	// special case to ignore \r and \n when measuring text width
	if(char === '\n' || char === '\r') { return 0; }

	// measure character width
	let canvas = document.createElement("canvas");
	let context = canvas.getContext("2d");
	context.font = fontSize.toString() + 'px ' + fontFamily;
	let result = 0;
	let text = char || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";
	for(let i = 0; i < text.length; ++i) {
		result = Math.max(result, context.measureText(text[i]).width + (extraWidth || 0));
	}
	return Math.ceil(result);
};

// export the asset type.
export default FontTextureAsset;
