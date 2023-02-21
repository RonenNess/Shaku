/**
 * An interface for a batch renderer.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\sprite_batch.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Vector2 = require('../utils/vector2');
const Vertex = require('./vertex');
const { BlendModes } = require('./blend_modes');
const Matrix = require('./matrix');
const _logger = require('../logger.js').getLogger('gfx');


/**
 * Base class for a drawing batch, used to draw a collection of sprites or shapes.
 */
class DrawBatch
{
    /**
     * Create the draw batch.
     * @param {Gfx} gfx Gfx manager.
     */
    constructor(gfx)
    {
        this._gfx = gfx;
        this._gl = gfx._gl;
        this._positions = gfx._dynamicBuffers.positionArray;
        this._uvs = gfx._dynamicBuffers.textureArray;
        this._colors = gfx._dynamicBuffers.colorsArray;
        this._positionsBuff = gfx._dynamicBuffers.positionBuffer;
        this._uvsBuff = gfx._dynamicBuffers.textureCoordBuffer;
        this._colorsBuff = gfx._dynamicBuffers.colorsBuffer;
        this._indexBuff = gfx._dynamicBuffers.indexBuffer;
    }

    /**
     * Get if batch is currently drawing.
     * @returns {Boolean} True if batch is drawing.
     */
    get drawing()
    {
        return this._drawing;
    }

    /**
     * Get the default effect to use for this drawing batch type.
     */
    get defaultEffect()
    {
        return this._gfx.builtinEffects.Basic;
    }

    /**
     * Start drawing a batch.
     * @param {Texture} texture Texture to use for this batch.
     * @param {BlendModes=} blendMode Blend mode to draw this batch in.
     * @param {Effect=} effect Effect to use. If not defined will use this batch type default effect.
     * @param {Matrix=} transform Optional transformations to apply on all sprites.
     */
    begin(texture, blendMode, effect, transform)
    {
        // sanity
        if (this._drawing) {
            _logger.error("Started drawing a batch while already drawing a batch!");
            return;
        }

        // set drawing params
        this._effect = effect || this.defaultEffect;
        this._blend = blendMode || BlendModes.AlphaBlend;
        this._texture = texture;
        this._transform = transform;
        this._batchDrawingCount = 0;

        // set as drawing
        this._drawing = true;
    }

    /**
     * Finish drawing batch (and render whatever left in buffers).
     */
    end()
    {
        // sanity
        if (!this._drawing) {
            _logger.error("Stop drawing a batch without starting it first!");
            return;
        }

        // draw current batch (only if got something to draw)
        if (this._batchDrawingCount) {
            this._drawCurrentBatch();
        }

        // no longer drawing
        this._drawing = false;
    }

    /**
     * Push vertices directly to batch.
     * @param {Array<Vertex>} vertices Vertices to push.
     */
    pushVertices(vertices)
    {
        // sanity
        if (!vertices || vertices.length !== 4) {
            throw new Error("Vertices must be array of 4 values!");
        }

        // check if should draw now
        if (((this._batchDrawingCount + 1) * 12) >= this._positions.length) {
            this._drawCurrentBatch();
        }

        // get buffers and offset
        let positions = this._positions;
        let uvs = this._uvs;
        let colors = this._colors;

        // push colors
        if (this.haveColors) {
            for (let i = 0; i < vertices.length; ++i) 
            {
                let vertex = vertices[i];
                let ci = (this._batchDrawingCount * (4 * 4)) + (i * 4);
                colors[ci + 0] = vertex.color.r;
                colors[ci + 1] = vertex.color.g;
                colors[ci + 2] = vertex.color.b;
                colors[ci + 3] = vertex.color.a;
            }
        }

        // push positions
        let topLeft = vertices[0].position;
        let topRight = vertices[1].position;
        let bottomLeft = vertices[2].position;
        let bottomRight = vertices[3].position;
        let pi = this._batchDrawingCount * 4 * 3;
        positions[pi+0] = topLeft.x;             positions[pi+1] = topLeft.y;             positions[pi+2] = topLeft.z || 0;
        positions[pi+3] = topRight.x;            positions[pi+4] = topRight.y;            positions[pi+5] = topRight.z || 0;
        positions[pi+6] = bottomLeft.x;          positions[pi+7] = bottomLeft.y;          positions[pi+8] = bottomLeft.z || 0;
        positions[pi+9] = bottomRight.x;         positions[pi+10] = bottomRight.y;        positions[pi+11] = bottomRight.z || 0;

        // set texture coords
        if (this.haveTexture && this._texture) {
            let uvi = (this._batchDrawingCount * (4 * 2));
            uvs[uvi++] = vertices[0].textureCoord.x / this._texture.width; 
            uvs[uvi++] = vertices[0].textureCoord.y / this._texture.height;
            uvs[uvi++] = vertices[1].textureCoord.x / this._texture.width; 
            uvs[uvi++] = vertices[1].textureCoord.y / this._texture.height;
            uvs[uvi++] = vertices[2].textureCoord.x / this._texture.width; 
            uvs[uvi++] = vertices[2].textureCoord.y / this._texture.height;
            uvs[uvi++] = vertices[3].textureCoord.x / this._texture.width; 
            uvs[uvi++] = vertices[3].textureCoord.y / this._texture.height;
        }

        // increase batch count
        this._batchDrawingCount++;
    }

