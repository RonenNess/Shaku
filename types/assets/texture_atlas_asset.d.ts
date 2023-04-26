export = TextureAtlasAsset;
/**
 * A texture atlas we can build at runtime to combine together multiple textures.
 */
declare class TextureAtlasAsset extends Asset {
    /**
     * Set the WebGL context.
     * @private
     */
    private static _setWebGl;
    /** @inheritdoc */
    constructor(url: any);
    __textures: any[];
    __sources: {};
    /**
     * Build the texture atlas.
     * @private
     * @param {Array<string>|Array<Image>} sources Source URLs or images to load into texture.
     * @param {Number=} maxWidth Optional texture atlas width limit.
     * @param {Number=} maxHeight Optional texture atlas height limit.
     * @param {Vector2=} extraMargins Extra pixels to add between textures.
     * @returns {Promise} Promise to resolve when done.
     */
    private _build;
    /**
     * Get a list with all textures in atlas.
     * @returns {Array<TextureAsset>} Textures in atlas.
     */
    get textures(): TextureAsset[];
    /**
     * Get texture asset and source rectangle for a desired image URL.
     * @param {String} url URL to fetch texture and source from. Can be full URL, relative URL, or absolute URL starting from /.
     * @returns {TextureInAtlasAsset} Texture in atlas asset, or null if not found.
     */
    getTexture(url: string): TextureInAtlasAsset;
}
import Asset = require("./asset");
import TextureAsset = require("./texture_asset");
import TextureInAtlasAsset = require("./texture_in_atlas_asset");
//# sourceMappingURL=texture_atlas_asset.d.ts.map