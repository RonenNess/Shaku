export = TextureAsset;
/**
 * A loadable texture asset.
 * This asset type loads an image from URL or source, and turn it into a texture.
 */
declare class TextureAsset extends TextureAssetBase {
    /**
     * Set the WebGL context.
     * @private
     */
    private static _setWebGl;
    _image: new (width?: number, height?: number) => HTMLImageElement;
    _width: number;
    _height: number;
    _texture: any;
    _ctxForPixelData: CanvasRenderingContext2D;
    /**
     * Create this texture as an empty render target.
     * @param {Number} width Texture width.
     * @param {Number} height Texture height.
     * @param {Number} channels Texture channels count. Defaults to 4 (RGBA).
     */
    createRenderTarget(width: number, height: number, channels: number): void;
    /**
     * Create texture from loaded image instance.
     * @see TextureAsset.load for params.
     * @param {Image} image Image to create texture from. Image must be loaded!
     * @param {*} params Optional additional params. See load() for details.
     */
    fromImage(image: new (width?: number, height?: number) => HTMLImageElement, params: any): void;
    /**
     * Create the texture from an image.
     * @see TextureAsset.load for params.
     * @param {Image|String} source Image or Image source URL to create texture from.
     * @param {*} params Optional additional params. See load() for details.
     * @returns {Promise} Promise to resolve when asset is ready.
     */
    create(source: (new (width?: number, height?: number) => HTMLImageElement) | string, params: any): Promise<any>;
    /** @inheritdoc */
    get _glTexture(): any;
    /**
     * Get pixel color from image.
     * Note: this method is quite slow, if you need to perform multiple queries consider using `getPixelsData()` once to get all pixels data instead.
     * @param {Number} x Pixel X value.
     * @param {Number} y Pixel Y value.
     * @returns {Color} Pixel color.
     */
    getPixel(x: number, y: number): Color;
    /**
     * Get a 2D array with pixel colors.
     * @param {Number=} x Offset X in texture to get. Defaults to 0.
     * @param {Number=} y Offset Y in texture to get. Defaults to 0.
     * @param {Number=} width How many pixels to get on X axis. Defaults to texture width - x.
     * @param {Number=} height How many pixels to get on Y axis. Defaults to texture height - y.
     * @returns {Array<Array<Color>>} A 2D array with all texture pixel colors.
     */
    getPixelsData(x?: number | undefined, y?: number | undefined, width?: number | undefined, height?: number | undefined): Array<Array<Color>>;
}
import TextureAssetBase = require("./texture_asset_base");
import Color = require("../utils/color");
//# sourceMappingURL=texture_asset.d.ts.map