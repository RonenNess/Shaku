export = SpritesGroup;
/**
 * Sprites group class.
 * This object is a container to hold sprites collection + parent transformations.
 * You need SpritesGroup to use batched rendering.
 */
declare class SpritesGroup {
    _sprites: any[];
    rotation: number;
    position: Vector2;
    scale: Vector2;
    /**
     * Iterate all sprites.
     * @param {Function} callback Callback to run on all sprites in group.
     */
    forEach(callback: Function): void;
    /**
     * Set color for all sprites in group.
     * @param {Color} color Color to set.
     */
    setColor(color: Color): void;
    /**
     * Get group's transformations.
     * @returns {Matrix} Transformations matrix, or null if there's nothing to apply.
     */
    getTransform(): Matrix;
    /**
     * Adds a sprite to group.
     * @param {Sprite} sprite Sprite to add.
     * @returns {Sprite} The newly added sprite.
     */
    add(sprite: Sprite): Sprite;
    /**
     * Remove a sprite from group.
     * @param {Sprite} sprite Sprite to remove.
     */
    remove(sprite: Sprite): void;
    /**
     * Shift first sprite element.
     * @returns {Sprite} The removed sprite.
     */
    shift(): Sprite;
    /**
     * Sort sprites.
     * @param {Function} compare Comparer method.
     */
    sort(compare: Function): void;
    /**
     * Sort by texture and blend mode for maximum efficiency in batching.
     * This will change sprites order.
     */
    sortForBatching(): void;
    /**
     * Sprites count in group.
     * @returns {Number} Number of sprites in group.
     */
    get count(): number;
}
import Vector2 = require("../utils/vector2");
import Color = require("../utils/color");
import Matrix = require("./matrix");
import Sprite = require("./sprite");
//# sourceMappingURL=sprites_group.d.ts.map