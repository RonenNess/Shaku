import { Matrix, Rectangle, Vector2 } from "../utils";
import { Gfx } from "./gfx";

/**
 * Implements a Camera object.
 */
export class Camera {
	private static DEFAULT_NEAR = -1;
	private static DEFAULT_FAR = 400;

	private region: Rectangle | null;
	private gfx: Gfx;
	private _viewport: Rectangle | null;

	/**
	 * Camera projection matrix.
	 * You can set it manually, or use "orthographicOffset" / "orthographic" / "perspective" helper functions.
	 */
	protected projection: Matrix | null;

	/**
	 * Create the camera.
	 * @param gfx The gfx manager instance.
	 */
	public constructor(gfx: Gfx) {
		this.region = null;
		this.gfx = gfx;
		this._viewport = null;
		this.orthographic();
	}

	/**
	 * Get camera's viewport (drawing region to set when using this camera).
	 * @returns Camera's viewport as rectangle.
	 */
	public get viewport(): Rectangle {
		return this._viewport;
	}

	/**
	 * Set camera's viewport.
	 * @param viewport New viewport to set or null to not use any viewport when using this camera.
	 */
	public set viewport(viewport: Rectangle | null) {
		this._viewport = viewport;
	}

	/**
	 * Get the region this camera covers.
	 * @returns region this camera covers.
	 */
	public getRegion(): Rectangle {
		return this.region.clone();
	}

	/**
	 * Make this camera an orthographic camera with offset.
	 * @param offset Camera offset (top-left corner).
	 * @param ignoreViewportSize If true, will take the entire canvas size for calculation and ignore the viewport size, if set.
	 * @param near Near clipping plane.
	 * @param far Far clipping plane.
	 */
	public orthographicOffset(offset: Vector2, ignoreViewportSize?: boolean, near?: number, far?: number): void {
		const renderingSize = (ignoreViewportSize || !this._viewport) ? this.gfx.getCanvasSize() : this._viewport.getSize();
		const region = new Rectangle(offset.x, offset.y, renderingSize.x, renderingSize.y);
		this.orthographic(region, near, far);
	}

	/**
	 * Make this camera an orthographic camera.
	 * @param region Camera left, top, bottom and right. If not set, will take entire canvas.
	 * @param near Near clipping plane.
	 * @param far Far clipping plane.
	 */
	public orthographic(region: Rectangle = this.gfx._internal.getRenderingRegionInternal(), near = Camera.DEFAULT_NEAR, far = Camera.DEFAULT_FAR): void {
		this.region = region;
		this.projection = Matrix.createOrthographic(region.left, region.right, region.bottom, region.top, near, far);
	}
}
