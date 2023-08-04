import _logger from "../logger";
import Color from "../utils/color";
import TextureAssetBase from "./texture_asset_base";

const _loggggger = _logger.getLogger("assets"); // TODO



// the webgl context to use
var gl = null;

/**
 * A loadable texture asset.
 * This asset type loads an image from URL or source, and turn it into a texture.
 */
export default class TextureAsset extends TextureAssetBase {
	/** @inheritdoc */
	constructor(url) {
		super(url);
		this._image = null;
		this._width = 0;
		this._height = 0;
		this._texture = null;
		this._ctxForPixelData = null;
	}

	/**
	 * Set the WebGL context.
	 * @private
	 */
	static _setWebGl(_gl) {
		gl = _gl;
	}

	/**
	 * Load the texture from it's image URL.
	 * @param {*} params Optional additional params. Possible values are:
	 *                      - generateMipMaps (default=false): if true, will generate mipmaps for this texture.
	 *                      - crossOrigin (default=undefined): if set, will set the crossOrigin property with this value.
	 *                      - flipY (default=false): if true, will flip texture on Y axis.
	 *                      - premultiplyAlpha (default=false): if true, will load texture with premultiply alpha flag set.
	 * @returns {Promise} Promise to resolve when fully loaded.
	 */
	load(params) {
		// default params
		params = params || {};

		return new Promise((resolve, reject) => {

			if(!gl) {
				return reject("Can't load textures before initializing gfx manager!");
			}

			// create image to load
			const image = new Image();
			if(params.crossOrigin !== undefined) {
				image.crossOrigin = params.crossOrigin;
			}
			image.onload = async () => {
				try {
					await this.create(image, params);
					this._notifyReady();
					resolve();
				}
				catch(e) {
					reject(e);
				}
			};
			image.onerror = () => {
				reject("Failed to load texture image!");
			};

			// initiate image load
			image.src = this.url;
		});
	}

	/**
	 * Create this texture as an empty render target.
	 * @param {Number} width Texture width.
	 * @param {Number} height Texture height.
	 * @param {Number} channels Texture channels count. Defaults to 4 (RGBA).
	 */
	createRenderTarget(width, height, channels) {
		// reset flags
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

		// create to render to
		const targetTextureWidth = width;
		const targetTextureHeight = height;
		const targetTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, targetTexture);

		// calculate format
		var _format = gl.RGBA;
		if(channels !== undefined) {
			switch(channels) {
				case 1:
					_format = gl.LUMINANCE;
					break;
				case 3:
					_format = gl.RGB;
					break;
				case 4:
					_format = gl.RGBA;
					break;
				default:
					throw new Error("Unknown render target format!");
			}
		}

		{
			// create texture
			const level = 0;
			const internalFormat = _format;
			const border = 0;
			const format = _format;
			const type = gl.UNSIGNED_BYTE;
			const data = null;
			gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
				targetTextureWidth, targetTextureHeight, border,
				format, type, data);

