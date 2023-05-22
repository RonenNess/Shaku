/**
 * Implement the gfx sprite batch renderer base class.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\gfx\draw_batches\sprite_batch_base.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const { Rectangle } = require('../../utils');
const Vector2 = require('../../utils/vector2');
const Matrix = require('../../utils/matrix.js');
const DrawBatch = require('./draw_batch');
const _logger = require('../../logger.js').getLogger('gfx-sprite-batch');


/**
 * Base class for sprite-based rendering, ie vertices with textures.
 */
class SpriteBatchBase extends DrawBatch
{
    /**
     * Create the sprites batch.
     * @param {Number=} batchSpritesCount Internal buffers size, in sprites count (sprite = 4 vertices). Bigger value = faster rendering but more RAM.
     * @param {Boolean=} enableVertexColor If true (default) will support vertex color. 
     */
    constructor(batchSpritesCount, enableVertexColor)
    {
        // init draw batch
        super();

        // create buffers for drawing sprites
        this.#_createBuffers(batchSpritesCount || 500, enableVertexColor);

        /**
         * How many quads this batch can hold.
         * @private
         */
        this.__maxQuadsCount = Math.floor((this._buffers.positionArray.length / 12));

        /**
         * How many quads we currently have.
         * @private
         */
        this.__quadsCount = 0;

        /**
         * Indicate there were changes in buffers.
         * @private
         */
        this.__dirty = false;

        /**
         * Optional method to trigger when sprite batch overflows and can't contain any more quads.
         * @type {Function}
         * @name SpriteBatch#onOverflow
         */
        this.onOverflow = null;
        
        /** 
         * If true, will floor vertices positions before pushing them to batch.
         * @type {Boolean}
         * @name SpriteBatch#snapPixels
         */
        this.snapPixels = false;

        /** 
         * If true, will cull quads that are not visible in screen when adding them by default.
         * Note: will cull based on screen region during the time of adding sprite, not the time of actually rendering it.
         * @type {Boolean}
         * @name SpriteBatch#cullOutOfScreen
         */
        this.cullOutOfScreen = false;
    }

    /**
     * Get the gfx manager.
     * @private
     */
    get #_gfx()
    {
        return DrawBatch._gfx;
    }

    /**
     * Get the web gl instance.
     * @private
     */
    get #_gl()
    {
        return DrawBatch._gfx._internal.gl;
    }

    /**
     * @inheritdoc
     */
    destroy()
    {
        let gl = this.#_gl;
        if (this._buffers) {
            if (this._buffers.positionBuffer) gl.deleteBuffer(this._buffers.positionBuffer);
            if (this._buffers.colorsBuffer) gl.deleteBuffer(this._buffers.colorsBuffer);
            if (this._buffers.textureCoordBuffer) gl.deleteBuffer(this._buffers.textureCoordBuffer);
        }
        this._buffers = null;
    }

    /**
     * @inheritdoc
     */
    get isDestroyed()
    {
        return Boolean(this._buffers) === false;
    }

