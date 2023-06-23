export = SpriteBatchBase;
/**
 * Base class for sprite-based rendering, ie vertices with textures.
 */
declare class SpriteBatchBase extends DrawBatch {
    /**
     * Create the sprites batch.
     * @param {Number=} batchSpritesCount Internal buffers size, in sprites count (sprite = 4 vertices). Bigger value = faster rendering but more RAM.
     * @param {Boolean=} enableVertexColor If true (default) will support vertex color.
     * @param {Boolean=} enableNormals If true (not default) will support vertex normals.
     */
    constructor(batchSpritesCount?: number | undefined, enableVertexColor?: boolean | undefined, enableNormals?: boolean | undefined);
    /**
     * How many quads this batch can hold.
     * @private
     */
    private __maxQuadsCount;
    /**
     * How many quads we currently have.
     * @private
     */
    private __quadsCount;
    /**
     * Indicate there were changes in buffers.
     * @private
     */
    private __dirty;
    /**
     * Optional method to trigger when sprite batch overflows and can't contain any more quads.
     * @type {Function}
     * @name SpriteBatch#onOverflow
     */
    onOverflow: Function;
    /**
     * If true, will floor vertices positions before pushing them to batch.
     * @type {Boolean}
     * @name SpriteBatch#snapPixels
     */
    snapPixels: boolean;
    /**
     * If true, will cull quads that are not visible in screen when adding them by default.
     * Note: will cull based on screen region during the time of adding sprite, not the time of actually rendering it.
     * @type {Boolean}
     * @name SpriteBatch#cullOutOfScreen
     */
    cullOutOfScreen: boolean;
    _buffers: {
        positionBuffer: any;
        positionArray: Float32Array;
        textureCoordBuffer: any;
        textureArray: Float32Array;
        colorsBuffer: any;
        colorsArray: Float32Array;
        normalsBuffer: any;
        normalsArray: Float32Array;
        indexBuffer: any;
    };
    __indicesType: any;
    /**
     * Set a new active texture and draw batch if needed.
     * @private
     */
    private _updateTexture;
    /**
     * Get if this sprite batch support vertex color.
     * @returns {Boolean} True if support vertex color.
     */
    get supportVertexColor(): boolean;
    /**
     * Add sprite or sprites to batch.
     * @param {Sprite|Array<Sprite>} sprites Sprite or multiple sprites to draw.
     * @param {Matrix=} transform Optional transformations to apply on sprite vertices. Won't apply on static sprites.
     * @param {Boolean=} cullOutOfScreen If true, will cull sprites that are not visible in currently set rendering region.
     */
    drawSprite(sprites: Sprite | Array<Sprite>, transform?: Matrix | undefined, cullOutOfScreen?: boolean | undefined): void;
    /**
     * Get how many quads are currently in batch.
     * @returns {Number} Quads in batch count.
     */
    get quadsInBatch(): number;
    /**
     * Get how many quads this sprite batch can contain.
     * @returns {Number} Max quads count.
     */
    get maxQuadsCount(): number;
    /**
     * Check if this batch is full.
     * @returns {Boolean} True if batch is full.
     */
    get isFull(): boolean;
    /**
     * Called when the batch becomes full while drawing and there's no handler.
     * @private
     */
    private _handleFullBuffer;
    #private;
}
import DrawBatch = require("./draw_batch");
import Matrix = require("../../utils/matrix.js");
//# sourceMappingURL=sprite_batch_base.d.ts.map