import { Matrix, Rectangle, Vector2 } from "../utils";

/**
 * Implements a Camera object.
 */
export class Camera {
	/**
	 * Create the camera.
	 * @param {Gfx} gfx The gfx manager instance.
	 */
	public constructor(gfx) {
		this.__region = null;
		this.__gfx = gfx;
		this.__viewport = null;
		this.orthographic();
	}

	/**
	 * Get camera's viewport (drawing region to set when using this camera).
	 * @returns {Rectangle} Camera's viewport as rectangle.
	 */
	get viewport() {
		return this.__viewport;
	}

	/**
	 * Set camera's viewport.
	 * @param {Rectangle} viewport New viewport to set or null to not use any viewport when using this camera.
	 */
	set viewport(viewport) {
		this.__viewport = viewport;
		return viewport;
	}

	/**
	 * Get the region this camera covers.
	 * @returns {Rectangle} region this camera covers.
	 */
	getRegion() {
		return this.__region.clone();
	}

	/**
	 * Make this camera an orthographic camera with offset.
	 * @param {Vector2} offset Camera offset (top-left corner).
	 * @param {Boolean} ignoreViewportSize If true, will take the entire canvas size for calculation and ignore the viewport size, if set.
	 * @param {Number} near Near clipping plane.
	 * @param {Number} far Far clipping plane.
	 */
	orthographicOffset(offset, ignoreViewportSize, near, far) {
		let renderingSize = (ignoreViewportSize || !this.viewport) ? this.__gfx.getCanvasSize() : this.viewport.getSize();
		let region = new Rectangle(offset.x, offset.y, renderingSize.x, renderingSize.y);
		this.orthographic(region, near, far);
	}

	/**
	 * Make this camera an orthographic camera.
	 * @param {Rectangle} region Camera left, top, bottom and right. If not set, will take entire canvas.
	 * @param {Number} near Near clipping plane.
	 * @param {Number} far Far clipping plane.
	 */
	orthographic(region, near, far) {
		if(region === undefined) {
			region = this.__gfx._internal.getRenderingRegionInternal();
		}
		this.__region = region;
		this.projection = Matrix.createOrthographic(region.left, region.right, region.bottom, region.top, near || -1, far || 400);
	}
}

// export the camera object
