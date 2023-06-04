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
const Vector2 = require("../utils/vector2");
const Vector3 = require("../utils/vector3");
const Color = require("../utils/color");


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
     * Set position.
     * @param {Vector2|Vector3} position Vertex position.
     * @param {Boolean} useRef If true, will not clone the given position vector and use its reference instead.
     * @returns {Vertex} this.
     */
    setPosition(position, useRef)
    {
        this.position = useRef ? position : position.clone();
        return this;
    }

    /**
     * Set texture coordinates.
     * @param {Vector2} textureCoord Vertex texture coord (in pixels).
     * @param {Boolean} useRef If true, will not clone the given coords vector and use its reference instead.
     * @returns {Vertex} this.
     */
    setTextureCoords(textureCoord, useRef)
    {
        this.textureCoord = useRef ? textureCoord : textureCoord.clone();
        return this;
    }

    /**
     * Set vertex color.
     * @param {Color} color Vertex color.
     * @param {Boolean} useRef If true, will not clone the given color and use its reference instead.
     * @returns {Vertex} this.
     */
    setColor(color, useRef)
    {
        this.color = useRef ? color : color.clone();
        return this;
    }
}

// export the vertex class
module.exports = Vertex;