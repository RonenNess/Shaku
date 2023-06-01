export = SpriteBatch3D;
/**
 * 3D Sprites batch renderer.
 * Responsible to drawing 3D quads with textures on them.
 */
declare class SpriteBatch3D extends SpriteBatch {
    __camera: any;
    /**
     * Get camera instance.
     * @returns {Camera} Camera instance.
     */
    get camera(): Camera;
    /**
     * Set perspective camera.
     * @param {Number=} fieldOfView Camera field of view.
     * @param {Number=} aspectRatio Camera aspect ratio
     * @param {Number=} zNear Z near plane.
     * @param {Number=} zFar Z far plane.
     */
    setPerspectiveCamera(fieldOfView?: number | undefined, aspectRatio?: number | undefined, zNear?: number | undefined, zFar?: number | undefined): void;
    /**
     * Set the camera for this batch.
     * @param {Camera} camera Camera object to apply when drawing, or null if you want to set the camera manually.
     */
    setCamera(camera: Camera): void;
    #private;
}
import SpriteBatch = require("./sprite_batch");
//# sourceMappingURL=sprite_batch_3d.d.ts.map