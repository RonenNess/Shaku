/**
 * Camera class.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\gfx\camera3d.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Matrix = require('../utils/matrix.js');
const Vector3 = require("../utils/vector3");
const Frustum = require("../utils/frustum");
const Camera = require('./camera.js');

 /**
  * Implements a 3d Camera object.
  */
class Camera3D extends Camera
{
    /**
     * Create the camera.
     * @param {Gfx} gfx The gfx manager instance.
     */
    constructor(gfx)
    {
        super(gfx);

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

        // build perspective camera by default
        this.perspective();
        this.setViewLookat(new Vector3(0, 5, -10), Vector3.zero());
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
        this.view = Matrix.createLookAt(eyePosition || new Vector3(0, 0, -500), lookAt || Vector3.zeroReadonly, Vector3.upReadonly);
    }

    /**
     * Get 3d direction vector of this camera.
     * @returns {Vector3} 3D direction vector.
     */
    getDirection()
    {
		const e = this.view.values;
		return new Vector3( - e[ 8 ], - e[ 9 ], - e[ 10 ] ).normalizeSelf();
    }

    /**
     * Get view projection matrix.
     * @returns {Matrix} View-projection matrix.
     */
    getViewProjection()
    {
        return Matrix.multiply(this.view, this.projection);
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
        this.projection = Matrix.createPerspective(fieldOfView || (Math.PI / 2), aspectRatio || 1, near || 0.1, far || 1000);
    }
}

// export the camera object
module.exports = Camera3D;