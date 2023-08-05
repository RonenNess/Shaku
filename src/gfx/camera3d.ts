import Frustum from "../utils/frustum";
import Matrix from "../utils/matrix";
import Vector2 from "../utils/vector2";
import Vector3 from "../utils/vector3";
import Camera from "./camera";

/**
 * Implements a 3d Camera object.
 */
class Camera3D extends Camera {
	/**
	 * Create the camera.
	 * @param {Gfx} gfx The gfx manager instance.
	 */
	constructor(gfx) {
		super(gfx);

		/**
		 * Camera projection matrix.
		 * You can set it manually, or use "orthographicOffset" / "orthographic" / "perspective" helper functions.
		 */
		this.projection = null;

		/**
		 * Camera view matrix.
		 * You can set it manually, or use "setViewLookat" helper function.
		 */
		this.view = null;

		// build perspective camera by default
		this.perspective();
		this.setViewLookat(new Vector3(0, 5, -10), Vector3.zero());
	}

	/**
	 * Calc and return the currently-visible view frustum, based on active camera.
	 * @returns {Frustum} Visible frustum.
	 */
	calcVisibleFrustum() {
		if(!this.projection || !this.view) { throw new Error("You must set both projection and view matrices to calculate visible frustum!"); }
		const frustum = new Frustum();
		frustum.setFromProjectionMatrix(Matrix.multiply(this.projection, this.view));
		return frustum;
	}

	/**
	 * Set camera view matrix from source position and lookat.
	 * @param {Vector3=} eyePosition Camera source position.
	 * @param {Vector3=} lookAt Camera look-at target.
	 */
	setViewLookat(eyePosition, lookAt) {
		this.view = Matrix.createLookAt(eyePosition || new Vector3(0, 0, -500), lookAt || Vector3.zeroReadonly, Vector3.upReadonly);
	}

	/**
	 * Get 3d direction vector of this camera.
	 * @returns {Vector3} 3D direction vector.
	 */
	getDirection() {
		const e = this.view.values;
		return new Vector3(- e[8], - e[9], - e[10]).normalizeSelf();
	}

	/**
	 * Get view projection matrix.
	 * @returns {Matrix} View-projection matrix.
	 */
	getViewProjection() {
		return Matrix.multiply(this.view, this.projection);
	}

	/**
	 * Get projection view matrix.
	 * @returns {Matrix} Projection-view matrix.
	 */
	getProjectionView() {
		return Matrix.multiply(this.projection, this.view);
	}

	/**
	 * Make this camera a perspective camera.
	 * @param {*} fieldOfView Field of view angle in radians.
	 * @param {*} aspectRatio Aspect ratio.
	 * @param {*} near Near clipping plane.
	 * @param {*} far Far clipping plane.
	 */
	perspective(fieldOfView, aspectRatio, near, far) {
		this.projection = Matrix.createPerspective(fieldOfView || (Math.PI / 2), aspectRatio || 1, near || 0.1, far || 1000);
	}

	/**
	 * Unproject a 2d vector into 3D space.
	 * You can use this method to get the 3D direction the user points on with the mouse.
	 * @param {Vector2} point Vector to unproject.
	 * @param {Number} zDistance Distance from camera to locate the 3D point at (0 = near plane, 1 = far plane).
	 * @returns {Vector3} Unprojected point in 3D space.
	 */
	unproject(point, zDistance = 0) {
		function project(out, vec, m) {
			var x = vec[0],
				y = vec[1],
				z = vec[2],
				a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3],
				a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7],
				a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11],
				a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];

			var lw = 1 / (x * a03 + y * a13 + z * a23 + a33);

			out[0] = (x * a00 + y * a10 + z * a20 + a30) * lw;
			out[1] = (x * a01 + y * a11 + z * a21 + a31) * lw;
			out[2] = (x * a02 + y * a12 + z * a22 + a32) * lw;
			return out;
		}

		function unproject(out, vec, viewport, invProjectionView) {
			var viewX = viewport[0],
				viewY = viewport[1],
				viewWidth = viewport[2],
				viewHeight = viewport[3];

			var x = vec[0],
				y = vec[1],
				z = vec[2];

			x = x - viewX;
			y = viewHeight - y - 1;
			y = y - viewY;

			out[0] = (2 * x) / viewWidth - 1;
			out[1] = (2 * y) / viewHeight - 1;
			out[2] = 2 * z - 1;
			return project(out, out, invProjectionView.values);
		}

		const out = [];
		const projInverted = this.getProjectionView().inverted();
		const viewport = this.viewport || Shaku.gfx.getRenderingRegion();
		unproject(out, [point.x, point.y, zDistance], [viewport.x, viewport.y, viewport.width, viewport.height], projInverted);
		return new Vector3(out[0], out[1], out[2]);
	}
}

// export the camera object
export default Camera3D;
