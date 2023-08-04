

const { BlendModes } = require('../blend_modes');
const { BuffersUsage } = require('./buffers_usage');

import _logger from "../../logger.js";
import Matrix from "../../utils/matrix";

const _loggggger = _logger.getLogger(gfx - draw - batch); // TODO


/**
 * Base class for a drawing batch, used to draw a collection of sprites or shapes.
 */
class DrawBatch {
	/**
	 * Create the draw batch.
	 */
	constructor() {
		// set default usage mode
		this.setBuffersUsage(BuffersUsage.StreamDraw);

		// will have values after calling 'begin()'
		this.__currDrawingParams = null;

		// if true, it means the buffers have been frozen and can't be changed
		this.__staticBuffers = false;

		// are we currently between 'begin()' and 'end()' calls
		this.__drawing = false;
	}

	/**
	 * Make the batch buffers static.
	 * This means you won't be able to change the drawings in this batch once end() is called, but you'll be able to redraw
	 * the batch with different effects and transformations without copying any data, and much faster.
	 * This also free up some internal arrays, thus reducing the memory used for this batch.
	 * Note: must be called after 'begin()' and right before the 'end()' call.
	 */
	makeStatic() {
		this.__validateBatch();
		if(!this.isDrawing) { throw new Error("Must call 'makeStatic()' between 'begin()' and 'end()'."); }
		this.setBuffersUsage(this.BuffersUsage.StaticDraw);
		this.__staticBuffers = true;
	}

	/**
	 * Get the default effect to use for this drawing batch type.
	 * @returns {Effect} Default effect to use for this drawing batch.
	 */
	get defaultEffect() {
		return null;
	}

	/**
	 * Get the BuffersUsage enum.
	 * @see BuffersUsage
	 */
	get BuffersUsage() {
		return BuffersUsage;
	}

	/**
	 * Destroy the batch and free any resources assigned to it.
	 */
	destroy() {
	}

	/**
	 * Return if the batch was destroyed.
	 * @returns {Boolean} True if batch was destoryed.
	 */
	get isDestroyed() {
		return false;
	}

	/**
	 * Throw exception if batch was destoryed.
	 * @private
	 */
	__validateBatch() {
		if(this.isDestroyed) {
			throw new Error("Can't perform this action after the batch was destroyed!");
		}
	}

	/**
	 * Set the way we mark the buffers we pass to the GPU based on expected behavior.
	 * Use StreamDraw if you want to set buffers once, and use them in GPU few times.
	 * Use DynamicDraw if you want to set buffers many times, and use them in GPU many times.
	 * Use StaticDraw if you want to set buffers once, and use them in GPU many times.
	 * @param {BuffersUsage} usage Buffers usage.
	 */
	setBuffersUsage(usage) {
		switch(usage) {
			case BuffersUsage.DynamicDraw:
				this.__buffersUsage = DrawBatch._gfx._internal.gl.DYNAMIC_DRAW;
				break;

			case BuffersUsage.StreamDraw:
				this.__buffersUsage = DrawBatch._gfx._internal.gl.STREAM_DRAW;
				break;

			case BuffersUsage.StaticDraw:
				this.__buffersUsage = DrawBatch._gfx._internal.gl.STATIC_DRAW;
				break;

			default:
				this.__buffersUsage = DrawBatch._gfx._internal.gl.DYNAMIC_DRAW;
				_logger.warn("Illegal buffers usage value: " + usage);
				break;
		}

	}

	/**
	 * Return if the batch is currently drawing.
	 * @returns {Boolean} If the batch began drawing.
	 */
	get isDrawing() {
		return this.__drawing;
	}

	/**
	 * Throw exception if batch is not currently drawing.
	 * @private
	 */
	__validateDrawing(validateNotStatic) {
		if(!this.isDrawing) {
			throw new Error("Can't perform this action without calling 'begin()' first!");
		}
		if(validateNotStatic && this.__staticBuffers) {
			throw new Error("Can't perform this action after batch has turned static!");
		}
	}

