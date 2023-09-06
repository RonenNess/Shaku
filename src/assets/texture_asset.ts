import { Color, LoggerFactory } from "../utils";
import { TextureAssetBase } from "./texture_asset_base";

const _logger = LoggerFactory.getLogger("assets"); // TODO

// the webgl context to use
let gl: WebGLRenderingContext | null = null;

/**
 * A loadable texture asset.
 * This asset type loads an image from URL or source, and turn it into a texture.
 */
export class TextureAsset extends TextureAssetBase {
	public width: number;
	private image: unknown | null;
	private height: number;
	private texture: WebGLTexture | null;
	private ctxForPixelData: CanvasRenderingContext2D | null;

	/**
	 * @inheritdoc
	 */
	public constructor(url: string) {
		super(url);
		this.image = null;
		this.width = 0;
		this.height = 0;
		this.texture = null;
		this.ctxForPixelData = null;
	}

	/**
	 * Set the WebGL context.
	 */
	private static setWebGl(_gl: WebGLRenderingContext): void {
		gl = _gl;
	}

	/**
	 * Load the texture from it's image URL.
	 * @param params Optional additional params. Possible values are:
	 *  - generateMipMaps (default=false): if true, will generate mipmaps for this texture.
	 *  - crossOrigin (default=undefined): if set, will set the crossOrigin property with this value.
	 *  - flipY (default=false): if true, will flip texture on Y axis.
	 *  - premultiplyAlpha (default=false): if true, will load texture with premultiply alpha flag set.
	 * @returns Promise to resolve when fully loaded.
	 */
	public load(params?: LoadParams): Promise<void> {
		// default params
		params = params || {};

		return new Promise((resolve, reject) => {

			if(!gl) return reject("Can't load textures before initializing gfx manager!");

			// create image to load
			const image = new Image();
			if(params.crossOrigin !== undefined) image.crossOrigin = params.crossOrigin;
			image.onload = async () => {
				try {
					await this.create(image, params);
					this.notifyReady();
					resolve();
				}
				catch(e) {
					reject(e);
				}
			};
			image.onerror = () => reject("Failed to load texture image!");

			// initiate image load
			image.src = this.url;
		});
	}

	/**
	 * Create this texture as an empty render target.
	 * @param width Texture width.
	 * @param height Texture height.
	 * @param channels Texture channels count. Defaults to 4 (RGBA).
	 */
	public createRenderTarget(width: number, height: number, channels?: number): void {
		// reset flags
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

		// create to render to
		const targetTextureWidth = width;
		const targetTextureHeight = height;
		const targetTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, targetTexture);

		// calculate format
		let format: number = gl.RGBA;
		if(channels !== undefined) {
			switch(channels) {
				case 1:
					format = gl.LUMINANCE;
					break;
				case 3:
					format = gl.RGB;
					break;
				case 4:
					format = gl.RGBA;
					break;
				default:
					throw new Error("Unknown render target format!");
			}
		}

		{
			// create texture
			const level = 0;
			const internalFormat = format;
			const border = 0;
			const format = format;
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
		this.width = width;
		this.height = height;
		this.texture = targetTexture;
		this.notifyReady();
	}

	/**
	 * Create texture from loaded image instance.
	 * @see TextureAsset.load for params.
	 * @param image Image to create texture from. Image must be loaded!
	 * @param params Optional additional params. See load() for details.
	 */
	public fromImage(image: TextureAsset, params?: LoadParams): void {
		if(image.width === 0) throw new Error("Image to build texture from must be loaded and have valid size!");

		if(this.isValid()) throw new Error("Texture asset is already initialized!");

		// default params
		params = params || {};

		// set flip Y argument
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, Boolean(params.flipY));

