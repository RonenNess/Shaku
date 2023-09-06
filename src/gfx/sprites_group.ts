import { Color, Matrix, Vector2 } from "../utils";
import { Sprite } from "./sprite";

/**
 * Sprites group class.
 * This object is a container to hold sprites collection + parent transformations.
 * You need SpritesGroup to use batched rendering.
 */
export class SpritesGroup {
	public rotation: number;
	public position: Vector2;
	public scale: Vector2;

	private sprites: Sprite[];

	/**
	 * Create the group object.
	 */
	public constructor() {
		this.sprites = [];
		this.rotation = 0;
		this.position = new Vector2(0, 0);
		this.scale = new Vector2(1, 1);
	}

	/**
	 * Iterate all sprites.
	 * @param callback Callback to run on all sprites in group.
	 */
	public forEach(callback: (sprite: Sprite) => void): void {
		this.sprites.forEach(callback);
	}

	/**
	 * Set color for all sprites in group.
	 * @param color Color to set.
	 */
	public setColor(color: Color): void {
		for(let i = 0; i < this.sprites.length; ++i) this.sprites[i].color.copy(color);
	}

	/**
	 * Get group's transformations.
	 * @returns Transformations matrix, or null if there's nothing to apply.
	 */
	public getTransform(): Matrix | null {
		const matrices = [];

		// add position
		if((this.position.x !== 0) || (this.position.y !== 0)) matrices.push(Matrix.createTranslation(this.position.x, this.position.y, 0));

		// add rotation
		if(this.rotation) matrices.push(Matrix.createRotationZ(-this.rotation));

		// add scale
		if((this.scale.x !== 1) || (this.scale.y !== 1)) matrices.push(Matrix.createScale(this.scale.x, this.scale.y));

		// calculate matrix (or null if there are no transformations)
		if(matrices.length === 0) return null;
		if(matrices.length === 1) return matrices[0];
		return Matrix.multiplyMany(matrices);
	}

	/**
	 * Adds a sprite to group.
	 * @param sprite Sprite to add.
	 * @returns The newly added sprite.
	 */
	public add(sprite: Sprite): Sprite {
		this.sprites.push(sprite);
		return sprite;
	}

	/**
	 * Remove a sprite from group.
	 * @param sprite Sprite to remove.
	 */
	public remove(sprite: Sprite): void {
		const index = this.sprites.indexOf(sprite);
		if(index !== -1) this.sprites.splice(index, 1);
	}

	/**
	 * Shift first sprite element.
	 * @returns The removed sprite.
	 */
	public shift(): Sprite {
		return this.sprites.shift();
	}

	/**
	 * Sort sprites.
	 * @param compare Comparer method.
	 */
	public sort(compare: (a: Sprite, b: Sprite) => number) {
		this.sprites.sort(compare);
	}

	/**
	 * Sprites count in group.
	 * @returns Number of sprites in group.
	 */
	public getCount(): number {
		return this.sprites.length;
	}
}
