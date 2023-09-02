import { ItemsSorter, Rectangle, Vector2 } from "../utils";
import { Asset } from "./asset";
import { TextureAsset } from "./texture_asset";
import { TextureInAtlasAsset } from "./texture_in_atlas_asset";

// the webgl context to use
let gl: WebGLRenderingContext | null = null;

/**
 * A texture atlas we can build at runtime to combine together multiple textures.
 */
export class TextureAtlasAsset extends Asset {
	private __textures: TextureAsset[];
	private __sources: Record<string, TextureInAtlasAsset>;

	/**
	 * @inheritdoc
	 */
	public constructor(url: string) {
		super(url);
		this.__textures = [];
		this.__sources = {};
	}

	/**
	 * Set the WebGL context.

	 */
	private static _setWebGl(_gl: WebGLRenderingContext): void {
		gl = _gl;
	}

	/**
	 * Build the texture atlas.

	 * @param {Array<string>|Array<Image>} sources Source URLs or images to load into texture. If array of Images, should also contain an "__origin_url" property under them for asset key.
	 * @param maxWidth Optional texture atlas width limit.
	 * @param maxHeight Optional texture atlas height limit.
	 * @param extraMargins Extra pixels to add between textures.
	 * @returns Promise to resolve when done.
	 */
	private async _build(sources: string[] | unknown[], maxWidth?: number, maxHeight?: number, extraMargins?: number): Promise<void> {
		// sanity
		if(this.__textures.length) throw new Error("Texture Atlas already built!");

		// default margins
		extraMargins = extraMargins;

		// build atlas
		return new Promise<void>(async (resolve, reject) => {

			// make sure all sources are valid loaded images
			sources = await loadAllSources(sources);

			// make sure maxWidth and maxHeight are valid
			if(maxWidth > gl.MAX_TEXTURE_SIZE) { maxWidth = gl.MAX_TEXTURE_SIZE; }
			if(maxHeight > gl.MAX_TEXTURE_SIZE) { maxHeight = gl.MAX_TEXTURE_SIZE; }

			// build atlas textures while there are still sources
			while(sources && sources.length) {

				// arrange textures
				const arranged = arrangeTextures(sources, maxWidth, maxHeight, extraMargins);

				// build the texture atlas!
				const atlasTexture = new TextureAsset(`_atlas_${this.url}_${this.__textures.length}`);

				// first create a canvas and get its 2d context
				const canvas = document.createElement("canvas");
				canvas.width = arranged.width;
				canvas.height = arranged.height;
				const ctx = canvas.getContext("2d");

				// now draw the sources and fill the sources dictionary
				let textureInAtlasIndex = 0;
				for(const imageData of arranged.rectangles) {
					ctx.drawImage(imageData.source, imageData.x, imageData.y);
					const url = imageData.source.src;
					const originUrl = imageData.source.__origin_url;
					const relativeUrl = url.substr(location.origin.length);
					const internalUrl = atlasTexture.url + "_" + (textureInAtlasIndex++).toString() + "_" + url.replaceAll("/", "_").replaceAll(":", "");
					const sourceRectangle = new Rectangle(imageData.x, imageData.y, imageData.width, imageData.height);
					const textureInAtlas = new TextureInAtlasAsset(internalUrl, atlasTexture, sourceRectangle, this);
					this.__sources[url] = this.__sources[relativeUrl] = this.__sources[relativeUrl.substr(1)] = textureInAtlas;
					if(originUrl) this.__sources[originUrl] = this.__sources[url];
				}

				// convert to texture
				const atlasSrcUrl = canvas.toDataURL();
				const atlasImage = await loadImage(atlasSrcUrl);
				atlasTexture.fromImage(atlasImage);

				// push to textures list
				atlasTexture.utilized = arranged.utilized;
				this.__textures.push(atlasTexture);

				// get leftovers as next batch
				sources = arranged.leftovers;
			}

			// done!
			resolve();
		});
	}

