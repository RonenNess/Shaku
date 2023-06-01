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
    __region: Rectangle;
    __gfx: Gfx;
    __viewport: Rectangle;
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
    projection: Matrix;
}
import Rectangle = require("../utils/rectangle");
import Vector2 = require("../utils/vector2");
import Matrix = require("../utils/matrix.js");
//# sourceMappingURL=camera.d.ts.map