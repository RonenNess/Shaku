export = SpriteBatch3D;
/**
 * 3D Sprites batch renderer.
 * Responsible to drawing 3D quads with textures on them.
 */
declare class SpriteBatch3D extends SpriteBatch {
    /**
     * Create the 3d sprites batch.
     * @param {Number=} batchSpritesCount Internal buffers size, in sprites count (sprite = 4 vertices). Bigger value = faster rendering but more RAM.
     * @param {Boolean=} enableNormals If true (not default) will support vertex normals.
     */
    constructor(batchSpritesCount?: number | undefined, enableNormals?: boolean | undefined);
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