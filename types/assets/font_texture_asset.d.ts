export = FontTextureAsset;
/**
 * A font texture asset, dynamically generated from loaded font and canvas.
 * This asset type creates an atlas of all the font's characters as textures, so we can later render them as sprites.
 */
declare class FontTextureAsset extends Asset {
    /** @inheritdoc */
    constructor(url: any);
    _fontName: any;
    _fontSize: any;
    _placeholderChar: any;
    _sourceRects: {};
    _texture: TextureAsset;
    _lineHeight: number;
    /**
     * Get line height.
     */
    get lineHeight(): number;
    /**
     * Get font name.
     */
    get fontName(): any;
    /**
     * Get font size.
     */
    get fontSize(): any;
    /**
     * Get placeholder character.
     */
    get placeholderCharacter(): any;
    /**
     * Get the texture.
     */
    get texture(): TextureAsset;
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
     * Get the source rectangle for a given character in texture.
     * @param {Character} character Character to get source rect for.
     * @returns {Rectangle} Source rectangle for character.
     */
    getSourceRect(character: Character): Rectangle;
    /**
     * When drawing the character, get the offset to add to the cursor.
     * @param {Character} character Character to get the offset for.
     * @returns {Vector2} Offset to add to the cursor before drawing the character.
     */
    getPositionOffset(character: Character): Vector2;
    /**
     * Get how much to advance the cursor when drawing this character.
     * @param {Character} character Character to get the advance for.
     * @returns {Number} Distance to move the cursor after drawing the character.
     */
    getXAdvance(character: Character): number;
}
declare namespace FontTextureAsset {
    const defaultCharactersSet: string;
}
import Asset = require("./asset");
import TextureAsset = require("./texture_asset");
import Vector2 = require("../utils/vector2");
import Rectangle = require("../utils/rectangle");
//# sourceMappingURL=font_texture_asset.d.ts.map