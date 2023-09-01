import { DrawBatch } from "./draw_batch";
import { SpriteBatch } from "./sprite_batch";

/**
 * 3D Sprites batch renderer.
 * Responsible to drawing 3D quads with textures on them.
 */
export class SpriteBatch3D extends SpriteBatch {
	/**
	 * Create the 3d sprites batch.
	 * @param {Number=} batchSpritesCount Internal buffers size, in sprites count (sprite = 4 vertices). Bigger value = faster rendering but more RAM.
	 * @param {Boolean=} enableNormals If true (not default) will support vertex normals.
	 * @param {Boolean=} enableBinormals If true (not default) will support vertex binormals.
	 * @param {Boolean=} enableTangents If true (not default) will support vertex tangents.
	 */
	public constructor(batchSpritesCount, enableNormals, enableBinormals, enableTangents) {
		super(batchSpritesCount, true, enableNormals, enableBinormals, enableTangents);
		this.__camera = this.#_gfx.createCamera3D();
		this.setPerspectiveCamera();
		this.camera.setViewLookat();
	}

	/**
	 * Get camera instance.
	 * @returns {Camera} Camera instance.
	 */
	get camera() {
		return this.__camera;
	}

	/**
	 * Set perspective camera.
	 * @param {Number=} fieldOfView Camera field of view.
	 * @param {Number=} aspectRatio Camera aspect ratio
	 * @param {Number=} zNear Z near plane.
	 * @param {Number=} zFar Z far plane.
	 */
	setPerspectiveCamera(fieldOfView, aspectRatio, zNear, zFar) {
		const camera = this.__camera;
		fieldOfView = fieldOfView || ((45 * Math.PI) / 180);
		aspectRatio = aspectRatio || (this.#_gfx.getRenderingSize().x / this.#_gfx.getRenderingSize().y);
		zNear = zNear || 0.1;
		zFar = zFar || 10000.0;
		camera.perspective(fieldOfView, aspectRatio, zNear, zFar);
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
	get supportVertexColor() {
		return true;
	}

	/**
	 * @inheritdoc
	 */
	get defaultEffect() {
		return this.#_gfx.builtinEffects.Sprites3d;
	}

	/**
	 * Set the camera for this batch.
	 * @param {Camera} camera Camera object to apply when drawing, or null if you want to set the camera manually.
	 */
	setCamera(camera) {
		this.__camera = camera;
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	_onSetEffect(effect, texture) {
		if(this.__camera.view) { effect.setViewMatrix(this.__camera.view); }
		if(this.__camera) { this.#_gfx.applyCamera(this.__camera); }
	}
}
