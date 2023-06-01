export = Vertex;
/**
 * A vertex we can push to sprite batch.
 */
declare class Vertex {
    /**
     * Create the vertex data.
     * @param {Vector2|Vector3} position Vertex position.
     * @param {Vector2} textureCoord Vertex texture coord (in pixels).
     * @param {Color} color Vertex color (undefined will default to white).
     */
    constructor(position: typeof import("../utils/vector2") | Vector3, textureCoord: typeof import("../utils/vector2"), color: typeof import("../utils/color"));
    position: any;
    textureCoord: import("../utils/vector2") | typeof import("../utils/vector2");
    color: any;
    /**
     * Set position.
     * @param {Vector2|Vector3} position Vertex position.
     * @returns {Vertex} this.
     */
    setPosition(position: typeof import("../utils/vector2") | Vector3): Vertex;
    /**
     * Set texture coordinates.
     * @param {Vector2} textureCoord Vertex texture coord (in pixels).
     * @returns {Vertex} this.
     */
    setTextureCoords(textureCoord: typeof import("../utils/vector2")): Vertex;
    /**
     * Set vertex color.
     * @param {Color} color Vertex color.
     * @returns {Vertex} this.
     */
    setColor(color: typeof import("../utils/color")): Vertex;
}
//# sourceMappingURL=vertex.d.ts.map