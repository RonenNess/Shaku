import { TextureAssetBase } from "../assets";
import { Color, Rectangle, Vector2, Vector3 } from "../utils";

/**
 * Sprite class.
 */
export class Sprite {
	/**
	 * Build a sprite from params.
	 * @param texture Sprite texture.
	 * @param position Drawing position (at origin). If vector3 is provided, will pass z value to the shader code position attribute.
	 * @param size Drawing size. If vector3 is provided, will pass z value to the shader code position attribute for the bottom vertices, as position.z + size.z.
	 * @param sourceRectangle Source rectangle, or undefined to use the entire texture.
	 * @param color Tint color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
	 * @param rotation Rotate sprite.
	 * @param origin Drawing origin. This will be the point at "position" and rotation origin.
	 * @param skew Skew the drawing corners on X and Y axis, around the origin point.
	 * @returns New sprite instance.
	 */
	public static build(texture: TextureAssetBase, position: Vector2 | Vector3, size: Vector2 | Vector3 | number, sourceRectangle: Rectangle, color: Color | Color[] | undefined, rotation?: number, origin?: Vector2, skew?: Vector2): Sprite {
		const sprite = new Sprite(texture, sourceRectangle);
		sprite.position = position;
		sprite.size = typeof size === "number" ? new Vector2(size, size) : size;
		if(color) sprite.color = color;
		if(rotation) sprite.rotation = rotation;
		if(origin) sprite.origin = origin;
		if(skew) sprite.skew = skew;
		return sprite;
	}

	/**
	 * Sprite's texture.
	 */
	public texture: TextureAssetBase;

	/**
	 * Sprite position.
	 * If Vector3 is provided, the z value will be passed to vertices position in shader code.
	 */
	public position: Vector2 | Vector3;

	/**
	 * Sprite size.
	 * If Vector3 is provided, the z value will be passed to the bottom vertices position in shader code, as position.z + size.z.
	 */
	public size: Vector2 | Vector3;

	/**
	 * Sprite source rectangle in texture.
	 * Null will take entire texture.
	 */
	public sourceRectangle: Rectangle | null;

	/**
	 * Sprite rotation in radians.
	 */
	public rotation: number;

	/**
	 * Sprite origin point.
	 */
	public origin: Vector2 | null;

	/**
	 * Skew the sprite corners on X and Y axis, around the origin point.
	 */
	public skew: Vector2 | null;

	/**
	 * Sprite color.
	 * If array is set, will assign each color to different vertex, starting from top-left.
	 */
	public color: Color | Color[];

	/**
	 * Create the sprite object.
	 * @param texture Sprite texture.
	 * @param sourceRectangle Optional source rectangle.
	 */
	public constructor(texture: TextureAssetBase, sourceRectangle: Rectangle | null = null) {
		this.texture = texture;
		this.position = Vector2.zero();
		this.size = new Vector2(100, 100);
		this.sourceRectangle = sourceRectangle;
		this.rotation = 0;
		this.origin = new Vector2(0.5, 0.5);
		this.skew = null;
		this.color = Color.white;
	}

	/**
	 * Set size to source rectangle size.
	 * @returns this.
	 */
	public setToSourceRectangleSize(): Sprite {
		this.size.copy(this.sourceRectangle.getSize());
		return this;
	}

	/**
	 * Set size to texture size.
	 * @returns this.
	 */
	public setToTextureSize(): Sprite {
		this.size.copy(this.texture.getSize());
		return this;
	}

	/**
	 * Set the source Rectangle automatically from spritesheet.
	 * This method get sprite index in sheet and how many sprites there are in total, and calculate the desired
	 * offset and size in source Rectangle based on it + source image size.
	 * @param texture Texture to set source rectangle from.
	 * @param index Sprite index in spritesheet.
	 * @param spritesCount How many sprites there are in spritesheet in total.
	 * @param margin How many pixels to trim from the tile (default is 0).
	 * @param setSize If true will also set width and height based on source rectangle (default is true).
	 */
	public setSourceFromSpritesheet(texture: TextureAssetBase, index: Vector2, spritesCount: Vector2, margin = 0, setSize?: boolean): void {
		if(texture.width === 0 || texture.height === 0) throw new Error("Texture has illegal size or is not fully loaded yet!");

		const w = (texture.width / spritesCount.x) - (2 * margin);
		const h = (texture.height / spritesCount.y) - (2 * margin);
		const x = w * index.x + margin;
		const y = h * index.y + margin;
		if(setSize || setSize === undefined) this.size.set(w, h);
		if(this.sourceRectangle) this.sourceRectangle.set(x, y, w, h);
		else this.sourceRectangle = new Rectangle(x, y, w, h);
	}

	/**
	 * Clone this sprite.
	 * @returns cloned sprite.
	 */
	public clone(): Sprite {
		const sourceRect = this.sourceRectangle ? this.sourceRectangle.clone() : undefined;
		const ret = new Sprite(this.texture, sourceRect);
		ret.position = this.position.clone();
		ret.size = this.size.clone();
		ret.rotation = this.rotation ?? 0;
		ret.origin = this.origin?.clone() ?? null;
		ret.color = this.color?.clone() ?? null;
		ret.skew = this.skew?.clone() ?? null;
		return ret;
	}

	/**
	 * Check if this sprite is flipped around X axis.
	 * This is just a sugarcoat that returns if size.x < 0.
	 * @returns If sprite is flipped on X axis.
	 */
	public get flipX(): boolean {
		return this.size.x < 0;
	}

	/**
	 * Flip sprite around X axis.
	 * This is just a sugarcoat that set size.x to negative or positive value, without changing its scale.
	 * @param flip Should we flip the sprite around X axis. If undefined, will take the negative of flipX current value, ie will toggle flipping.
	 */
	public set flipX(flip: boolean | undefined) {
		if(flip === undefined) flip = !this.flipX;
		this.size.x = Math.abs(this.size.x) * (flip ? -1 : 1);
	}

	/**
	 * Check if this sprite is flipped around y axis.
	 * This is just a sugarcoat that returns if size.y < 0.
	 * @returns If sprite is flipped on Y axis.
	 */
	public get flipY(): boolean {
		return this.size.y < 0;
	}

	/**
	 * Flip sprite around Y axis.
	 * This is just a sugarcoat that set size.y to negative or positive value, without changing its scale.
	 * @param flip Should we flip the sprite around Y axis. If undefined, will take the negative of flipY current value, ie will toggle flipping.
	 */
	public set flipY(flip: boolean | undefined) {
		if(flip === undefined) flip = !this.flipY;
		this.size.y = Math.abs(this.size.y) * (flip ? -1 : 1);
	}
}
