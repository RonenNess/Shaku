import { Rectangle, Vector2 } from "../utils";
import { Asset } from "./asset";
import { TextureAsset } from "./texture_asset";

/**
 * A font texture asset, dynamically generated from loaded font and canvas.
 * This asset type creates an atlas of all the font's characters as textures, so we can later render them as sprites.
 */
export class FontTextureAsset extends Asset {
	/**
	 * default ascii characters to generate font textures for
	 */
	public static readonly defaultCharactersSet = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾";

	protected fontName: string | null;
	protected fontSize: number | null;
	protected placeholderChar: string | null;
	protected sourceRects: Record<string, Rectangle> | null;
	protected texture: TextureAsset | null;
	protected lineHeight: number;

	/**
	 * @inheritdoc
	 */
	public constructor(url: string) {
		super(url);
		this.fontName = null;
		this.fontSize = null;
		this.placeholderChar = null;
		this.sourceRects = null;
		this.texture = null;
		this.lineHeight = 0;
	}

	/**
	 * Get line height.
	 */
	public getLineHeight() {
		return this.lineHeight;
	}

	/**
	 * Get font name.
	 */
	public getFontName() {
		return this.fontName;
	}

	/**
	 * Get font size.
	 */
	public getFontSize() {
		return this.fontSize;
	}

	/**
	 * Get placeholder character.
	 */
	public getPlaceholderCharacter() {
		return this.placeholderChar;
	}

	/**
	 * Get the texture.
	 */
	public getTexture() {
		return this.texture;
	}

	/**
	 * Generate the font texture from a font found in given URL.
	 * @param params Additional params. Possible values are:
	 *  - fontName: mandatory font name. on some browsers if the font name does not match the font you actually load via the URL, it will not be loaded properly.
	 *  - missingCharPlaceholder (default="?"): character to use for missing characters.
	 *  - smoothFont (default=true): if true, will set font to smooth mode.
	 *  - fontSize (default=52): font size in texture. larger font size will take more memory, but allow for sharper text rendering in larger scales.
	 *  - enforceTexturePowerOfTwo (default=true): if true, will force texture size to be power of two.
	 *  - maxTextureWidth (default=1024): max texture width.
	 *  - charactersSet (default=FontTextureAsset.defaultCharactersSet): which characters to set in the texture.
	 *  - extraPadding (default=0,0): Optional extra padding to add around characters in texture.
	 *  - sourceRectOffsetAdjustment (default=0,0): Optional extra offset in characters source rectangles. Use this for fonts that are too low / height and bleed into other characters source rectangles.
	 * @returns Promise to resolve when fully loaded.
	 */
	public load(params: {
		fontName: string;
		missingCharPlaceholder?: string;
		smoothFont?: boolean;
		fontSize?: number;
		enforceTexturePowerOfTwo?: boolean;
		maxTextureWidth?: number;
		charactersSet?: string;
		extraPadding?: Vector2;
		sourceRectOffsetAdjustment?: Vector2;
	}): Promise<void> {
		return new Promise(async (resolve, reject) => {

			if(!params || !params.fontName) return reject("When loading font texture you must provide params with a 'fontName' value!");

			// set default missing char placeholder + store it
			this.placeholderChar = (params.missingCharPlaceholder || "?")[0];

			// set smoothing mode
			const smooth = params.smoothFont === undefined ? true : params.smoothFont;

			// set extra margins
			const extraPadding = params.extraPadding || { x: 0, y: 0 };

			// set max texture size
			const maxTextureWidth = params.maxTextureWidth || 1024;

			// default chars set
			let charsSet = params.charactersSet || FontTextureAsset.defaultCharactersSet;

			// make sure charSet got the placeholder char
			if(charsSet.indexOf(this.placeholderChar) === -1) charsSet += this.placeholderChar;

			// load font
			const fontFace = new FontFace(params.fontName, `url(${this.url})`);
			await fontFace.load();
			document.fonts.add(fontFace);

			// store font name and size
			this.fontName = params.fontName;
			this.fontSize = params.fontSize || 52;
			const margin = { x: 10, y: 5 };

			// measure font height
			const fontFullName = this.fontSize.toString() + "px " + this.fontName;
			const fontHeight = measureTextHeight(this.fontName, this.fontSize, undefined, extraPadding.y);
			const fontWidth = measureTextWidth(this.fontName, this.fontSize, undefined, extraPadding.x);

			// set line height
			this.lineHeight = fontHeight;

			// calc estimated size of a single character in texture
			const estimatedCharSizeInTexture = new Vector2(fontWidth + margin.x * 2, fontHeight + margin.y * 2);

			// calc texture size
			const charsPerRow = Math.floor(maxTextureWidth / estimatedCharSizeInTexture.x);
			let textureWidth = Math.min(charsSet.length * estimatedCharSizeInTexture.x, maxTextureWidth);
			let textureHeight = Math.ceil(charsSet.length / charsPerRow) * (estimatedCharSizeInTexture.y);

			// make width and height powers of two
			if(params.enforceTexturePowerOfTwo || params.enforceTexturePowerOfTwo === undefined) {
				textureWidth = makePowerTwo(textureWidth);
				textureHeight = makePowerTwo(textureHeight);
			}

			// a dictionary to store the source rect of every character
			this.sourceRects = {};

			// create a canvas to generate the texture on
			const canvas = document.createElement("canvas");
			canvas.width = textureWidth;
			canvas.height = textureHeight;
			if(!smooth) {
				canvas.style.webkitFontSmoothing = "none";
				canvas.style.fontSmooth = "never";
				canvas.style.textRendering = "geometricPrecision";
			}
			const ctx = canvas.getContext("2d");
			ctx.textBaseline = "bottom";

			// set font and white color
			ctx.font = fontFullName;
			ctx.fillStyle = "#ffffffff";
			ctx.imageSmoothingEnabled = smooth;

			// draw the font texture
			let x = 0; let y = 0;
			for(let i = 0; i < charsSet.length; ++i) {

				// get actual width of current character
				const currChar = charsSet[i];
				const currCharWidth = Math.ceil(ctx.measureText(currChar).width + extraPadding.x);

				// check if need to break line down in texture
				if(x + currCharWidth > textureWidth) {
					y += Math.round(fontHeight + margin.y);
					x = 0;
				}

				// calc source rect
				const offsetAdjustment = params.sourceRectOffsetAdjustment || { x: 0, y: 0 };
				const sourceRect = new Rectangle(x + offsetAdjustment.x, y + offsetAdjustment.y, currCharWidth, fontHeight);
				this.sourceRects[currChar] = sourceRect;

				// draw character
				ctx.fillText(currChar, x, y + fontHeight);

				// move to next spot in texture
				x += Math.round(currCharWidth + margin.x);
			}

			// do threshold effect
			if(!smooth) {
				const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
				const data = imageData.data;
				for(let i = 0; i < data.length; i += 4) {
					if(data[i + 3] > 0 && (data[i + 3] < 255 || data[i] < 255 || data[i + 1] < 255 || data[i + 2] < 255)) {
						data[i + 3] = 0;
					}
				}
				ctx.putImageData(imageData, 0, 0);
			}

			// convert canvas to image
			const img = new Image();
			img.src = canvas.toDataURL("image/png");
			img.onload = () => {
				// convert image to texture
				const texture = new TextureAsset(this.url + "__font-texture");
				texture.fromImage(img);

				// success!
				this.texture = texture;
				this.notifyReady();
				resolve();
			};
		});
	}

