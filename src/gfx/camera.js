/**
 * Camera class.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\gfx\camera.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';

const Rectangle = require("../utils/rectangle");
const Vector2 = require("../utils/vector2");
const Matrix = require('../utils/matrix.js');
const Vector3 = require("../utils/vector3");

 /**
  * Implements a Camera object.
  */
class Camera
{
    /**
     * Create the camera.
     * @param {Gfx} gfx The gfx manager instance.
     */
    constructor(gfx)
    {
        /**
         * Camera projection matrix.
         * You can set it manually, or use 'orthographicOffset' / 'orthographic' / 'perspective' helper functions.
         */
        this.projection = null;
    
        /**
         * Camera view matrix.
         * You can set it manually, or use 'setViewLookat' helper function.
         */
        this.view = null;

        // internal stuff
        this.__region = null;
        this.__gfx = gfx;
        this.__viewport = null;
        this.orthographic();
    }

    /**
     * Calc and return the currently-visible view frustum, based on active camera.
     * @returns {Frustum} Visible frustum.
     */
    calcVisibleFrustum()
    {
        if (!this.projection || !this.view) { throw new Error("You must set both projection and view matrices to calculate visible frustum!"); }
        const frustum = new Frustum();
        frustum.setFromProjectionMatrix(Matrix.multiply(this.projection, this.view));
        return frustum;
    }

    /**
     * Set camera view matrix from source position and lookat.
     * @param {Vector3=} eyePosition Camera source position.
     * @param {Vector3=} lookAt Camera look-at target.
     */
    setViewLookat(eyePosition, lookAt)
    {
        this.view = Matrix.lookAt(eyePosition || new Vector3(0, 0, -500), lookAt || Vector3.zeroReadonly, Vector3.upReadonly);
    }

    /**
     * Get camera's viewport (drawing region to set when using this camera).
     * @returns {Rectangle} Camera's viewport as rectangle.
     */
    get viewport()
    {
        return this.__viewport;
    }

    /**
     * Set camera's viewport.
     * @param {Rectangle} viewport New viewport to set or null to not use any viewport when using this camera.
     */
    set viewport(viewport)
    {
        this.__viewport = viewport;
        return viewport;
    }

    /**
     * Get the region this camera covers.
     * @returns {Rectangle} region this camera covers.
     */
    getRegion()
    {
        return this.__region.clone();
    }

    /**
     * Make this camera an orthographic camera with offset.
     * @param {Vector2} offset Camera offset (top-left corner).
     * @param {Boolean} ignoreViewportSize If true, will take the entire canvas size for calculation and ignore the viewport size, if set.
     * @param {Number} near Near clipping plane.
     * @param {Number} far Far clipping plane.
     */
    orthographicOffset(offset, ignoreViewportSize, near, far)
    {
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
    orthographic(region, near, far) 
    {
        if (region === undefined) {
            region = this.__gfx._internal.getRenderingRegionInternal();
        }
        this.__region = region;
        this.projection = Matrix.orthographic(region.left, region.right, region.bottom, region.top, near || -1, far || 400);
    }

    /**
     * Make this camera a perspective camera.
     * @param {*} fieldOfView Field of view angle in radians.
     * @param {*} aspectRatio Aspect ratio.
     * @param {*} near Near clipping plane.
     * @param {*} far Far clipping plane.
     */
    perspective(fieldOfView, aspectRatio, near, far) 
    {
        this.projection = Matrix.perspective(fieldOfView || (Math.PI / 2), aspectRatio || 1, near || 0.1, far || 1000);
    }
}

// export the camera object
module.exports = Camera;