    /**
     * Build the dynamic buffers.
     * @private
     */
    #_createBuffers(batchSpritesCount, enableVertexColor)
    {
        let gl = this.#_gl;

        if (enableVertexColor === undefined) { enableVertexColor = true; }
        
        // dynamic buffers, used for batch rendering
        this._buffers = {
            
            positionBuffer: gl.createBuffer(),
            positionArray: new Float32Array(3 * 4 * batchSpritesCount),

            textureCoordBuffer: gl.createBuffer(),
            textureArray: new Float32Array(2 * 4 * batchSpritesCount),

            colorsBuffer: enableVertexColor ? gl.createBuffer() : null,
            colorsArray: enableVertexColor ? (new Float32Array(4 * 4 * batchSpritesCount)) : null,

            indexBuffer: gl.createBuffer(),
        }

        // create the indices buffer
        let maxIndex = (batchSpritesCount * 4);
        let indicesArrayType;
        if (maxIndex <= 256) {
            indicesArrayType = Uint8Array;
            this.__indicesType = gl.UNSIGNED_BYTE;
        }
        if (maxIndex <= 65535) {
            indicesArrayType = Uint16Array;
            this.__indicesType = gl.UNSIGNED_SHORT;
        }
        else {
            indicesArrayType = Uint32Array;
            this.__indicesType = gl.UNSIGNED_INT;
        }
        let indices = new indicesArrayType(batchSpritesCount * 6); // 6 = number of indices per sprite
        let inc = 0;
        for (let i = 0; i < indices.length; i += 6) {
            
            indices[i] = inc;
            indices[i+1] = inc + 1;
            indices[i+2] = inc + 2;

            indices[i+3] = inc + 1;
            indices[i+4] = inc + 3;
            indices[i+5] = inc + 2;

            inc += 4;
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffers.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        // extand buffers functionality
        function extendBuffer(buff)
        {
            if (buff) { buff._index = 0; }
        }
        extendBuffer(this._buffers.positionArray);
        extendBuffer(this._buffers.textureArray);
        extendBuffer(this._buffers.colorsArray);
    }

    /**
     * @inheritdoc
     */
    clear()
    {
        super.clear();
        if (this._buffers.positionArray) { this._buffers.positionArray._index = 0; }
        if (this._buffers.textureArray) { this._buffers.textureArray._index = 0; }
        if (this._buffers.colorsArray && this.supportVertexColor) { this._buffers.colorsArray._index = 0; }
        this.__quadsCount = 0;
        this.__dirty = false;
    }

    /**
     * Set a new active texture and draw batch if needed.
     * @private
     */
    _updateTexture(texture)
    {
        // if texture changed, draw current batch first
        if (this.__currDrawingParams.texture && (this.__currDrawingParams.texture != texture)) {
            this._drawBatch();
            this.clear();
            this.__dirty = true;
        }

        // set active texture
        this.__currDrawingParams.texture = texture;
    }

    /**
     * Get if this sprite batch support vertex color.
     * @returns {Boolean} True if support vertex color.
     */
    get supportVertexColor()
    {
        return Boolean(this._buffers.colorsBuffer);
    }

    /**
     * @inheritdoc
     */
    get defaultEffect()
    {
        return this.supportVertexColor ? this.#_gfx.builtinEffects.Sprites : this.#_gfx.builtinEffects.SpritesNoVertexColor;
    }

    /**
     * Add sprite or sprites to batch.
     * @param {Sprite|Array<Sprite>} sprites Sprite or multiple sprites to draw.
     * @param {Matrix=} transform Optional transformations to apply on sprite vertices. Won't apply on static sprites.
     * @param {Boolean=} cullOutOfScreen If true, will cull sprites that are not visible in currently set rendering region.
     */
    drawSprite(sprites, transform, cullOutOfScreen)
    {
        // sanity
        this.__validateDrawing(true);

        // make sure array
        if (!Array.isArray(sprites)) {
            sprites = [sprites];
        }

        // mark as dirty
        this.__dirty = true;

        // get colors and uvs array
        let colors = this._buffers.colorsArray;
        let uvs = this._buffers.textureArray;

        // get screen region for culling
        const screenRegion = (cullOutOfScreen || (this.cullOutOfScreen && (cullOutOfScreen === undefined))) ? this.#_gfx._internal.getRenderingRegionInternal() : null;

        // add all sprites
        for (let sprite of sprites) {

            // update texture
            this._updateTexture(sprite.texture);

            // update quads count
            this.__quadsCount++;

            // set colors
            if (colors && this.__currDrawingParams.hasVertexColor) {

                // array of colors
                if (Array.isArray(sprite.color)) {
                    let lastColor = sprite.color[0];
                    for (let x = 0; x < 4; ++x) {
                        let curr = (sprite.color[x] || lastColor);
                        colors[colors._index++] = curr.r;
                        colors[colors._index++] = curr.g;
                        colors[colors._index++] = curr.b;
                        colors[colors._index++] = curr.a;
                        lastColor = curr;
                    }
                }
                // single color
                else {
                    let curr = sprite.color;
                    for (let x = 0; x < 4; ++x) {
                        colors[colors._index++] = curr.r;
                        colors[colors._index++] = curr.g;
                        colors[colors._index++] = curr.b;
                        colors[colors._index++] = curr.a;
                    }
                }
            
            }

            // get source rectangle
            let sourceRect = sprite.sourceRectangle;
            let textureSourceRect = sprite.texture.sourceRectangle;

            // if got source rectangle, set it
            if (sourceRect) 
            {
                textureSourceRect = textureSourceRect || {x:0, y:0, width:0, height:0};
                let twidth = sprite.texture.width;
                let theight = sprite.texture.height;
                let left = (sourceRect.left + textureSourceRect.x) / twidth;
                let right = (sourceRect.right + textureSourceRect.x) / twidth;
                let top = (sourceRect.top + textureSourceRect.y) / theight;
                let bottom = (sourceRect.bottom + textureSourceRect.y) / theight;
                uvs[uvs._index++] = (left);   uvs[uvs._index++] = (top);
                uvs[uvs._index++] = (right);  uvs[uvs._index++] = (top);
                uvs[uvs._index++] = (left);   uvs[uvs._index++] = (bottom);
                uvs[uvs._index++] = (right);  uvs[uvs._index++] = (bottom);
            }
            // if got source rectangle from texture (texture atlas without source rect), set it
            else if (textureSourceRect)
            {
                let normalized = sprite.texture.sourceRectangleNormalized;
                let twidth = sprite.texture.width;
                let theight = sprite.texture.height;
                let left = normalized.left || (textureSourceRect.left) / twidth;
                let right = normalized.right || (textureSourceRect.right) / twidth;
                let top = normalized.top || (textureSourceRect.top) / theight;
                let bottom = normalized.bottom || (textureSourceRect.bottom) / theight;
                uvs[uvs._index++] = (left);   uvs[uvs._index++] = (top);
                uvs[uvs._index++] = (right);  uvs[uvs._index++] = (top);
                uvs[uvs._index++] = (left);   uvs[uvs._index++] = (bottom);
                uvs[uvs._index++] = (right);  uvs[uvs._index++] = (bottom);
            }
            // if got no source rectangle, take entire texture
            else 
            {
                uvs[uvs._index++] = 0;      uvs[uvs._index++] = 0;
                uvs[uvs._index++] = 1;      uvs[uvs._index++] = 0;
                uvs[uvs._index++] = 0;      uvs[uvs._index++] = 1;
                uvs[uvs._index++] = 1;      uvs[uvs._index++] = 1;
            }

            // calculate vertices positions
            let sizeX = sprite.size.x;
            let sizeY = sprite.size.y;
            let left = -sizeX * sprite.origin.x;
            let top = -sizeY * sprite.origin.y;

            // calculate corners
            topLeft.x = left;               topLeft.y = top;
            topRight.x = left + sizeX;      topRight.y = top;
            bottomLeft.x = left;            bottomLeft.y = top + sizeY;
            bottomRight.x = left + sizeX;   bottomRight.y = top + sizeY;

            // are vertices axis aligned?
            let axisAlined = true;

            // apply skew
            if (sprite.skew) 
            {
                // skew on x axis
                if (sprite.skew.x) {
                    topLeft.x += sprite.skew.x * sprite.origin.y;
                    topRight.x += sprite.skew.x * sprite.origin.y;
                    bottomLeft.x -= sprite.skew.x * (1 - sprite.origin.y);
                    bottomRight.x -= sprite.skew.x * (1 - sprite.origin.y);
                    axisAlined = false;
                }
                // skew on y axis
                if (sprite.skew.y) {
                    topLeft.y += sprite.skew.y * sprite.origin.x;
                    bottomLeft.y += sprite.skew.y * sprite.origin.x;
                    topRight.y -= sprite.skew.y * (1 - sprite.origin.x);
                    bottomRight.y -= sprite.skew.y * (1 - sprite.origin.x);
                    axisAlined = false;
                }
            }

            // apply rotation
            if (sprite.rotation) {
                let cos = Math.cos(sprite.rotation);
                let sin = Math.sin(sprite.rotation);
                function rotateVec(vector)
                {
                    let x = (vector.x * cos - vector.y * sin);
                    let y = (vector.x * sin + vector.y * cos);
                    vector.x = x;
                    vector.y = y;
                }
                rotateVec(topLeft);
                rotateVec(topRight);
                rotateVec(bottomLeft);
                rotateVec(bottomRight);
                axisAlined = false;
            }

            // add sprite position
            topLeft.x += sprite.position.x;
            topLeft.y += sprite.position.y;
            topRight.x += sprite.position.x;
            topRight.y += sprite.position.y;
            bottomLeft.x += sprite.position.x;
            bottomLeft.y += sprite.position.y;
            bottomRight.x += sprite.position.x;
            bottomRight.y += sprite.position.y;

            // apply transform
            if (transform && !transform.isIdentity) {
                topLeft.copy((topLeft.z !== undefined) ?  Matrix.transformVector3(transform, topLeft) : Matrix.transformVector2(transform, topLeft));
                topRight.copy((topRight.z !== undefined) ?  Matrix.transformVector3(transform, topRight) : Matrix.transformVector2(transform, topRight));
                bottomLeft.copy((bottomLeft.z !== undefined) ?  Matrix.transformVector3(transform, bottomLeft) : Matrix.transformVector2(transform, bottomLeft));
                bottomRight.copy((bottomRight.z !== undefined) ?  Matrix.transformVector3(transform, bottomRight) : Matrix.transformVector2(transform, bottomRight));
            }

            // cull out-of-screen sprites
            if (screenRegion)
            {
                let destRect = axisAlined ? 
                    new Rectangle(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y) : 
                    Rectangle.fromPoints([topLeft, topRight, bottomLeft, bottomRight]);

                if (!screenRegion.collideRect(destRect)) {
                    return;
                }
            }

            // snap pixels
            if (this.snapPixels)
            {
                topLeft.floorSelf();
                topRight.floorSelf();
                bottomLeft.floorSelf();
                bottomRight.floorSelf();
            }

            // optional z position
            let z = sprite.position.z || 0;
            let zDepth = z + sprite.size.z || 0;

            // update positions buffer
            let positions = this._buffers.positionArray;
            positions[positions._index++] = topLeft.x;             positions[positions._index++] = topLeft.y;             positions[positions._index++] = z;
            positions[positions._index++] = topRight.x;            positions[positions._index++] = topRight.y;            positions[positions._index++] = z;
            positions[positions._index++] = bottomLeft.x;          positions[positions._index++] = bottomLeft.y;          positions[positions._index++] = zDepth;
            positions[positions._index++] = bottomRight.x;         positions[positions._index++] = bottomRight.y;         positions[positions._index++] = zDepth;

            // check if full
            if (this.__quadsCount >= this.__maxQuadsCount) {
                this._handleFullBuffer();
            }
        }
    }

    /**
     * Get how many quads are currently in batch.
     * @returns {Number} Quads in batch count.
     */
    get quadsInBatch()
    {
        return this.__quadsCount;
    }

    /**
     * Get how many quads this sprite batch can contain.
     * @returns {Number} Max quads count.
     */
    get maxQuadsCount()
    {
        return this.__maxQuadsCount;
    }

    /**
     * Check if this batch is full.
     * @returns {Boolean} True if batch is full.
     */
    get isFull()
    {
        return this.__quadsCount >= this.__maxQuadsCount;
    }

    /**
     * Called when the batch becomes full while drawing and there's no handler.
     * @private
     */
    _handleFullBuffer()
    {
        // invoke on-overflow callback
        if (this.onOverflow) {
            this.onOverflow();
        }
        
        // draw current batch and clear
        this._drawBatch();
        this.clear();
    }

    /**
     * @inheritdoc
     * @private
     */
    _drawBatch()
    {
        // get texture and effect
        let texture = this.__currDrawingParams.texture;
        let effect = this.__currDrawingParams.effect;

        // texture not loaded yet? skip
        if (!texture || !texture.valid) { 
            return; 
        }
        
        // should copy buffers
        let needBuffersCopy = this.__dirty;

        // calculate current batch quads count
        let _currBatchCount = this.quadsInBatch;

        // nothing to draw? skip
        if (_currBatchCount === 0) {
            return;
        }

        // get some fields we'll need
        let gl = this.#_gl;
        let gfx = this.#_gfx;
        let positionArray = this._buffers.positionArray;
        let textureArray = this._buffers.textureArray;
        let colorsArray = this.__currDrawingParams.hasVertexColor ? this._buffers.colorsArray : null;
        let positionBuffer = this._buffers.positionBuffer;
        let textureCoordBuffer = this._buffers.textureCoordBuffer;
        let colorsBuffer = this._buffers.colorsBuffer;
        let indexBuffer = this._buffers.indexBuffer;

        // call base method to set effect and draw params
        super._drawBatch();

        // copy position buffer
        effect.setPositionsAttribute(positionBuffer, true);
        if (needBuffersCopy) {
            gl.bufferData(gl.ARRAY_BUFFER, 
                positionArray, 
                this.__buffersUsage, 0, _currBatchCount * 4 * 3);
        }

        // copy texture buffer
        effect.setTextureCoordsAttribute(textureCoordBuffer, true);
        if (needBuffersCopy) {
            gl.bufferData(gl.ARRAY_BUFFER, 
                textureArray, 
                this.__buffersUsage, 0, _currBatchCount * 4 * 2);
        }

        // copy color buffer
        if (this.__currDrawingParams.hasVertexColor && colorsBuffer) {
            effect.setColorsAttribute(colorsBuffer, true);
            if (needBuffersCopy && colorsArray) {
                gl.bufferData(gl.ARRAY_BUFFER, 
                    colorsArray, 
                    this.__buffersUsage, 0, _currBatchCount * 4 * 4);
            }
        }

        // set indices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        // draw elements
        gl.drawElements(gl.TRIANGLES, _currBatchCount * 6, this.__indicesType, 0);
        gfx._internal.drawCallsCount++;
        gfx._internal.drawQuadsCount += _currBatchCount;

        // mark as not dirty
        this.__dirty = false;
        
        // if static, free arrays we no longer need them
        if (this.__staticBuffers) {
            this._buffers.positionArray = this._buffers.textureArray = this._buffers.colorsArray = null;
        }
    }
}

// used for vertices calculations
const topLeft = new Vector2(0, 0);
const topRight = new Vector2(0, 0);
const bottomLeft = new Vector2(0, 0);
const bottomRight = new Vector2(0, 0);

// export the sprite batch base class
module.exports = SpriteBatchBase;