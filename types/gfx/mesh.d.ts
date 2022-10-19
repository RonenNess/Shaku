export = Mesh;
/**
 * Class to hold a mesh.
 */
declare class Mesh {
    /**
     * Create the mesh object.
     * @param {WebGLBuffer} positions vertices positions buffer.
     * @param {WebGLBuffer} textureCoords vertices texture coords buffer.
     * @param {WebGLBuffer} colorss vertices colors buffer.
     * @param {WebGLBuffer} indices indices buffer.
     * @param {Number} indicesCount how many indices we have.
     */
    constructor(positions: WebGLBuffer, textureCoords: WebGLBuffer, colorsBuffer: any, indices: WebGLBuffer, indicesCount: number);
    positions: WebGLBuffer;
    textureCoords: WebGLBuffer;
    colors: any;
    indices: WebGLBuffer;
    indicesCount: number;
    __color: import("../utils/color");
    /**
     * Override the colors buffer, if possible.
     * @param {WebGl} gl WebGL context.
     * @param {Color} color Color to set.
     */
    overrideColors(gl: WebGl, color: typeof import("../utils/color")): void;
}
//# sourceMappingURL=mesh.d.ts.map