/**
 * Define a sprites group.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\sprites_group.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Color = require("../utils/color");
const Vector2 = require("../utils/vector2");
const Matrix = require("./matrix");
const Sprite = require("./sprite");


/**
 * Sprites group class.
 * This object is a container to hold sprites collection + parent transformations.
 * You need SpritesGroup to use batched rendering.
 */
class SpritesGroup
{
    /**
     * Create the group object.
     */
    constructor()
    {
        this._sprites = [];
        this.rotation = 0;
        this.position = new Vector2(0, 0);
        this.scale = new Vector2(1, 1);
    }

    /**
     * Iterate all sprites.
     * @param {Function} callback Callback to run on all sprites in group.
     */
    forEach(callback)
    {
        this._sprites.forEach(callback);
    }

    /**
     * Set color for all sprites in group.
     * @param {Color} color Color to set.
     */
    setColor(color)
    {
        for (let i = 0; i < this._sprites.length; ++i) {
            this._sprites[i].color.copy(color);
        }
    }

    /**
     * Get group's transformations.
     * @returns {Matrix} Transformations matrix, or null if there's nothing to apply.
     */
    getTransform()
    {
        let matrices = [];

        if ((this.position.x !== 0) || (this.position.y !== 0)) 
        { 
            matrices.push(Matrix.translate(this.position.x, this.position.y, 0));
        }
        
        if (this.rotation) 
        { 
            matrices.push(Matrix.rotateZ(-this.rotation));
        }
        
        if ((this.scale.x !== 1) || (this.scale.y !== 1)) 
        { 
            matrices.push(Matrix.scale(this.scale.x, this.scale.y));
        }

        if (matrices.length === 0) { return null };
        if (matrices.length === 1) { return matrices[0]; }
        return Matrix.multiplyMany(matrices);
    }
    
    /**
     * Adds a sprite to group.
     * @param {Sprite} sprite Sprite to add.
     * @returns {Sprite} The newly added sprite.
     */
    add(sprite)
    {
        this._sprites.push(sprite);
        return sprite;
    }
        
    /**
     * Remove a sprite from group.
     * @param {Sprite} sprite Sprite to remove.
     */
    remove(sprite)
    {
        for (let i = 0; i < this._sprites.length; ++i) {
            if (this._sprites[i] === sprite) {
                this._sprites.splice(i, 1);
                return;
            }
        }
    }

    /**
     * Shift first sprite element.
     * @returns {Sprite} The removed sprite.
     */
    shift()
    {
        return this._sprites.shift();
    }

    /**
     * Sort sprites.
     * @param {Function} compare Comparer method.
     */
    sort(compare)
    {
        this._sprites.sort(compare);
    }

    /**
     * Sort by texture and blend mode for maximum efficiency in batching.
     * This will change sprites order.
     */
    sortForBatching()
    {
        this._sprites.sort((a,b) => {
            let at = a.texture.url + a.blendMode;
            let bt = b.texture.url + b.blendMode;
            return (at > bt) ? 1 : ((bt > at) ? -1 : 0);
        });
    }

    /**
     * Sprites count in group.
     * @returns {Number} Number of sprites in group.
     */
    get count()
    {
        return this._sprites.length;
    }
}


// export the sprites group class.
module.exports = SpritesGroup;