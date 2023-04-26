export = TextureAssetBase;
/**
 * Base type for all texture asset types.
 */
declare class TextureAssetBase extends Asset {
    /** @inheritdoc */
    constructor(url: any);
    _filter: string;
    _wrapMode: string;
    /**
     * Set texture magnifying filter.
     * @see Shaku.gfx.TextureFilterModes
     * @param {TextureFilterMode} value Filter mode to use or null to use default.
     */
    set filter(arg: string);
    /**
     * Get texture magnifying filter, or null to use default.
     * @see Shaku.gfx.TextureFilterModes
     */
    get filter(): string;
    /**
     * Set texture wrapping mode.
     * @see Shaku.gfx.TextureWrapModes
     * @param {TextureWrapMode} value Wrapping mode to use or null to use default.
     */
    set wrapMode(arg: string);
    /**
     * Get texture wrapping mode, or null to use default.
     * @see Shaku.gfx.TextureWrapModes
     */
    get wrapMode(): string;
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
    getSize(): Vector2;
    /**
     * Get texture instance for WebGL.
     */
    get _glTexture(): void;
}
import Asset = require("./asset");
import Vector2 = require("../utils/vector2");
//# sourceMappingURL=texture_asset_base.d.ts.map