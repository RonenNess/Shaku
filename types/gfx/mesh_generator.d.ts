export = MeshGenerator;
/**
 * Utility class to generate meshes.
 * @private
 */
declare class MeshGenerator {
    /**
     * Create the mesh generator.
     */
    constructor(gl: any);
    _gl: any;
    /**
     * Generate and return a textured quad.
     * @returns {Mesh} Quad mesh.
     */
    quad(): Mesh;
}
import Mesh = require("./mesh");
//# sourceMappingURL=mesh_generator.d.ts.map