/**
 * Implement the gfx sprite batch renderer.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\gfx.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';
const Matrix = require('./matrix');
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
    }

    /**
     * Start drawing a batch.
     * @param {Effect} effect Effect to use.
     * @param {Matrix} transform Optional transformations to apply on all sprites.
     */
    begin(effect, transform)
    {
        if (this._drawing) {
            _logger.error("Starting drawing batch while already drawing a batch!");
        }

        this._gfx.useEffect(effect);
        this._effect = this._gfx._activeEffect;
        
        this._currBlend = null;
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
        if (this._currBatchCount) {
            this._drawCurrentBatch();
        }
        this._drawing = false;
    }

    /**
     * Add sprite to batch.
     * Note: changing texture or blend mode may trigger a draw call.
     * @param {Sprite} sprite Sprite to draw.
     */
    draw(sprite)
    {
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

        // apply rotation
        if (sprite.rotation) {
            let cos = Math.cos(sprite.rotation);
            let sin = Math.sin(sprite.rotation);
            function rotateVec(vector)
            {
                let x = (vector.x * cos - vector.y * sin);
                let y = (vector.x * sin + vector.y * cos);
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

        // cull out-of-screen sprites
        if (cullOutOfScreen)
        {
            let region = this.getRenderingRegion();
            let destRect = Rectangle.fromPoints([topLeft, topRight, bottomLeft, bottomRight]);
            if (!region.collideRect(destRect)) {
                continue;
            }
        }

        // update positions buffer
        let pi = this._currBatchCount * 4 * 3;
        positions[pi+0] = topLeft.x;             positions[pi+1] = topLeft.y;             positions[pi+2] = 0;
        positions[pi+3] = topRight.x;            positions[pi+4] = topRight.y;            positions[pi+5] = 0;
        positions[pi+6] = bottomLeft.x;          positions[pi+7] = bottomLeft.y;          positions[pi+8] = 0;
        positions[pi+9] = bottomRight.x;         positions[pi+10] = bottomRight.y;        positions[pi+11] = 0;

        // add uvs
        let uvi = this._currBatchCount * 4 * 2;
        if (sprite.sourceRect) {
            let uvTl = {x: sprite.sourceRect.x / this._currTexture.width, y: sprite.sourceRect.y / this._currTexture.height};
            let uvBr = {x: uvTl.x + sprite.sourceRect.width / this._currTexture.width, y: uvTl.y + sprite.sourceRect.height / this._currTexture.height};
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
        for (let x = 0; x < 4; ++x) {
            colors[ci + x*4 + 0] = sprite.color.r;
            colors[ci + x*4 + 1] = sprite.color.g;
            colors[ci + x*4 + 2] = sprite.color.b;
            colors[ci + x*4 + 3] = sprite.color.a;
        }
                
        // increase sprites count
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


// export the sprite batch class
module.exports = SpriteBatch;