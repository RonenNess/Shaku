export = Camera3D;
/**
 * Implements a 3d Camera object.
 */
declare class Camera3D extends Camera {
    /**
     * Camera view matrix.
     * You can set it manually, or use 'setViewLookat' helper function.
     */
    view: Matrix;
    /**
     * Calc and return the currently-visible view frustum, based on active camera.
     * @returns {Frustum} Visible frustum.
     */
    calcVisibleFrustum(): Frustum;
    /**
     * Set camera view matrix from source position and lookat.
     * @param {Vector3=} eyePosition Camera source position.
     * @param {Vector3=} lookAt Camera look-at target.
     */
    setViewLookat(eyePosition?: Vector3 | undefined, lookAt?: Vector3 | undefined): void;
    /**
     * Get 3d direction vector of this camera.
     * @returns {Vector3} 3D direction vector.
     */
    getDirection(): Vector3;
    /**
     * Get view projection matrix.
     * @returns {Matrix} View-projection matrix.
     */
    getViewProjection(): Matrix;
    /**
     * Get projection view matrix.
     * @returns {Matrix} Projection-view matrix.
     */
    getProjectionView(): Matrix;
    /**
     * Make this camera a perspective camera.
     * @param {*} fieldOfView Field of view angle in radians.
     * @param {*} aspectRatio Aspect ratio.
     * @param {*} near Near clipping plane.
     * @param {*} far Far clipping plane.
     */
    perspective(fieldOfView: any, aspectRatio: any, near: any, far: any): void;
    /**
     * Unproject a 2d vector into 3D space.
     * You can use this method to get the 3D direction the user points on with the mouse.
     * @param {Vector2} point Vector to unproject.
     * @param {Number} zDistance Distance from camera to locate the 3D point at (0 = near plane, 1 = far plane).
     * @returns
     */
    unproject(point: Vector2, zDistance?: number): Vector3;
}
import Camera = require("./camera.js");
import Matrix = require("../utils/matrix.js");
import Frustum = require("../utils/frustum");
import Vector3 = require("../utils/vector3");
import Vector2 = require("../utils/vector2.js");
//# sourceMappingURL=camera3d.d.ts.map