	/**
	 * Get a list with all textures in atlas.
	 * @returns Textures in atlas.
	 */
	public get textures(): TextureAsset[] {
		return this.__textures.slice(0);
	}

	/**
	 * Get texture asset and source rectangle for a desired image URL.
	 * @param url URL to fetch texture and source from. Can be full URL, relative URL, or absolute URL starting from /.
	 * @returns Texture in atlas asset, or null if not found.
	 */
	public getTexture(url: string): TextureAtlasAsset | null {
		return this.__sources[url] || null;
	}

	/**
	 * @inheritdoc
	 */
	public get valid(): boolean {
		return Boolean(this.__textures.length);
	}

	/**
	 * @inheritdoc
	 */
	public destroy(): void {
		for(const texture of this.__textures) texture.destroy();
		this.__textures = [];
		this.__sources = {};
	}
}

/**
 * Efficiently arrange textures into minimal size area with maximum efficiency.
 * @private
 * @param {Array<Image>} sourceImages Array of images to pack.
 * @param maxAtlasWidth Max width for result area.
 * @param maxAtlasHeight Max height for result area.
 * @param extraMargins Extra pixels to add between textures.
 */
function arrangeTextures(sourceImages: unknown[], maxAtlasWidth?: number, maxAtlasHeight?: number, extraMargins?: Vector2) {
	// default max width and height
	maxAtlasWidth = maxAtlasWidth || gl.MAX_TEXTURE_SIZE;
	maxAtlasHeight = maxAtlasHeight || gl.MAX_TEXTURE_SIZE;

	// use the sorter algorithm
	const result = ItemsSorter.arrangeRectangles(sourceImages, (width: number) => {

		// make width a power of 2
		let power = 1;
		while(power < width) power *= 2;
		width = power;

		// return new width and make sure don't exceed max size
		return Math.min(width, maxAtlasWidth);

	}, extraMargins);

	// exceed max limit?
	if(result.height > maxAtlasHeight) {

		// adjust result height
		result.height = maxAtlasHeight;

		// remove all textures that are outside limits
		result.leftovers = [];
		for(let i = result.rectangles.length - 1; i >= 0; --i) {
			const currRect = result.rectangles[i];
			if(currRect.y + currRect.height > maxAtlasHeight) {
				result.rectangles.splice(i, 1);
				result.leftovers.push(currRect.source);
			}
		}
	}

	// return result
	return result;
}

/**
 * Load an image and return a promise.
 * @private
 */
function loadImage(path: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "Anonymous"; // to avoid CORS if used with Canvas
		img.src = path;
		img.__origin_url = path;
		img.onload = () => resolve(img);
		img.onerror = e => reject(e);
	});
}

/**
 * Convert list of sources that are either Image instances or URL strings to fully loaded Image instances.
 * Wait for image loading if needed.
 */
async function loadAllSources(sources: (string | HTMLImageElement)[]) {
	return new Promise(async (resolve, reject) => {

		// make sure all sources are image instances
		const waitFor = [];
		const images = [];
		for(let i = 0; i < sources.length; ++i) {

			// get current image / source
			const curr = sources[i];

			// if its source url:
			if(typeof curr === "string") waitFor.push(loadImage(curr));
			// if its an image instance:
			else if(curr instanceof Image) {

				// if ready, push as-is
				if(curr.width) images.push(curr);
				// if not ready, push to wait list
				else {
					waitFor.push(new Promise((resolve, reject) => {
						curr.onload = resolve(curr);
						curr.onerror = reject;
					}));
				}
			}
			// unknown type
			else {
				reject(`Invalid source type: ${curr}. All sources must be either Image instances or URLs (string).`);
			}
		}

		// wait for all images that are loading
		for(const loadPromise of waitFor) images.push(await loadPromise);

		// return result
		resolve(images);
	});
}