		// set premultiply alpha params
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, Boolean(params.premultiplyAlpha));

		// store image
		this.image = image;
		this.width = image.width;
		this.height = image.height;

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
		this.texture = texture;
		this.notifyReady();
	}

	/**
	 * Create the texture from an image.
	 * @see TextureAsset.load for params.
	 * @param source Image or Image source URL to create texture from.
	 * @param params Optional additional params. See load() for details.
	 * @returns Promise to resolve when asset is ready.
	 */
	public create(source: TextureAsset | string, params: LoadParams): Promise<void> {
		return new Promise((resolve, _reject) => {

			if(typeof source === "string") {
				const img = new Image();
				img.onload = () => {
					this.fromImage(source, params);
					this.notifyReady();
					resolve();
				};
				if(params.crossOrigin !== undefined) img.crossOrigin = params.crossOrigin;
				img.src = source;
			}
			else {
				this.fromImage(source, params);
				resolve();
			}
		});
	}

	/**
	 * @inheritdoc
	 */
	public getImage(): unknown {
		return this.image;
	}

	/**
	 * @inheritdoc
	 */
	public getWidth(): number {
		return this.width;
	}

	/**
	 * @inheritdoc
	 */
	public getHeight(): number {
		return this.height;
	}

	/**
	 * Get pixel color from image.
	 * Note: this method is quite slow, if you need to perform multiple queries consider using `getPixelsData()` once to get all pixels data instead.
	 * @param x Pixel X value.
	 * @param y Pixel Y value.
	 * @returns Pixel color.
	 */
	public getPixel(x: number, y: number): Color {
		if(!this.image) throw new Error("'getPixel()' only works on textures loaded from image!");

		// build internal canvas and context to get pixel data
		if(!this.ctxForPixelData) {
			const canvas = document.createElement("canvas");
			canvas.width = 1;
			canvas.height = 1;
			this.ctxForPixelData = canvas.getContext("2d");
		}

		// get pixel data
		const ctx = this.ctxForPixelData;
		ctx.drawImage(this.image, x, y, 1, 1, 0, 0, 1, 1);
		const pixelData = ctx.getImageData(0, 0, 1, 1).data as [number, number, number, number];
		return Color.fromBytesArray(pixelData);
	}

	/**
	 * Get a 2D array with pixel colors.
	 * @param x Offset X in texture to get. Defaults to 0.
	 * @param y Offset Y in texture to get. Defaults to 0.
	 * @param width How many pixels to get on X axis. Defaults to texture width - x.
	 * @param height How many pixels to get on Y axis. Defaults to texture height - y.
	 * @returns A 2D array with all texture pixel colors.
	 */
	public getPixelsData(x = 0, y = 0, width?: number, height?: number): Color[][] {
		if(!this.image) throw new Error("'getPixel()' only works on textures loaded from image!");

		// default width / height
		width ||= this.width - x;
		height ||= this.height - y;

		// build internal canvas and context to get pixel data
		if(!this.ctxForPixelData) {
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			this.ctxForPixelData = canvas.getContext("2d");
		}

		// get pixel data
		const ctx = this.ctxForPixelData;
		ctx.drawImage(this.image, x, y, width, height, 0, 0, width, height);
		const pixelData = ctx.getImageData(x, y, width, height).data;

		//  convert to colors
		const ret = [];
		for(let i = 0; i < width; ++i) {
			const currRow = [];
			ret.push(currRow);
			for(let j = 0; j < height; ++j) {
				currRow.push(Color.fromBytesArray(pixelData, i * 4 + (j * 4 * width)));
			}
		}
		return ret;
	}

	/**
	 * @inheritdoc
	 */
	public isValid(): boolean {
		return Boolean(this.texture);
	}

	/**
	 * @inheritdoc
	 */
	public destroy(): void {
		gl.deleteTexture(this.texture);
		this.image = null;
		this.width = this.height = 0;
		this.ctxForPixelData = null;
		this.texture = null;
	}

	/**
	 * @inheritdoc
	 */
	private getGlTexture(): WebGLTexture {
		return this.texture;
	}
}

interface LoadParams {
	generateMipMaps?: boolean;
	crossOrigin?: boolean | undefined;
	flipY?: boolean;
	premultiplyAlpha?: boolean;
}

// check if value is a power of 2
function isPowerOf2(value: number): boolean {
	return (value & (value - 1)) === 0;
}
