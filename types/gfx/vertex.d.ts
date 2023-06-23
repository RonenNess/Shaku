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
     * @param {Vector3} normal Vertex normal.
     */
    constructor(position: Vector2 | Vector3, textureCoord: Vector2, color: Color, normal: Vector3);
    position: Vector2 | Vector3;
    textureCoord: Vector2;
    color: any;
    normal: Vector3;
    /**
     * Set position.
     * @param {Vector2|Vector3} position Vertex position.
     * @param {Boolean} useRef If true, will not clone the given position vector and use its reference instead.
     * @returns {Vertex} this.
     */
    setPosition(position: Vector2 | Vector3, useRef: boolean): Vertex;
    /**
     * Set texture coordinates.
     * @param {Vector2} textureCoord Vertex texture coord (in pixels).
     * @param {Boolean} useRef If true, will not clone the given coords vector and use its reference instead.
     * @returns {Vertex} this.
     */
    setTextureCoords(textureCoord: Vector2, useRef: boolean): Vertex;
    /**
     * Set vertex color.
     * @param {Color} color Vertex color.
     * @param {Boolean} useRef If true, will not clone the given color and use its reference instead.
     * @returns {Vertex} this.
     */
    setColor(color: Color, useRef: boolean): Vertex;
    /**
     * Set vertex normal.
     * @param {Vector3} normal Vertex normal.
     * @param {Boolean} useRef If true, will not clone the given normal and use its reference instead.
     * @returns {Vertex} this.
     */
    setNormal(normal: Vector3, useRef: boolean): Vertex;
}
import Vector2 = require("../utils/vector2");
import Vector3 = require("../utils/vector3");
import Color = require("../utils/color");
//# sourceMappingURL=vertex.d.ts.map