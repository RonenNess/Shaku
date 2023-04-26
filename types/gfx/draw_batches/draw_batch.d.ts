export = DrawBatch;
/**
 * Base class for a drawing batch, used to draw a collection of sprites or shapes.
 */
declare class DrawBatch {
    __currDrawingParams: any;
    __staticBuffers: boolean;
    __drawing: boolean;
    /**
     * Make the batch buffers static.
     * This means you won't be able to change the drawings in this batch once end() is called, but you'll be able to redraw
     * the batch with different effects and transformations without copying any data, and much faster.
     * This also free up some internal arrays, thus reducing the memory used for this batch.
     * Note: must be called after 'begin()' and right before the 'end()' call.
     */
    makeStatic(): void;
    /**
     * Get the default effect to use for this drawing batch type.
     * @returns {Effect} Default effect to use for this drawing batch.
     */
    get defaultEffect(): Effect;
    /**
     * Get the BuffersUsage enum.
     * @see BuffersUsage
     */
    get BuffersUsage(): {
        StaticDraw: string;
        DynamicDraw: string;
        StreamDraw: string;
    };
    /**
     * Destroy the batch and free any resources assigned to it.
     */
    destroy(): void;
    /**
     * Return if the batch was destroyed.
     * @returns {Boolean} True if batch was destoryed.
     */
    get isDestroyed(): boolean;
    /**
     * Throw exception if batch was destoryed.
     * @private
     */
    private __validateBatch;
    /**
     * Set the way we mark the buffers we pass to the GPU based on expected behavior.
     * Use StreamDraw if you want to set buffers once, and use them in GPU few times.
     * Use DynamicDraw if you want to set buffers many times, and use them in GPU many times.
     * Use StaticDraw if you want to set buffers once, and use them in GPU many times.
     * @param {BuffersUsage} usage Buffers usage.
     */
    setBuffersUsage(usage: BuffersUsage): void;
    __buffersUsage: any;
    /**
     * Return if the batch is currently drawing.
     * @returns {Boolean} If the batch began drawing.
     */
    get isDrawing(): boolean;
    /**
     * Throw exception if batch is not currently drawing.
     * @private
     */
    private __validateDrawing;
    /**
     * Start drawing this batch.
     * You must call this before doing any draw calls.
     * @param {BlendModes=} blendMode Blend mode to draw this batch in.
     * @param {Effect=} effect Effect to use. If not defined will use this batch type default effect.
     * @param {Matrix=} transform Optional transformations to apply on all sprites.
     * @param {*=} overrideEffectFlags Optional flags to override effect's defaults. Possible keys: {enableDepthTest, enableFaceCulling, enableStencilTest, enableDithering}.
     */
    begin(blendMode?: {
        AlphaBlend: string;
        Opaque: string;
        Additive: string;
        Multiply: string;
        Subtract: string;
        Screen: string;
        /**
         * Create the draw batch.
         */
        Overlay: string;
        Invert: string;
        Darken: string;
        DestIn: string;
        DestOut: string;
    } | undefined, effect?: Effect, transform?: Matrix | undefined, overrideEffectFlags?: any | undefined): void;
    /**
     * Finish drawing without presenting on screen.
     */
    endWithoutDraw(): void;
    /**
     * End drawing and present whatever left in buffers on screen.
     */
    end(): void;
    /**
     * Draw whatever is currently in buffers without ending the draw batch.
     */
    present(): void;
    /**
     * Clear this buffer from any drawings in it.
     * Called internally if 'preserveBuffers' is not true.
     */
    clear(): void;
    /**
     * Return if this batch was turned static.
     * @returns {Boolean} True if its a static batch you can no longer change.
     */
    get isStatic(): boolean;
    /**
     * Get the default blend mode to use for this drawing batch.
     */
    get defaultBlendMode(): string;
    /**
     * Draw current batch with set drawing params.
     * @private
     */
    private _drawBatch;
    /**
     * Called internally after we set the effect and texture and before we start rendering batch.
     * @private
     */
    private _onSetEffect;
}
declare namespace DrawBatch {
    const _gfx: any;
}
import { BuffersUsage } from "./buffers_usage";
import Matrix = require("../matrix");
//# sourceMappingURL=draw_batch.d.ts.map