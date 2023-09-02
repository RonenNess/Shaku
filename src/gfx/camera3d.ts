import { Frustum, Matrix, Vector2, Vector3 } from "../utils";
import { Camera } from "./camera";
import { Gfx } from "./gfx";

/**
 * Implements a 3d Camera object.
 */
export class Camera3D extends Camera {
	private static DEFAULT_LOOK_AT = new Vector3(0, 5, -10);
	private static DEFAULT_LOOK_AT_EYES = new Vector3(0, 0, -500);
	private static DEFAULT_LOOK_AT_TARGET = Vector3.zeroReadonly;
	private static DEFAULT_PERSPECTIVE_FOV = Math.PI / 2;
	private static DEFAULT_PERSPECTIVE_ASPECT_RATIO = 1 / 1;
	private static DEFAULT_PERSPECTIVE_NEAR = 0.1;
	private static DEFAULT_PERSPECTIVE_FAR = 1000;

	/**
	 * Camera view matrix.
	 * You can set it manually, or use "setViewLookat" helper function.
	 */
	private view: Matrix | null;

	/**
	 * Create the camera.
	 * @param gfx The gfx manager instance.
	 */
	public constructor(gfx: Gfx) {
		super(gfx);
		this.projection = null;
		this.view = null;

		// build perspective camera by default
		this.perspective();
		this.setViewLookat(Camera3D.DEFAULT_LOOK_AT, Vector3.zero());
	}

	/**
	 * Calc and return the currently-visible view frustum, based on active camera.
	 * @returns Visible frustum.
	 */
	public calcVisibleFrustum(): Frustum {
		if(!this.projection || !this.view) throw new Error("You must set both projection and view matrices to calculate visible frustum!");
		const frustum = new Frustum();
		frustum.setFromProjectionMatrix(Matrix.multiply(this.projection, this.view));
		return frustum;
	}

	/**
	 * Set camera view matrix from source position and lookat.
	 * @param eyePosition Camera source position.
	 * @param lookAt Camera look-at target.
	 */
	public setViewLookat(
		eyePosition = Camera3D.DEFAULT_LOOK_AT_EYES,
		lookAt = Camera3D.DEFAULT_LOOK_AT_TARGET
	): void {
		this.view = Matrix.createLookAt(eyePosition, lookAt, Vector3.upReadonly);
	}

	/**
	 * Get 3d direction vector of this camera.
	 * @returns 3D direction vector.
	 */
	public getDirection(): Vector3 {
		const e = this.view.values;
		return new Vector3(- e[8], - e[9], - e[10]).normalizeSelf();
	}

	/**
	 * Get view projection matrix.
	 * @returns View-projection matrix.
	 */
	public getViewProjection(): Matrix {
		return Matrix.multiply(this.view, this.projection);
	}

	/**
	 * Get projection view matrix.
	 * @returns Projection-view matrix.
	 */
	public getProjectionView(): Matrix {
		return Matrix.multiply(this.projection, this.view);
	}

	/**
	 * Make this camera a perspective camera.
	 * @param fieldOfView Field of view angle in radians.
	 * @param aspectRatio Aspect ratio.
	 * @param near Near clipping plane.
	 * @param far Far clipping plane.
	 */
	public perspective(
		fieldOfView = Camera3D.DEFAULT_PERSPECTIVE_FOV,
		aspectRatio = Camera3D.DEFAULT_PERSPECTIVE_ASPECT_RATIO,
		near = Camera3D.DEFAULT_PERSPECTIVE_NEAR,
		far = Camera3D.DEFAULT_PERSPECTIVE_FAR
	): void {
		this.projection = Matrix.createPerspective(fieldOfView, aspectRatio, near, far);
	}

	/**
	 * Unproject a 2d vector into 3D space.
	 * You can use this method to get the 3D direction the user points on with the mouse.
	 * @param point Vector to unproject.
	 * @param zDistance Distance from camera to locate the 3D point at (0 = near plane, 1 = far plane).
	 * @returns Unprojected point in 3D space.
	 */
	public unproject(point: Vector2, zDistance = 0): Vector3 {
		function project<O extends [number, number, number, ...number[]]>(out: O, vec: [number, number, number], m: number[]): O {
			const [x, y, z] = vec;
			const [
				a00, a01, a02, a03,
				a10, a11, a12, a13,
				a20, a21, a22, a23,
				a30, a31, a32, a33,
			] = m;

			const lw = 1 / (x * a03 + y * a13 + z * a23 + a33);

			out[0] = (x * a00 + y * a10 + z * a20 + a30) * lw;
			out[1] = (x * a01 + y * a11 + z * a21 + a31) * lw;
			out[2] = (x * a02 + y * a12 + z * a22 + a32) * lw;
			return out;
		}

		function unproject(out: number[], vec: [number, number, number], viewport: [number, number, number, number], invProjectionView: Matrix) {
			const [viewX, viewY, viewWidth, viewHeight] = viewport;
			let [x, y, z] = vec;

			x = x - viewX;
			y = viewHeight - y - 1;
			y = y - viewY;

			out[0] = (2 * x) / viewWidth - 1;
			out[1] = (2 * y) / viewHeight - 1;
			out[2] = 2 * z - 1;
			return project(out as [number, number, number], out as [number, number, number], invProjectionView.values);
		}

		const out: number[] = [];
		const projInverted = this.getProjectionView().inverted();
		const viewport = this.viewport || this.gfx.getRenderingRegion();
		unproject(out, [point.x, point.y, zDistance], [viewport.x, viewport.y, viewport.width, viewport.height], projInverted);
		return new Vector3(out[0], out[1], out[2]);
	}
}