	/**
	 * Get texture width.
	 * @returns Texture width.
	 */
	public getWidth(): number {
		return this.texture.getWidth();
	}

	/**
	 * Get texture height.
	 * @returns Texture height.
	 */
	public getHeight(): number {
		return this.texture.getHeight();
	}

	/**
	 * Get texture size as a vector.
	 * @returns Texture size.
	 */
	public getSize(): Vector2 {
		return this.texture.getSize();
	}

	/**
	 * @inheritdoc
	 */
	public isValid(): boolean {
		return Boolean(this.texture);
	}

	/**
	 * Get the source rectangle for a given character in texture.
	 * @param character Character to get source rect for.
	 * @returns Source rectangle for character.
	 */
	public getSourceRect(character: string): Rectangle {
		return this.sourceRects[character]
			|| this.sourceRects[this.placeholderCharacter];
	}

	/**
	 * When drawing the character, get the offset to add to the cursor.
	 * @param character Character to get the offset for.
	 * @returns Offset to add to the cursor before drawing the character.
	 */
	public getPositionOffset(_character: string): Vector2 {
		return Vector2.zero();
	}

	/**
	 * Get how much to advance the cursor when drawing this character.
	 * @param character Character to get the advance for.
	 * @returns Distance to move the cursor after drawing the character.
	 */
	public getXAdvance(character: string): number {
		return this.getSourceRect(character).width;
	}

	/**
	 * @inheritdoc
	 */
	public destroy(): void {
		if(this.texture) this.texture.destroy();
		this.fontName = null;
		this.fontSize = null;
		this.placeholderChar = null;
		this.sourceRects = null;
		this.texture = null;
		this.lineHeight = 0;
	}
}

// return the closest power-of-two value to a given number
function makePowerTwo(val: number): number {
	let ret = 2;
	while(ret < val) {
		if(ret >= val) return ret;
		ret = ret * 2;
	}
	return ret;
}

/**
 * Measure font's actual height.
 */
function measureTextHeight(fontFamily: string, fontSize: number, char?: string, extraHeight?: number): number {
	const text = document.createElement("pre");
	text.style.fontFamily = fontFamily;
	text.style.fontSize = fontSize + "px";
	text.style.paddingBottom = text.style.paddingLeft = text.style.paddingTop = text.style.paddingRight = "0px";
	text.style.marginBottom = text.style.marginLeft = text.style.marginTop = text.style.marginRight = "0px";
	text.textContent = char || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";
	document.body.appendChild(text);
	const result = text.getBoundingClientRect().height + (extraHeight ?? 0);
	document.body.removeChild(text);
	return Math.ceil(result);
}

/**
 * Measure font's actual width.
 */
function measureTextWidth(fontFamily: string, fontSize: number, char?: string, extraWidth?: number): number {
	// special case to ignore \r and \n when measuring text width
	if(char === "\n" || char === "\r") return 0;

	// measure character width
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");
	context.font = fontSize.toString() + "px " + fontFamily;
	let result = 0;
	const text = char || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";
	for(let i = 0; i < text.length; ++i) result = Math.max(result, context.measureText(text[i]).width + (extraWidth ?? 0));
	return Math.ceil(result);
}
