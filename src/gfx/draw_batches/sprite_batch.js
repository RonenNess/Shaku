/**
 * Implement the gfx sprite batch renderer.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\gfx\draw_batches\sprite_batch.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const TextureAssetBase = require('../../assets/texture_asset_base');
const { Rectangle } = require('../../utils');
const Vector2 = require('../../utils/vector2');
const Vector3 = require('../../utils/vector3');
const DrawBatch = require('./draw_batch');
const SpriteBatchBase = require('./sprite_batch_base');
const _logger = require('../../logger.js').getLogger('gfx-sprite-batch');


/**
 * Sprite batch renderer. 
 * Responsible to drawing a batch of sprites with as little draw calls as possible.
 */
class SpriteBatch extends SpriteBatchBase
{
    /**
     * Create the sprites batch.
     * @param {Number=} batchSpritesCount Internal buffers size, in sprites count (sprite = 4 vertices). Bigger value = faster rendering but more RAM.
     * @param {Boolean=} enableVertexColor If true (default) will support vertex color. 
     * @param {Boolean=} enableNormals If true (not default) will support vertex normals.
     * @param {Boolean=} enableBinormals If true (not default) will support vertex binormals.
     * @param {Boolean=} enableTangents If true (not default) will support vertex tangents.
     */
    constructor(batchSpritesCount, enableVertexColor, enableNormals, enableBinormals, enableTangents)
    {
        // init draw batch
        super(batchSpritesCount, enableVertexColor, enableNormals, enableBinormals, enableTangents);
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
    get defaultEffect()
    {
        return this.supportVertexColor ? this.#_gfx.builtinEffects.Sprites : this.#_gfx.builtinEffects.SpritesNoVertexColor;
    }

    /**
     * Push vertices to drawing batch.
     * @param {TextureAssetBase} texture Texture to draw.
     * @param {Array<Vertex>} vertices Vertices to push. Vertices count must be dividable by 4 to keep the batch consistent of quads.
     */
    drawVertices(texture, vertices)
    {
        // sanity
        this.__validateDrawing(true);

        // update texture
        this._updateTexture(texture);

        // sanity check
        if ((vertices.length % 4) !== 0) {
            _logger.warn("Tried to push vertices that are not multiplication of 4!");
            return;
        }

        // push vertices
        let i = 0;
        let colors = this._buffers.colorsArray;
        let uvs = this._buffers.textureArray;
        let positions = this._buffers.positionArray;
        let normals = this._buffers.normalsArray;
        let binormals = this._buffers.binormalsArray;
        let tangents = this._buffers.tangentsArray;
        for (let vertex of vertices)
        {
            // push color
            if (this.__currDrawingParams.hasVertexColor) {
                colors[colors._index++] = (vertex.color.r || 0);
                colors[colors._index++] = (vertex.color.g || 0);
                colors[colors._index++] = (vertex.color.b || 0);
                colors[colors._index++] = (vertex.color.a || 0);
            }

            // push normals
            if (normals)
            {
                if (vertex.normal) {
                    normals[normals._index++] = vertex.normal.x;
                    normals[normals._index++] = vertex.normal.y;
                    normals[normals._index++] = vertex.normal.z;
                }
                else {
                    normals[normals._index++] = normals[normals._index++] = normals[normals._index++] = 0;
                }
            }

            // push binormals
            if (binormals)
            {
                if (vertex.binormal) {
                    binormals[binormals._index++] = vertex.binormal.x;
                    binormals[binormals._index++] = vertex.binormal.y;
                    binormals[binormals._index++] = vertex.binormal.z;
                }
                else {
                    binormals[binormals._index++] = binormals[binormals._index++] = binormals[binormals._index++] = 0;
                }
            }

            // push tangents
            if (tangents)
            {
                if (vertex.tangent) {
                    tangents[tangents._index++] = vertex.tangent.x;
                    tangents[tangents._index++] = vertex.tangent.y;
                    tangents[tangents._index++] = vertex.tangent.z;
                }
                else {
                    tangents[tangents._index++] = tangents[tangents._index++] = tangents[tangents._index++] = 0;
                }
            }

            // push texture coords
            uvs[uvs._index++] = (vertex.textureCoord.x || 0);          
            uvs[uvs._index++] = (vertex.textureCoord.y || 0);

            // push position
            positions[positions._index++] = (vertex.position.x || 0);
            positions[positions._index++] = (vertex.position.y || 0);
            positions[positions._index++] = (vertex.position.z || 0);

            // every 4 vertices..
            if (i++ === 3) 
            {
                // update quads count
                this.__quadsCount++;

                // check if full
                if (this.__quadsCount >= this.__maxQuadsCount) {
                    this._handleFullBuffer();
                }

                // reset count
                i = 0;
            }
        }

        // mark as dirty
        this.__dirty = true;
    }

    /**
     * Add a quad to draw.
     * @param {TextureAssetBase} texture Texture to draw.
     * @param {Vector2|Vector3} position Drawing position (at origin). If vector3 is provided, will pass z value to the shader code position attribute.
     * @param {Vector2|Vector3|Number} size Drawing size. If vector3 is provided, will pass z value to the shader code position attribute for the bottom vertices, as position.z + size.z.
     * @param {Rectangle} sourceRectangle Source rectangle, or undefined to use the entire texture.
     * @param {Color|Array<Color>|undefined} color Tint color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
     * @param {Number=} rotation Rotate sprite.
     * @param {Vector2=} origin Drawing origin. This will be the point at 'position' and rotation origin.
     * @param {Vector2=} skew Skew the drawing corners on X and Y axis, around the origin point.
     */
    drawQuad(texture, position, size, sourceRectangle, color, rotation, origin, skew)
    {
        let sprite = this.#_gfx.Sprite.build(texture, position, size, sourceRectangle, color, rotation, origin, skew);
        this.drawSprite(sprite);
    }

    /**
     * Add sprites group to this batch.
     * @param {SpritesGroup} group Sprite group to draw.
     * @param {Boolean=} cullOutOfScreen If true, will cull sprites that are not visible in currently set rendering region.
     */
    drawSpriteGroup(group, cullOutOfScreen)
    {
        let transform = group.getTransform();
        this.drawSprite(group._sprites, transform, cullOutOfScreen);
    }

    /**
     * Add a quad that covers a given destination rectangle.
     * @param {TextureAssetBase} texture Texture to draw.
     * @param {Rectangle|Vector2} destRect Destination rectangle to draw on. If vector is provided, will draw from 0,0 with vector as size.
     * @param {Rectangle=} sourceRect Source rectangle, or undefined to use the entire texture.
     * @param {Color|Array<Color>|undefined} color Tint color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
     * @param {Vector2=} origin Drawing origin. This will be the point at 'position' and rotation origin.
     */
    drawRectangle(texture, destRect, sourceRect, color, origin)
    {
        if ((destRect.isVector2) || (destRect.isVector3)) {
            destRect = new Rectangle(0, 0, destRect.x, destRect.y);
        }
        let position = origin ? destRect.getPosition().addSelf(size.mul(origin)) : destRect.getCenter();
        origin = origin || Vector2.halfReadonly;
        let size = destRect.getSize();
        this.drawQuad(texture, position, size, sourceRect, color);
    }
}


// export the sprite batch class
module.exports = SpriteBatch;