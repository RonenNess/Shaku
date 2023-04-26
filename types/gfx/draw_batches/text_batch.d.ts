export = TextSpriteBatch;
/**
 * Text sprite batch renderer.
 * Responsible to drawing a batch of characters sprites.
 */
declare class TextSpriteBatch extends SpriteBatchBase {
    /**
     * Create the text sprites batch.
     * @param {Number=} batchSpritesCount Internal buffers size, in sprites count (sprite = 4 vertices). Bigger value = faster rendering but more RAM.
     */
    constructor(batchSpritesCount?: number | undefined);
    /**
     * If true, will render as Msdf Fonts.
     * @type {Boolean}
     * @name TextSpriteBatch#msdfFont
     */
    msdfFont: boolean;
    /**
     * If bigger than 0, will draw outline.
     * Currently not supported with msdf fonts.
     * Must be set before begin() is called.
     * @type {Number}
     * @name TextSpriteBatch#outlineWeight
     */
    outlineWeight: number;
    /**
     * Outline color, when outlineWeight is set.
     * Must be set before begin() is called.
     * @type {Color}
     * @name TextSpriteBatch#outlineColor
     */
    outlineColor: typeof import("../../utils/color");
    /**
     * Add text sprites group to batch.
     * @param {SpritesGroup} textGroup Text sprite group to draw.
     * @param {Boolean} cullOutOfScreen If true, will cull out sprites that are not visible in screen.
     */
    drawText(textGroup: SpritesGroup, cullOutOfScreen: boolean): void;
    #private;
}
import SpriteBatchBase = require("./sprite_batch_base");
import SpritesGroup = require("../sprites_group");
//# sourceMappingURL=text_batch.d.ts.map