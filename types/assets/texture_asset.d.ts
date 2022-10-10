export = TextureAsset;
/**
 * A loadable texture asset.
 * This asset type loads an image from URL or source, and turn it into a texture.
 */
declare class TextureAsset extends Asset {
    /**
     * Set the WebGL context.
     * @private
     */
    private static _setWebGl;
    /** @inheritdoc */
    constructor(url: any);
    _image: new (width?: number, height?: number) => HTMLImageElement;
    _width: number;
    _height: number;
    _texture: any;
    _filter: {
        TextureFilterModes: {
            Nearest: string;
            Linear: string;
            NearestMipmapNearest: string;
            LinearMipmapNearest: string;
            NearestMipmapLinear: string;
            LinearMipmapLinear: string;
        };
    };
    _wrapMode: {
        TextureWrapModes: {
            Clamp: string;
            Repeat: string;
            RepeatMirrored: string;
        };
    };
    _ctxForPixelData: CanvasRenderingContext2D;
    /**
     * Set texture magnifying filter.
     * @see Shaku.gfx.TextureFilterModes
     * @param {TextureFilterModes} value Filter mode to use or null to use default.
     */
    set filter(arg: {
        TextureFilterModes: {
            Nearest: string;
            Linear: string;
            NearestMipmapNearest: string;
            LinearMipmapNearest: string;
            NearestMipmapLinear: string;
            LinearMipmapLinear: string;
        };
    });
    /**
     * Get texture magnifying filter, or null to use default.
     * @see Shaku.gfx.TextureFilterModes
     */
    get filter(): {
        TextureFilterModes: {
            Nearest: string;
            Linear: string;
            NearestMipmapNearest: string;
            LinearMipmapNearest: string;
            NearestMipmapLinear: string;
            LinearMipmapLinear: string;
        };
    };
    /**
     * Set texture wrapping mode.
     * @see Shaku.gfx.TextureWrapModes
     * @param {TextureWrapModes} value Wrapping mode to use or null to use default.
     */
    set wrapMode(arg: {
        TextureWrapModes: {
            Clamp: string;
            Repeat: string;
            RepeatMirrored: string;
        };
    });
    /**
     * Get texture wrapping mode, or null to use default.
     * @see Shaku.gfx.TextureWrapModes
     */
    get wrapMode(): {
        TextureWrapModes: {
            Clamp: string;
            Repeat: string;
            RepeatMirrored: string;
        };
    };
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
    /**
     * Get raw image.
     * @returns {Image} Image instance.
     */
    get image(): new (width?: number, height?: number) => HTMLImageElement;
    /**
     * Get texture width.
     * @returns {Number} Texture width.
     */
    get width(): number;
    /**
     * Get texture height.
     * @returns {Number} Texture height.
     */
    get height(): number;
    /**
     * Get texture size as a vector.
     * @returns {Vector2} Texture size.
     */
    get size(): Vector2;
    /**
     * Get texture instance for WebGL.
     */
    get texture(): any;
    /**
     * Get pixel color from image.
     * @param {Number} x Pixel X value.
     * @param {Number} y Pixel Y value.
     * @returns {Color} Pixel color.
     */
    getPixel(x: number, y: number): Color;
}
import Asset = require("./asset");
import Vector2 = require("../utils/vector2");
import Color = require("../utils/color");
//# sourceMappingURL=texture_asset.d.ts.map