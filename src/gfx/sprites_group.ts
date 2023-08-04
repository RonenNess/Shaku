import Color from "../utils/color";
import Matrix from "../utils/matrix";
import Vector2 from "../utils/vector2";
import Sprite from "./sprite";

/**
 * Sprites group class.
 * This object is a container to hold sprites collection + parent transformations.
 * You need SpritesGroup to use batched rendering.
 */
class SpritesGroup {
	/**
	 * Create the group object.
	 */
	constructor() {
		this._sprites = [];
		this.rotation = 0;
		this.position = new Vector2(0, 0);
		this.scale = new Vector2(1, 1);
	}

	/**
	 * Iterate all sprites.
	 * @param {Function} callback Callback to run on all sprites in group.
	 */
	forEach(callback) {
		this._sprites.forEach(callback);
	}

	/**
	 * Set color for all sprites in group.
	 * @param {Color} color Color to set.
	 */
	setColor(color) {
		for(let i = 0; i < this._sprites.length; ++i) {
			this._sprites[i].color.copy(color);
		}
	}

	/**
	 * Get group's transformations.
	 * @returns {Matrix} Transformations matrix, or null if there's nothing to apply.
	 */
	getTransform() {

		let matrices = [];

		// add position
		if((this.position.x !== 0) || (this.position.y !== 0)) {
			matrices.push(Matrix.createTranslation(this.position.x, this.position.y, 0));
		}

		// add rotation
		if(this.rotation) {
			matrices.push(Matrix.createRotationZ(-this.rotation));
		}

		// add scale
		if((this.scale.x !== 1) || (this.scale.y !== 1)) {
			matrices.push(Matrix.createScale(this.scale.x, this.scale.y));
		}

		// calculate matrix (or null if there are no transformations)
		if(matrices.length === 0) { return null; };
		if(matrices.length === 1) { return matrices[0]; }
		return Matrix.multiplyMany(matrices);
	}

	/**
	 * Adds a sprite to group.
	 * @param {Sprite} sprite Sprite to add.
	 * @returns {Sprite} The newly added sprite.
	 */
	add(sprite) {
		this._sprites.push(sprite);
		return sprite;
	}

	/**
	 * Remove a sprite from group.
	 * @param {Sprite} sprite Sprite to remove.
	 */
	remove(sprite) {
		for(let i = 0; i < this._sprites.length; ++i) {
			if(this._sprites[i] === sprite) {
				this._sprites.splice(i, 1);
				return;
			}
		}
	}

	/**
	 * Shift first sprite element.
	 * @returns {Sprite} The removed sprite.
	 */
	shift() {
		return this._sprites.shift();
	}

	/**
	 * Sort sprites.
	 * @param {Function} compare Comparer method.
	 */
	sort(compare) {
		this._sprites.sort(compare);
	}

	/**
	 * Sprites count in group.
	 * @returns {Number} Number of sprites in group.
	 */
	get count() {
		return this._sprites.length;
	}
}

// export the sprites group class.
export default SpritesGroup;
