import { Gfx } from "..";
import { LoggerFactory, Matrix } from "../../utils";
import { BlendModes } from "../blend_modes";
import { Effect } from "../effects";
import { BuffersUsage } from "./buffers_usage";

const _logger = LoggerFactory.getLogger("gfx - draw - batch"); // TODO

/**
 * Base class for a drawing batch, used to draw a collection of sprites or shapes.
 */
export abstract class DrawBatch {
	// will be set by the Gfx manager during init
	public static _gfx: Gfx | null = null;

	public defaultEffect: Effect;
	public defaultBlendMode: BlendModes;

	private drawing: boolean;
	private staticBuffers: boolean;
	private currDrawingParams: unknown;
	private buffersUsage: unknown;

	/**
	 * Create the draw batch.
	 */
	public constructor() {
		// set default usage mode
		this.setBuffersUsage(BuffersUsage.STREAM_DRAW);

		// will have values after calling "begin()"
		this.currDrawingParams = null;

		// if true, it means the buffers have been frozen and can't be changed
		this.staticBuffers = false;

		// are we currently between "begin()" and "end()" calls
		this.drawing = false;
	}

	/**
	 * Make the batch buffers static.
	 * This means you won't be able to change the drawings in this batch once end() is called, but you'll be able to redraw
	 * the batch with different effects and transformations without copying any data, and much faster.
	 * This also free up some internal arrays, thus reducing the memory used for this batch.
	 * Note: must be called after "begin()" and right before the "end()" call.
	 */
	public makeStatic(): void {
		this.validateBatch();
		if(!this.isDrawing()) throw new Error("Must call 'makeStatic()' between 'begin()' and 'end()'.");
		this.setBuffersUsage(BuffersUsage.STATIC_DRAW);
		this.staticBuffers = true;
	}

	/**
	 * Set the way we mark the buffers we pass to the GPU based on expected behavior.
	 * Use StreamDraw if you want to set buffers once, and use them in GPU few times.
	 * Use DynamicDraw if you want to set buffers many times, and use them in GPU many times.
	 * Use StaticDraw if you want to set buffers once, and use them in GPU many times.
	 * @param usage Buffers usage.
	 */
	public setBuffersUsage(usage: BuffersUsage): void {
		switch(usage) {
			case BuffersUsage.DYNAMIC_DRAW: return this.buffersUsage = DrawBatch._gfx._internal.gl.DYNAMIC_DRAW;
			case BuffersUsage.STREAM_DRAW: return this.buffersUsage = DrawBatch._gfx._internal.gl.STREAM_DRAW;
			case BuffersUsage.STATIC_DRAW: return this.buffersUsage = DrawBatch._gfx._internal.gl.STATIC_DRAW;
		}
	}

	/**
	 * Return if the batch is currently drawing.
	 * @returns If the batch began drawing.
	 */
	public isDrawing(): boolean {
		return this.drawing;
	}

	/**
	 * Start drawing this batch.
	 * You must call this before doing any draw calls.
	 * @param blendMode Blend mode to draw this batch in.
	 * @param effect Effect to use. If not defined will use this batch type default effect.
	 * @param transform Optional transformations to apply on all sprites.
	 * @param overrideEffectFlags Optional flags to override effect's defaults. Possible keys: {enableDepthTest, enableFaceCulling, enableStencilTest, enableDithering}.
	 */
	public begin(blendMode = this.defaultBlendMode, effect = this.defaultEffect, transform?: Matrix, overrideEffectFlags?: { enableDepthTest?: boolean, enableFaceCulling?: boolean, enableStencilTest?: boolean, enableDithering?: boolean; }) {
		// sanity - not already drawing
		if(this.isDrawing()) throw new Error("Can't call Drawing Batch 'begin' twice without calling 'end()' first!");

		// sanity - batch is not destroyed
		this.validateBatch();

		// we might still have values in this.__currDrawingParams if "preserve buffers" is true.
		// if so, we extract last texture from it
		const lastTexture = this.currDrawingParams ? (this.currDrawingParams.texture || null) : null;

		// set new drawing params
		this.currDrawingParams = {
			blendMode: blendMode,
			effect: effect,
			transform: transform || Matrix.identity,
			overrideEffectFlags: overrideEffectFlags,
			hasVertexColor: effect.hasVertexColor,
			texture: lastTexture,
		};

		// we are now drawing
		this.drawing = true;
	}

