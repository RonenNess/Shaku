import { TextureFilterModes, TextureWrapModes } from "../gfx";
import { Vector2 } from "../utils";
import { Asset } from "./asset";

/**
 * Base type for all texture asset types.
 */
export abstract class TextureAssetBase extends Asset {
	private filter: TextureFilterModes | null;
	private wrapMode: TextureWrapModes | null;

	/**
	 * @inheritdoc
	 */
	public constructor(url: string) {
		super(url);
		this.filter = null;
		this.wrapMode = null;
	}

	/**
	 * Get texture magnifying filter, or null to use default.
	 */
	public getFilter(): TextureFilterModes | null {
		return this.filter;
	}

	/**
	 * Set texture magnifying filter.
	 * @param value Filter mode to use or null to use default.
	 */
	public setFilter(value: TextureFilterModes | null) {
		this.filter = value;
	}

	/**
	 * Get texture wrapping mode, or null to use default.
	 */
	public getWrapMode(): TextureWrapModes | null {
		return this.wrapMode;
	}

	/**
	 * Set texture wrapping mode.
	 * @param value Wrapping mode to use or null to use default.
	 */
	public setWrapMode(value: TextureWrapModes | null) {
		this.wrapMode = value;
	}

	/**
	 * Get texture size as a vector.
	 * @returns Texture size.
	 */
	public getSize(): Vector2 {
		return new Vector2(this.getWidth(), this.getHeight());
	}

	/**
	 * Get raw image.
	 * @returns {Image} Image instance.
	 */
	public abstract getImage(): unknown;

	/**
	 * Get texture width.
	 * @returns Texture width.
	 */
	public abstract getWidth(): number;

	/**
	 * Get texture height.
	 * @returns Texture height.
	 */
	public abstract getHeight(): number;

	/**
	 * Get texture instance for WebGL.
	 */
	protected abstract getGlTexture(): unknown;
}
