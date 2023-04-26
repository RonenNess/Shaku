export = Camera;
/**
 * Implements a Camera object.
 */
declare class Camera {
    /**
     * Create the camera.
     * @param {Gfx} gfx The gfx manager instance.
     */
    constructor(gfx: Gfx);
    /**
     * Camera projection matrix.
     * You can set it manually, or use 'orthographicOffset' / 'orthographic' / 'perspective' helper functions.
     */
    projection: Matrix;
    _region: Rectangle;
    _gfx: Gfx;
    _viewport: Rectangle;
    /**
     * Set camera's viewport.
     * @param {Rectangle} viewport New viewport to set or null to not use any viewport when using this camera.
     */
    set viewport(arg: Rectangle);
    /**
     * Get camera's viewport (drawing region to set when using this camera).
     * @returns {Rectangle} Camera's viewport as rectangle.
     */
    get viewport(): Rectangle;
    /**
     * Get the region this camera covers.
     * @returns {Rectangle} region this camera covers.
     */
    getRegion(): Rectangle;
    /**
     * Make this camera an orthographic camera with offset.
     * @param {Vector2} offset Camera offset (top-left corner).
     * @param {Boolean} ignoreViewportSize If true, will take the entire canvas size for calculation and ignore the viewport size, if set.
     * @param {Number} near Near clipping plane.
     * @param {Number} far Far clipping plane.
     */
    orthographicOffset(offset: Vector2, ignoreViewportSize: boolean, near: number, far: number): void;
    /**
     * Make this camera an orthographic camera.
     * @param {Rectangle} region Camera left, top, bottom and right. If not set, will take entire canvas.
     * @param {Number} near Near clipping plane.
     * @param {Number} far Far clipping plane.
     */
    orthographic(region: Rectangle, near: number, far: number): void;
    /**
     * Make this camera a perspective camera.
     * @param {*} fieldOfView Field of view angle in radians.
     * @param {*} aspectRatio Aspect ratio.
     * @param {*} near Near clipping plane.
     * @param {*} far Far clipping plane.
     */
    perspective(fieldOfView: any, aspectRatio: any, near: any, far: any): void;
}
import Matrix = require("./matrix");
import Rectangle = require("../utils/rectangle");
import Vector2 = require("../utils/vector2");
//# sourceMappingURL=camera.d.ts.map