    /**
     * How many objects we can have in a batch.
     */
    get maxBatchSize()
    {
        return this._gfx.batchSpritesCount;
    }

    /**
     * Draw current batch.
     * @private
     */
    _drawCurrentBatch()
    {
        // get some members
        let gl = this._gl;
        let transform = this._transform;
        let positionArray = this._positions;
        let textureArray = this._uvs;
        let colorsArray = this._colors;
        let positionBuffer = this._positionsBuff;
        let textureCoordBuffer = this._uvsBuff;
        let colorsBuffer = this._colorsBuff;
        let indexBuffer = this._indexBuff;

        // set effect
        this._gfx.useEffect(this._effect);
        this._effect._cachedValues = {};

        // set blend mode
        this._gfx._setBlendMode(this._blend);

        // should we slice the arrays?
        let shouldSliceArrays = (this._gfx.webglVersion < 2) && (this._batchDrawingCount < this.maxBatchSize / 2);

        // set world matrix
        this._gfx._activeEffect.setWorldMatrix(transform || Matrix.identity);

        // copy position buffer
        this._gfx._activeEffect.setPositionsAttribute(positionBuffer, true);
        gl.bufferData(gl.ARRAY_BUFFER, 
            shouldSliceArrays ? positionArray.slice(0, this._batchDrawingCount * 4 * 3) : positionArray, 
            gl.DYNAMIC_DRAW, 0, this._batchDrawingCount * 4 * 3);

        // copy texture buffer
        if (this.haveTexture) {
            this._gfx._activeEffect.setTextureCoordsAttribute(textureCoordBuffer, true);
            gl.bufferData(gl.ARRAY_BUFFER, 
                shouldSliceArrays ? textureArray.slice(0, this._batchDrawingCount * 4 * 2) : textureArray, 
                gl.DYNAMIC_DRAW, 0, this._batchDrawingCount * 4 * 2);
        }

        // copy color buffer
        if (this.haveColors) {
            this._gfx._activeEffect.setColorsAttribute(colorsBuffer, true);
            gl.bufferData(gl.ARRAY_BUFFER, 
                shouldSliceArrays ? colorsArray.slice(0, this._batchDrawingCount * 4 * 4) : colorsArray, 
                gl.DYNAMIC_DRAW, 0, this._batchDrawingCount * 4 * 4);
        }

        // set indices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this._currIndices = null;
        
        // set active texture
        this._gfx._setActiveTexture(this._texture);

        // draw elements
        this._drawElements();
        this._gfx._drawCallsCount++;
        this._gfx._drawQuadsCount += this._batchDrawingCount;

        // reset current counter
        this._batchDrawingCount = 0;
    }

    /**
     * Draw the current elements in buffer.
     * @private
     */
    get _drawElements()
    {
        this._gl.drawElements(gl.TRIANGLES, this._batchDrawingCount * 6, gl.UNSIGNED_SHORT, 0);
    }

    /**
     * Does this drawing batch have color values?
     */
    get haveColors()
    {
        return true;
    }

    /**
     * Does this drawing batch have a texture?
     */
    get haveTexture()
    {
        return true;
    }
}


// export the draw batch class
module.exports = DrawBatch;