	/**
	 * Start drawing this batch.
	 * You must call this before doing any draw calls.
	 * @param {BlendModes=} blendMode Blend mode to draw this batch in.
	 * @param {Effect=} effect Effect to use. If not defined will use this batch type default effect.
	 * @param {Matrix=} transform Optional transformations to apply on all sprites.
	 * @param {*=} overrideEffectFlags Optional flags to override effect's defaults. Possible keys: {enableDepthTest, enableFaceCulling, enableStencilTest, enableDithering}.
	 */
	begin(blendMode, effect, transform, overrideEffectFlags) {
		// sanity - not already drawing
		if(this.isDrawing) {
			throw new Error("Can't call Drawing Batch 'begin' twice without calling 'end()' first!");
		}

		// sanity - batch is not destoryed
		this.__validateBatch();

		// we might still have values in this.__currDrawingParams if 'preserve buffers' is true.
		// if so, we extract last texture from it
		let lastTexture = this.__currDrawingParams ? (this.__currDrawingParams.texture || null) : null;

		// set new drawing params
		effect = effect || this.defaultEffect;
		blendMode = blendMode || this.defaultBlendMode;
		this.__currDrawingParams = {
			blendMode: blendMode,
			effect: effect,
			transform: transform || Matrix.identity,
			overrideEffectFlags: overrideEffectFlags,
			hasVertexColor: effect.hasVertexColor,
			texture: lastTexture
		};

		// we are now drawing
		this.__drawing = true;
	}

	/**
	 * Finish drawing without presenting on screen.
	 */
	endWithoutDraw() {
		// sanity
		this.__validateBatch();
		this.__validateDrawing(false);

		// clear buffers and drawing params
		if(!this.__staticBuffers) {
			this.clear();
			this.__currDrawingParams = null;
		}

		// no longer drawing
		this.__drawing = false;
	}

	/**
	 * End drawing and present whatever left in buffers on screen.
	 */
	end() {
		// sanity
		this.__validateBatch();
		this.__validateDrawing(false);

		// draw current batch data
		this._drawBatch();

		// clear buffers and drawing params
		if(!this.__staticBuffers) {
			this.clear();
			this.__currDrawingParams = null;
		}

		// no longer drawing
		this.__drawing = false;
	}

	/**
	 * Draw whatever is currently in buffers without ending the draw batch.
	 */
	present() {
		this._drawBatch();
	}

	/**
	 * Clear this buffer from any drawings in it.
	 * Called internally if 'preserveBuffers' is not true.
	 */
	clear() {
		if(this.__staticBuffers) {
			throw new Error("Can't clear batch after it was turned static. You can only destroy it.");
		}
	}

	/**
	 * Return if this batch was turned static.
	 * @returns {Boolean} True if its a static batch you can no longer change.
	 */
	get isStatic() {
		return this.__staticBuffers;
	}

	/**
	 * Get the default blend mode to use for this drawing batch.
	 */
	get defaultBlendMode() {
		return BlendModes.AlphaBlend;
	}

	/**
	 * Draw current batch with set drawing params.
	 * @private
	 */
	_drawBatch() {
		// sanity
		this.__validateBatch();
		this.__validateDrawing(false);

		// get default effect
		let effect = this.__currDrawingParams.effect;

		// get the gfx manager
		let gfx = DrawBatch._gfx;

		// set effect
		gfx._internal.useEffect(effect, this.__currDrawingParams.overrideEffectFlags);

		// set blend mode if needed
		gfx._internal.setBlendMode(this.__currDrawingParams.blendMode);

		// set world matrix
		effect.setWorldMatrix(this.__currDrawingParams.transform);

		// set active texture
		gfx._internal.setActiveTexture(this.__currDrawingParams.texture);

		// trigger on set effect
		this._onSetEffect(effect, this.__currDrawingParams.texture);
	}

	/**
	 * Called internally after we set the effect and texture and before we start rendering batch.
	 * @private
	 */
	_onSetEffect(effect, texture) {
	}
}

// will be set by the Gfx manager during init
DrawBatch._gfx = null;

// export the draw batch class
export default DrawBatch;