	/**
	 * Finish drawing without presenting on screen.
	 */
	public endWithoutDraw(): void {
		// sanity
		this.validateBatch();
		this.validateDrawing(false);

		// clear buffers and drawing params
		if(!this.staticBuffers) {
			this.clear();
			this.currDrawingParams = null;
		}

		// no longer drawing
		this.drawing = false;
	}

	/**
	 * End drawing and present whatever left in buffers on screen.
	 */
	public end(): void {
		// sanity
		this.validateBatch();
		this.validateDrawing(false);

		// draw current batch data
		this.drawBatch();

		// clear buffers and drawing params
		if(!this.staticBuffers) {
			this.clear();
			this.currDrawingParams = null;
		}

		// no longer drawing
		this.drawing = false;
	}

	/**
	 * Draw whatever is currently in buffers without ending the draw batch.
	 */
	public present(): void {
		this.drawBatch();
	}

	/**
	 * Clear this buffer from any drawings in it.
	 * Called internally if "preserveBuffers" is not true.
	 */
	public clear(): void {
		if(this.staticBuffers) throw new Error("Can't clear batch after it was turned static. You can only destroy it.");
	}

	/**
	 * Return if this batch was turned static.
	 * @returns True if its a static batch you can no longer change.
	 */
	public isStatic(): boolean {
		return this.staticBuffers;
	}

	/**
	 * Get the default blend mode to use for this drawing batch.
	 */
	public getDefaultBlendMode(): BlendModes {
		return BlendModes.ALPHA_BLEND;
	}

	/**
	 * Throw exception if batch was destroyed.
	 */
	private validateBatch(): void {
		if(this.isDestroyed()) throw new Error("Can't perform this action after the batch was destroyed!");
	}

	/**
	 * Throw exception if batch is not currently drawing.
	 */
	private validateDrawing(validateNotStatic: boolean) {
		if(!this.isDrawing()) throw new Error("Can't perform this action without calling 'begin()' first!");
		if(validateNotStatic && this.staticBuffers) throw new Error("Can't perform this action after batch has turned static!");
	}

	/**
	 * Draw current batch with set drawing params.
	 */
	private drawBatch(): void {
		// sanity
		this.validateBatch();
		this.validateDrawing(false);

		// get default effect
		const effect = this.currDrawingParams.effect;

		// get the gfx manager
		const gfx = DrawBatch._gfx;

		// set effect
		gfx._internal.useEffect(effect, this.currDrawingParams.overrideEffectFlags);

		// set blend mode if needed
		gfx._internal.setBlendMode(this.currDrawingParams.blendMode);

		// set world matrix
		effect.setWorldMatrix(this.currDrawingParams.transform);

		// set active texture
		gfx._internal.setActiveTexture(this.currDrawingParams.texture);

		// trigger on set effect
		this.onSetEffect(effect, this.currDrawingParams.texture);
	}

	/**
	 * Called internally after we set the effect and texture and before we start rendering batch.
	 */
	private onSetEffect(effect, texture) {
	}

	/**
	 * Get the default effect to use for this drawing batch type.
	 * @returns Default effect to use for this drawing batch.
	 */
	public abstract getDefaultEffect(): Effect;

	/**
	 * Destroy the batch and free any resources assigned to it.
	 */
	public abstract destroy(): void;

	/**
	 * Return if the batch was destroyed.
	 * @returns True if batch was destroyed.
	 */
	public abstract isDestroyed(): boolean;
}
