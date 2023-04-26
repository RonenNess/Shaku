/**
 * Implement the gfx vertex container.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\gfx\vertex.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const { Vector2, Color } = require("../utils");
const Matrix = require("./matrix");

/**
 * A vertex we can push to sprite batch.
 */
class Vertex
{
    /**
     * Create the vertex data.
     * @param {Vector2|Vector3} position Vertex position.
     * @param {Vector2} textureCoord Vertex texture coord (in pixels).
     * @param {Color} color Vertex color (undefined will default to white).
     */
    constructor(position, textureCoord, color)
    {
        this.position = position || Vector2.zero();
        this.textureCoord = textureCoord || Vector2.zero();
        this.color = color || Color.white;
    }

    /**
     * Transform this vertex position from a matrix.
     * @param {Matrix} matrix Transformation matrix.
     * @returns {Vertex} this.
     */
    transform(matrix)
    {
        return this;
    }

    /**
     * Set position.
     * @param {Vector2|Vector3} position Vertex position.
     * @returns {Vertex} this.
     */
    setPosition(position)
    {
        this.position = position.clone();
        return this;
    }

    /**
     * Set texture coordinates.
     * @param {Vector2} textureCoord Vertex texture coord (in pixels).
     * @returns {Vertex} this.
     */
    setTextureCoords(textureCoord)
    {
        this.textureCoord = textureCoord.clone();
        return this;
    }

    /**
     * Set vertex color.
     * @param {Color} color Vertex color.
     * @returns {Vertex} this.
     */
    setColor(color)
    {
        this.color = color.clone();
        return this;
    }
}

// export the vertex class
module.exports = Vertex;