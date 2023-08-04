import _logger from "../../logger.js";
import SpritesGroup from "../sprites_group";
import DrawBatch from "./draw_batch";
import SpriteBatchBase from "./sprite_batch_base";

const _loggggger = _logger.getLogger("gfx - effect"); // TODO




import { Color } from "../../utils";

/**
 * Text sprite batch renderer.
 * Responsible to drawing a batch of characters sprites.
 */
class TextSpriteBatch extends SpriteBatchBase {
	/**
	 * Create the text sprites batch.
	 * @param {Number=} batchSpritesCount Internal buffers size, in sprites count (sprite = 4 vertices). Bigger value = faster rendering but more RAM.
	 */
	constructor(batchSpritesCount) {
		super(batchSpritesCount, true);

		/**
		 * If true, will render as Msdf Fonts.
		 * @type {Boolean}
		 * @name TextSpriteBatch#msdfFont
		 */
		this.msdfFont = false;

		/**
		 * If bigger than 0, will draw outline.
		 * Currently not supported with msdf fonts.
		 * Must be set before begin() is called.
		 * @type {Number}
		 * @name TextSpriteBatch#outlineWeight
		 */
		this.outlineWeight = 0;

		/**
		 * Outline color, when outlineWeight is set.
		 * Must be set before begin() is called.
		 * @type {Color}
		 * @name TextSpriteBatch#outlineColor
		 */
		this.outlineColor = Color.black;
	}

	/**
	 * Get the gfx manager.
	 * @private
	 */
	get #_gfx() {
		return DrawBatch._gfx;
	}

	/**
	 * Get the web gl instance.
	 * @private
	 */
	get #_gl() {
		return DrawBatch._gfx._internal.gl;
	}

	/**
	 * @inheritdoc
	 */
	get defaultEffect() {
		return this.msdfFont ?
			this.#_gfx.builtinEffects.MsdfFont :
			(this.outlineWeight ? this.#_gfx.builtinEffects.SpritesWithOutline : this.#_gfx.builtinEffects.Sprites);
	}

	/**
	 * Add text sprites group to batch.
	 * @param {SpritesGroup} textGroup Text sprite group to draw.
	 * @param {Boolean} cullOutOfScreen If true, will cull out sprites that are not visible in screen.
	 */
	drawText(textGroup, cullOutOfScreen) {
		let transform = textGroup.getTransform();
		this.drawSprite(textGroup._sprites, transform, cullOutOfScreen);
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	_drawBatch() {
		// extract texture
		let texture = this.__currDrawingParams.texture;

		// sanity for msdf font
		if(this.msdfFont && !(texture.isMsdfFontTextureAsset)) {
			_logger.warn("Trying to render an MSDF font but using an asset that isn't an instance of 'MsdfFontTextureAsset'!");
		}

		// sanity for none msdf font
		if(!this.msdfFont && !(texture.isFontTextureAsset)) {
			_logger.warn("Trying to render text sprites but using an asset that isn't an instance of 'FontTextureAsset'!");
		}

		// set default effect and blend mode
		let effect = this.__currDrawingParams.effect || this.defaultEffect;

		// setup outline
		if(this.outlineWeight) {
			effect.setOutline(this.outlineWeight, this.outlineColor);
		}

		// extract font texture and set in sprite batch before calling internal draw
		let prevFontTexture = this.__currDrawingParams.texture;
		this.__currDrawingParams.texture = texture.texture;
		super._drawBatch();
		this.__currDrawingParams.texture = prevFontTexture;
	}
}

// export the text sprite batch class
export default TextSpriteBatch;