			// set default wrap and filter modes
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		}

		// store texture
		this._width = width;
		this._height = height;
		this._texture = targetTexture;
		this._notifyReady();
	}

	/**
	 * Create texture from loaded image instance.
	 * @see TextureAsset.load for params.
	 * @param {Image} image Image to create texture from. Image must be loaded!
	 * @param {*} params Optional additional params. See load() for details.
	 */
	fromImage(image, params) {
		if(image.width === 0) {
			throw new Error("Image to build texture from must be loaded and have valid size!");
		}

		if(this.valid) {
			throw new Error("Texture asset is already initialized!");
		}

		// default params
		params = params || {};

		// set flip Y argument
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, Boolean(params.flipY));

		// set premultiply alpha params
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, Boolean(params.premultiplyAlpha));

		// store image
		this._image = image;
		this._width = image.width;
		this._height = image.height;

		// create texture
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		// set texture
		const level = 0;
		const internalFormat = gl.RGBA;
		const srcFormat = gl.RGBA;
		const srcType = gl.UNSIGNED_BYTE;
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

		// WebGL1 has different requirements for power of 2 images
		// vs non power of 2 images so check if the image is a
		// power of 2 in both dimensions.
		if(params.generateMipMaps) {
			if(isPowerOf2(image.width) && isPowerOf2(image.height)) {
				_logger.warn("Tried to generate MipMaps for a texture with size that is *not* a power of two. This might not work as expected.");
			}
			gl.generateMipmap(gl.TEXTURE_2D);
		}

		// default wrap and filters
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

		// success!
		this._texture = texture;
		this._notifyReady();
	}

	/**
	 * Create the texture from an image.
	 * @see TextureAsset.load for params.
	 * @param {Image|String} source Image or Image source URL to create texture from.
	 * @param {*} params Optional additional params. See load() for details.
	 * @returns {Promise} Promise to resolve when asset is ready.
	 */
	create(source, params) {
		return new Promise(async (resolve, reject) => {

			if(typeof source === "string") {
				let img = new Image();
				img.onload = () => {
					this.fromImage(source, params);
					this._notifyReady();
					resolve();
				};
				if(params.crossOrigin !== undefined) {
					img.crossOrigin = params.crossOrigin;
				}
				img.src = source;
			}
			else {
				this.fromImage(source, params);
				resolve();
			}
		});
	}

	/** @inheritdoc */
	get image() {
		return this._image;
	}

	/** @inheritdoc */
	get width() {
		return this._width;
	}

	/** @inheritdoc */
	get height() {
		return this._height;
	}

	/** @inheritdoc */
	get _glTexture() {
		return this._texture;
	}

	/**
	 * Get pixel color from image.
	 * Note: this method is quite slow, if you need to perform multiple queries consider using `getPixelsData()` once to get all pixels data instead.
	 * @param {Number} x Pixel X value.
	 * @param {Number} y Pixel Y value.
	 * @returns {Color} Pixel color.
	 */
	getPixel(x, y) {
		if(!this._image) {
			throw new Error("'getPixel()' only works on textures loaded from image!");
		}

		// build internal canvas and context to get pixel data
		if(!this._ctxForPixelData) {
			let canvas = document.createElement('canvas');
			canvas.width = 1;
			canvas.height = 1;
			this._ctxForPixelData = canvas.getContext('2d');
		}

		// get pixel data
		let ctx = this._ctxForPixelData;
		ctx.drawImage(this._image, x, y, 1, 1, 0, 0, 1, 1);
		let pixelData = ctx.getImageData(0, 0, 1, 1).data;
		return Color.fromBytesArray(pixelData);
	}

	/**
	 * Get a 2D array with pixel colors.
	 * @param {Number=} x Offset X in texture to get. Defaults to 0.
	 * @param {Number=} y Offset Y in texture to get. Defaults to 0.
	 * @param {Number=} width How many pixels to get on X axis. Defaults to texture width - x.
	 * @param {Number=} height How many pixels to get on Y axis. Defaults to texture height - y.
	 * @returns {Array<Array<Color>>} A 2D array with all texture pixel colors.
	 */
	getPixelsData(x, y, width, height) {
		if(!this._image) {
			throw new Error("'getPixel()' only works on textures loaded from image!");
		}

		// default x, y
		x = x || 0;
		y = y || 0;

		// default width / height
		width = width || (this.width - x);
		height = height || (this.height - y);

		// build internal canvas and context to get pixel data
		if(!this._ctxForPixelData) {
			let canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			this._ctxForPixelData = canvas.getContext('2d');
		}

		// get pixel data
		let ctx = this._ctxForPixelData;
		ctx.drawImage(this._image, x, y, width, height, 0, 0, width, height);
		let pixelData = ctx.getImageData(x, y, width, height).data;

		//  convert to colors
		let ret = [];
		for(let i = 0; i < width; ++i) {
			let currRow = [];
			ret.push(currRow);
			for(let j = 0; j < height; ++j) {
				currRow.push(Color.fromBytesArray(pixelData, i * 4 + (j * 4 * width)));
			}
		}
		return ret;
	}

	/** @inheritdoc */
	get valid() {
		return Boolean(this._texture);
	}

	/** @inheritdoc */
	destroy() {
		gl.deleteTexture(this._texture);
		this._image = null;
		this._width = this._height = 0;
		this._ctxForPixelData = null;
		this._texture = null;
	}
}

// check if value is a power of 2
function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
}
