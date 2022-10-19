export = SpriteBatch;
/**
 * Sprite batch renderer, responsible on drawing a batch of sprites with as little draw calls as possible.
 */
declare class SpriteBatch {
    /**
     * Create the spritebatch.
     * @param {Gfx} gfx Gfx manager.
     */
    constructor(gfx: Gfx);
    _gfx: Gfx;
    _gl: any;
    _positions: any;
    _uvs: any;
    _colors: any;
    _positionsBuff: any;
    _uvsBuff: any;
    _colorsBuff: any;
    _indexBuff: any;
    /**
     * If true, will floor vertices positions before pushing them to batch.
     */
    snapPixels: boolean;
    /**
     * If true, will slightly offset texture uv when rotating sprites, to prevent bleeding while using texture atlas.
     */
    applyAntiBleeding: boolean;
    /**
     * Create and return a new vertex.
     * @param {Vector2} position Vertex position.
     * @param {Vector2} textureCoord Vertex texture coord.
     * @param {Color} color Vertex color.
     * @returns {Vertex} new vertex object.
     */
    vertex(position: Vector2, textureCoord: Vector2, color: typeof import("../utils/color")): Vertex;
    /**
     * Get if batch is currently drawing.
     * @returns {Boolean} True if batch is drawing.
     */
    get drawing(): boolean;
    /**
     * Start drawing a batch.
     * @param {Effect} effect Effect to use.
     * @param {Matrix} transform Optional transformations to apply on all sprites.
     */
    begin(effect: Effect, transform: Matrix): void;
    _effect: any;
    _currBlend: any;
    _currTexture: any;
    _currBatchCount: number;
    _transform: Matrix;
    _drawing: boolean;
    /**
     * Finish drawing batch (and render whatever left in buffers).
     */
    end(): void;
    /**
     * Set the currently active texture.
     * @param {Texture} texture Texture to set.
     */
    setTexture(texture: Texture): void;
    /**
     * Add sprite to batch.
     * Note: changing texture or blend mode may trigger a draw call.
     * @param {Sprite|Array<Sprite>} sprites Sprite or multiple sprites to draw.
     * @param {Boolean} cullOutOfScreen If true, will cull sprites that are not visible.
     */
    draw(sprites: Sprite | Array<Sprite>, cullOutOfScreen: boolean): void;
    /**
     * Push vertices directly to batch.
     * @param {Array<Vertex>} vertices Vertices to push.
     */
    pushVertices(vertices: Array<Vertex>): void;
    /**
     * How many sprites we can have in batch, in total.
     */
    get batchSpritesCount(): any;
    /**
     * Draw current batch.
     * @private
     */
    private _drawCurrentBatch;
    _currIndices: any;
}
import Vector2 = require("../utils/vector2");
import Vertex = require("./vertex");
import Matrix = require("./matrix");
//# sourceMappingURL=sprite_batch.d.ts.map