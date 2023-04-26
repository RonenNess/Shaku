export = SpriteBatch3D;
/**
 * 3D Sprites batch renderer.
 * Responsible to drawing 3D quads with textures on them.
 */
declare class SpriteBatch3D extends SpriteBatch {
    /**
     * Set to default view matrix.
     * @param {Vector3=} eyePosition Camera source position.
     * @param {Vector3=} lookAt Camera look-at target.
     */
    setViewLookat(eyePosition?: Vector3 | undefined, lookAt?: Vector3 | undefined): void;
    __view: Matrix;
    /**
     * Set perspective camera.
     * @param {Number=} fieldOfView Camera field of view.
     * @param {Number=} aspectRatio Camera aspect ratio
     * @param {Number=} zNear Z near plane.
     * @param {Number=} zFar Z far plane.
     */
    setPerspectiveCamera(fieldOfView?: number | undefined, aspectRatio?: number | undefined, zNear?: number | undefined, zFar?: number | undefined): void;
    __camera: any;
    /**
     * Set the camera for this batch.
     * @param {Matrix} camera Camera object to apply when drawing, or null if you want to set the camera manually.
     */
    setCamera(camera: Matrix): void;
    /**
     * Set the view matrix for this batch.
     * @param {Matrix} view View matrix, or null if you want to set the view matrix manually.
     */
    setView(view: Matrix): void;
    #private;
}
import SpriteBatch = require("./sprite_batch");
import Vector3 = require("../../utils/vector3");
import Matrix = require("../matrix");
//# sourceMappingURL=sprite_batch_3d.d.ts.map