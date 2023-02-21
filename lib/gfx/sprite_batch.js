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
const { Rectangle } = require('../utils');
const Vector2 = require('../utils/vector2');
const DrawBatch = require('./draw_batch');
const _logger = require('../logger.js').getLogger('gfx');


/**
 * Sprite batch renderer. 
 * Responsible to drawing a batch of sprites with as little draw calls as possible.
 */
class SpriteBatch extends DrawBatch
{
    /**
     * Create the spritebatch.
     * @param {Gfx} gfx Gfx manager.
     */
    constructor(gfx)
    {
        // init draw batch
        super(gfx);
        
        /** 
         * If true, will floor vertices positions before pushing them to batch.
         */
        this.snapPixels = true;

        /**
         * If true, will slightly offset texture uv when rotating sprites, to prevent bleeding while using texture atlas.
         */
        this.applyAntiBleeding = true;
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
        if (sprites.length === undefined) { 
            sprites = [sprites]; 
        }

        // get visible region
        let region = cullOutOfScreen ? this._gfx.__getRenderingRegionInternal() : null;

        // get buffers
        let positions = this._positions;
        let uvs = this._uvs;
        let colors = this._colors;
        
        for (let sprite of sprites) {

            // check if need to draw current batch
            if (this._batchDrawingCount >= this.batchSpritesCount) {
                this._drawCurrentBatch();
            }
        
            // make sure texture or blend don't change in the middle
            if ((this._texture !== sprite.texture) || (this._blend !== sprite.blendMode)) {
                throw new Error("Can't change texture or blend mode in the middle of a batch!");
            }

            // set colors batch
            let ci = this._batchDrawingCount * 4 * 4;

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

            // check if its a static sprite with cached properties. if so, we'll use it.
            if (sprite.static && sprite._cachedVertices) {

                // get vertices from cache
                let cTopLeft = sprite._cachedVertices[0];
                let cTopRight = sprite._cachedVertices[1];
                let cBottomLeft = sprite._cachedVertices[2];
                let cBottomRight = sprite._cachedVertices[3];

                // set positions
                let pi = this._batchDrawingCount * 4 * 3;
                positions[pi+0] = cTopLeft.position.x;             positions[pi+1] = cTopLeft.position.y;             positions[pi+2] = cTopLeft.position.z || 0;
                positions[pi+3] = cTopRight.position.x;            positions[pi+4] = cTopRight.position.y;            positions[pi+5] = cTopRight.position.z || 0;
                positions[pi+6] = cBottomLeft.position.x;          positions[pi+7] = cBottomLeft.position.y;          positions[pi+8] = cBottomLeft.position.z || 0;
                positions[pi+9] = cBottomRight.position.x;         positions[pi+10] = cBottomRight.position.y;        positions[pi+11] = cBottomRight.position.z || 0;
        
                // set uvs
                let uvi = this._batchDrawingCount * 4 * 2;
                uvs[uvi+0] = cTopLeft.uv.x;          uvs[uvi+1] = cTopLeft.uv.y;
                uvs[uvi+2] = cBottomRight.uv.x;      uvs[uvi+3] = cTopLeft.uv.y;
                uvs[uvi+4] = cTopLeft.uv.x;          uvs[uvi+5] = cBottomRight.uv.y;
                uvs[uvi+6] = cBottomRight.uv.x;      uvs[uvi+7] = cBottomRight.uv.y;

                // increase sprites count and continue
                this._batchDrawingCount++;
                continue;
            }

            // calculate vertices positions
            let sizeX = sprite.size.x;
            let sizeY = sprite.size.y;
            let left = -sizeX * sprite.origin.x;
            let top = -sizeY * sprite.origin.y;

            // calculate corners
            topLeft.set(left, top);
            topRight.set(left + sizeX, top);
            bottomLeft.set(left, top + sizeY);
            bottomRight.set(left + sizeX, top + sizeY);

            // are vertices axis aligned?
            let axisAlined = true;

            // apply skew
            if (sprite.skew) {
                if (sprite.skew.x) {
                    topLeft.x += sprite.skew.x * sprite.origin.y;
                    topRight.x += sprite.skew.x * sprite.origin.y;
                    bottomLeft.x -= sprite.skew.x * (1 - sprite.origin.y);
                    bottomRight.x -= sprite.skew.x * (1 - sprite.origin.y);
                    axisAlined = false;
                }
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
                    vector.set(x, y);
                }
                rotateVec(topLeft);
                rotateVec(topRight);
                rotateVec(bottomLeft);
                rotateVec(bottomRight);
                axisAlined = false;
            }

            // add sprite position
            topLeft.addSelf(sprite.position);
            topRight.addSelf(sprite.position);
            bottomLeft.addSelf(sprite.position);
            bottomRight.addSelf(sprite.position);

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
            let zDepth = sprite.size.z || 0;

            // cull out-of-screen sprites
            if (cullOutOfScreen)
            {
                let destRect = axisAlined ? new Rectangle(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y) : 
                                            Rectangle.fromPoints([topLeft, topRight, bottomLeft, bottomRight]);
                if (!region.collideRect(destRect)) {
                    continue;
                }
            }

            // update positions buffer
            let pi = this._batchDrawingCount * 4 * 3;
            positions[pi+0] = topLeft.x;             positions[pi+1] = topLeft.y;             positions[pi+2] = z;
            positions[pi+3] = topRight.x;            positions[pi+4] = topRight.y;            positions[pi+5] = z;
            positions[pi+6] = bottomLeft.x;          positions[pi+7] = bottomLeft.y;          positions[pi+8] = z + zDepth;
            positions[pi+9] = bottomRight.x;         positions[pi+10] = bottomRight.y;        positions[pi+11] = z + zDepth;

            // set uvs buffer
            let uvi = this._batchDrawingCount * 4 * 2;
            var uvTl;
            var uvBr;

            // got source rect, apply uvs
            if (sprite.sourceRect) {
                uvTl = {x: sprite.sourceRect.x / this._texture.width, y: sprite.sourceRect.y / this._texture.height};
                uvBr = {x: uvTl.x + (sprite.sourceRect.width / this._texture.width), y: uvTl.y + (sprite.sourceRect.height / this._texture.height)};
                if (sprite.rotation && this.applyAntiBleeding) {
                    let marginX = 0.015 / this._texture.width;
                    let marginY = 0.015 / this._texture.height;
                    uvTl.x += marginX;
                    uvBr.x -= marginX * 2;
                    uvTl.y += marginY;
                    uvBr.y -= marginY * 2;
                }
                uvs[uvi+0] = uvTl.x;  uvs[uvi+1] = uvTl.y;
                uvs[uvi+2] = uvBr.x;  uvs[uvi+3] = uvTl.y;
                uvs[uvi+4] = uvTl.x;  uvs[uvi+5] = uvBr.y;
                uvs[uvi+6] = uvBr.x;  uvs[uvi+7] = uvBr.y;
            }
            // no source rect, take entire texture
            else {
                uvs[uvi+0] = 0;  uvs[uvi+1] = 0;
                uvs[uvi+2] = 1;  uvs[uvi+3] = 0;
                uvs[uvi+4] = 0;  uvs[uvi+5] = 1;
                uvs[uvi+6] = 1;  uvs[uvi+7] = 1;
            }

            // set cached vertices
            if (sprite.static) {
                sprite._cachedVertices = [
                    {position: topLeft.clone(), uv: uvTl || {x:0, y:0}},
                    {position: topRight.clone()},
                    {position: bottomLeft.clone()},
                    {position: bottomRight.clone(), uv: uvBr || {x:1, y:1}},
                ];
            }
                    
            // increase sprites count
            this._batchDrawingCount++;
        }
    }
}

// used for vertices calculations
const topLeft = new Vector2(0, 0);
const topRight = new Vector2(0, 0);
const bottomLeft = new Vector2(0, 0);
const bottomRight = new Vector2(0, 0);


// export the sprite batch class
module.exports = SpriteBatch;