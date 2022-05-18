/**
 * Implement the gfx sprite batch renderer.
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
const { Rectangle, Color } = require('../utils');
const Vector2 = require('../utils/vector2');
const Vector3 = require('../utils/vector3');
const BlendModes = require('./blend_modes');
const Matrix = require('./matrix');
const Mesh = require('./mesh');
const _logger = require('../logger.js').getLogger('gfx');


/**
 * Sprite batch renderer, responsible on drawing a batch of sprites with as little draw calls as possible.
 */
class SpriteBatch
{
    /**
     * Create the spritebatch.
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
     * Create and return a new vertex.
     * @param {Vector2} position Vertex position.
     * @param {Vector2} textureCoord Vertex texture coord.
     * @param {Color} color Vertex color.
     * @returns {Vertex} new vertex object.
     */
    vertex(position, textureCoord, color)
    {
        return new Vertex(position, textureCoord, color);
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
     * Start drawing a batch.
     * @param {Effect} effect Effect to use.
     * @param {Matrix} transform Optional transformations to apply on all sprites.
     */
    begin(effect, transform)
    {
        if (this._drawing) {
            _logger.error("Start drawing a batch while already drawing a batch!");
        }

        if (effect) {
            this._gfx.useEffect(effect);
        }
        this._effect = this._gfx._activeEffect;
        
        this._currBlend = BlendModes.AlphaBlend;
        this._currTexture = null;
        this._currBatchCount = 0;

        this._transform = transform;

        this._drawing = true;
    }

    /**
     * Finish drawing batch (and render whatever left in buffers).
     */
    end()
    {
        if (!this._drawing) {
            _logger.error("Stop drawing a batch without starting it first!");
        }

        if (this._currBatchCount) {
            this._drawCurrentBatch();
        }
        this._drawing = false;
    }

    /**
     * Set the currently active texture.
     * @param {Texture} texture Texture to set.
     */
    setTexture(texture)
    {
        if (texture !== this._currTexture) {
            if (this._currBatchCount) {
                this._drawCurrentBatch();
            }
            this._currTexture = texture;
        }
    }

    /**
     * Add sprite to batch.
     * Note: changing texture or blend mode may trigger a draw call.
     * @param {Sprite|Array<Sprite>} sprites Sprite or multiple sprites to draw.
     * @param {Boolean} cullOutOfScreen If true, will cull sprites that are not visible.
     */
    draw(sprites, cullOutOfScreen)
    {
        // if single sprite, turn to array
        if (sprites.length === undefined) { sprites = [sprites]; }

        // get visible region
        let region = cullOutOfScreen ? this._gfx.getRenderingRegion() : null;

        // get buffers
        let positions = this._positions;
        let uvs = this._uvs;
        let colors = this._colors;
        
        for (let sprite of sprites) {

            // if texture changed, blend mode changed, or we have too many indices - draw current batch
            if (this._currBatchCount) {
                if ((this._currBatchCount >= this.batchSpritesCount) || 
                    (sprite.blendMode !== this._currBlend) || 
                    (sprite.texture !== this._currTexture)) {
                    this._drawCurrentBatch();
                }
            }

            // set texture and blend (used internally when drawing batch)
            this._currTexture = sprite.texture;
            this._currBlend = sprite.blendMode;

            // calculate vertices positions
            let sizeX = sprite.size.x;
            let sizeY = sprite.size.y;
            let left = -sizeX * sprite.origin.x;
            let top = -sizeY * sprite.origin.y;

            // calculate corners
            let topLeft = new Vector2(left, top);
            let topRight = new Vector2(left + sizeX, top);
            let bottomLeft = new Vector2(left, top + sizeY);
            let bottomRight = new Vector2(left + sizeX, top + sizeY);

            // apply skew
            if (sprite.skew) {
                if (sprite.skew.x) {
                    topLeft.x += sprite.skew.x * sprite.origin.y;
                    topRight.x += sprite.skew.x * sprite.origin.y;
                    bottomLeft.x -= sprite.skew.x * (1 - sprite.origin.y);
                    bottomRight.x -= sprite.skew.x * (1 - sprite.origin.y);
                }
                if (sprite.skew.y) {
                    topLeft.y += sprite.skew.y * sprite.origin.x;
                    bottomLeft.y += sprite.skew.y * sprite.origin.x;
                    topRight.y -= sprite.skew.y * (1 - sprite.origin.x);
                    bottomRight.y -= sprite.skew.y * (1 - sprite.origin.x);
                }
            }

            // apply rotation
            if (sprite.rotation) {
                let cos = Math.cos(sprite.rotation);
                let sin = Math.sin(sprite.rotation);
                function rotateVec(vector)
                {
                    let x = Math.floor(vector.x * cos - vector.y * sin);
                    let y = Math.floor(vector.x * sin + vector.y * cos);
                    vector.set(x, y);
                }
                rotateVec(topLeft);
                rotateVec(topRight);
                rotateVec(bottomLeft);
                rotateVec(bottomRight);
            }

            // add sprite position
            topLeft.addSelf(sprite.position);
            topRight.addSelf(sprite.position);
            bottomLeft.addSelf(sprite.position);
            bottomRight.addSelf(sprite.position);

            // optional z position
            let z = sprite.position.z || 0;
            let zDepth = sprite.size.z || 0;

            // cull out-of-screen sprites
            if (cullOutOfScreen)
            {
                let destRect = Rectangle.fromPoints([topLeft, topRight, bottomLeft, bottomRight]);
                if (!region.collideRect(destRect)) {
                    continue;
                }
            }

            // update positions buffer
            let pi = this._currBatchCount * 4 * 3;
            positions[pi+0] = topLeft.x;             positions[pi+1] = topLeft.y;             positions[pi+2] = z;
            positions[pi+3] = topRight.x;            positions[pi+4] = topRight.y;            positions[pi+5] = z;
            positions[pi+6] = bottomLeft.x;          positions[pi+7] = bottomLeft.y;          positions[pi+8] = z + zDepth;
            positions[pi+9] = bottomRight.x;         positions[pi+10] = bottomRight.y;        positions[pi+11] = z + zDepth;

            // add uvs
            let uvi = this._currBatchCount * 4 * 2;
            if (sprite.sourceRect) {
                const marginX = 0.25 / this._currTexture.width;
                const marginY = 0.25 / this._currTexture.height;
                const uvTl = {x: sprite.sourceRect.x / this._currTexture.width + marginX, y: sprite.sourceRect.y / this._currTexture.height + marginY};
                const uvBr = {x: uvTl.x + sprite.sourceRect.width / this._currTexture.width - marginX * 2, y: uvTl.y + sprite.sourceRect.height / this._currTexture.height - marginY * 2};
                uvs[uvi+0] = uvTl.x;  uvs[uvi+1] = uvTl.y;
                uvs[uvi+2] = uvBr.x;  uvs[uvi+3] = uvTl.y;
                uvs[uvi+4] = uvTl.x;  uvs[uvi+5] = uvBr.y;
                uvs[uvi+6] = uvBr.x;  uvs[uvi+7] = uvBr.y;
            }
            else {
                uvs[uvi+0] = 0;  uvs[uvi+1] = 0;
                uvs[uvi+2] = 1;  uvs[uvi+3] = 0;
                uvs[uvi+4] = 0;  uvs[uvi+5] = 1;
                uvs[uvi+6] = 1;  uvs[uvi+7] = 1;
            }

            // add colors
            let ci = this._currBatchCount * 4 * 4;

            // array of colors
            if (sprite.color instanceof Array) {
                let lastColor = sprite.color[0];
                for (let x = 0; x < 4; ++x) {
                    let curr = (sprite.color[x] || lastColor);
                    colors[ci + x*4 + 0] = curr.r;
                    colors[ci + x*4 + 1] = curr.g;
                    colors[ci + x*4 + 2] = curr.b;
                    colors[ci + x*4 + 3] = curr.a;
                    lastColor = curr;
                }
            }
            // single color
            else {
                for (let x = 0; x < 4; ++x) {
                    colors[ci + x*4 + 0] = sprite.color.r;
                    colors[ci + x*4 + 1] = sprite.color.g;
                    colors[ci + x*4 + 2] = sprite.color.b;
                    colors[ci + x*4 + 3] = sprite.color.a;
                }
            }
                    
            // increase sprites count
            this._currBatchCount++;
        }
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

        // get buffers and offset
        let positions = this._positions;
        let uvs = this._uvs;
        let colors = this._colors;

        // push colors
        for (let i = 0; i < vertices.length; ++i) 
        {
            let vertex = vertices[i];
            let ci = (this._currBatchCount * (4 * 4)) + (i * 4);
            colors[ci + 0] = vertex.color.r;
            colors[ci + 1] = vertex.color.g;
            colors[ci + 2] = vertex.color.b;
            colors[ci + 3] = vertex.color.a;
        }

        // push positions
        let topLeft = vertices[0].position;
        let topRight = vertices[1].position;
        let bottomLeft = vertices[2].position;
        let bottomRight = vertices[3].position;
        let pi = this._currBatchCount * 4 * 3;
        positions[pi+0] = topLeft.x;             positions[pi+1] = topLeft.y;             positions[pi+2] = topLeft.z || 0;
        positions[pi+3] = topRight.x;            positions[pi+4] = topRight.y;            positions[pi+5] = topRight.z || 0;
        positions[pi+6] = bottomLeft.x;          positions[pi+7] = bottomLeft.y;          positions[pi+8] = bottomLeft.z || 0;
        positions[pi+9] = bottomRight.x;         positions[pi+10] = bottomRight.y;        positions[pi+11] = bottomRight.z || 0;

        // set texture coords
        let uvi = (this._currBatchCount * (4 * 2));
        uvs[uvi++] = vertices[0].textureCoord.x / this._currTexture.width; 
        uvs[uvi++] = vertices[0].textureCoord.y / this._currTexture.height;
        uvs[uvi++] = vertices[1].textureCoord.x / this._currTexture.width; 
        uvs[uvi++] = vertices[1].textureCoord.y / this._currTexture.height;
        uvs[uvi++] = vertices[2].textureCoord.x / this._currTexture.width; 
        uvs[uvi++] = vertices[2].textureCoord.y / this._currTexture.height;
        uvs[uvi++] = vertices[3].textureCoord.x / this._currTexture.width; 
        uvs[uvi++] = vertices[3].textureCoord.y / this._currTexture.height;

        // increase batch count
        this._currBatchCount++;
    }

    /**
     * How many sprites we can have in batch, in total.
     */
    get batchSpritesCount()
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

        // some sanity checks
        if (this._effect !== this._gfx._activeEffect) {
            _logger.error("Effect changed while drawing batch!");
        }

        // set blend mode if needed
        this._gfx._setBlendMode(this._currBlend);

        // prepare effect and texture
        let mesh = new Mesh(positionBuffer, textureCoordBuffer, colorsBuffer, indexBuffer, this._currBatchCount * 6);
        this._gfx._activeEffect.prepareToDrawBatch(mesh, transform || Matrix.identity);
        this._gfx._setActiveTexture(this._currTexture);

        // should we slice the arrays?
        let shouldSliceArrays = this._currBatchCount < this.batchSpritesCount / 2;

        // copy position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, 
            shouldSliceArrays ? positionArray.slice(0, this._currBatchCount * 4 * 3) : positionArray, 
            gl.DYNAMIC_DRAW);

        // copy texture buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, 
            shouldSliceArrays ? textureArray.slice(0, this._currBatchCount * 4 * 2) : textureArray, 
            gl.DYNAMIC_DRAW);

        // copy color buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, 
            shouldSliceArrays ? colorsArray.slice(0, this._currBatchCount * 4 * 4) : colorsArray, 
            gl.DYNAMIC_DRAW);

        // set indices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this._currIndices = null;

        // draw elements
        gl.drawElements(gl.TRIANGLES, this._currBatchCount * 6, gl.UNSIGNED_SHORT, 0);
        this._gfx._drawCallsCount++;

        // reset current counter
        this._currBatchCount = 0;
    }
}


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
        this.position = position;
        this.textureCoord = textureCoord;
        this.color = color || Color.white;
    }
}


// export the sprite batch class
module.exports = SpriteBatch;