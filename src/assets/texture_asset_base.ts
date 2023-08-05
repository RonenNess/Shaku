import { TextureFilterModes, TextureWrapModes } from "../gfx";
import { Vector2 } from "../utils";
import { Asset } from "./asset";

/**
 * Base type for all texture asset types.
 */
export abstract class TextureAssetBase extends Asset {
	private _filter: TextureFilterModes | null;
	private _wrapMode: TextureWrapModes | null;

	/** @inheritdoc */
	public constructor(url: string) {
		super(url);
		this._filter = null;
		this._wrapMode = null;
	}

	/**
	 * Get texture magnifying filter, or null to use default.
	 */
	public get filter(): TextureFilterModes | null {
		return this._filter;
	}

	/**
	 * Set texture magnifying filter.
	 * @param value Filter mode to use or null to use default.
	 */
	public set filter(value: TextureFilterModes | null) {
		this._filter = value;
	}

	/**
	 * Get texture wrapping mode, or null to use default.
	 */
	public get wrapMode(): TextureWrapModes | null {
		return this._wrapMode;
	}

	/**
	 * Set texture wrapping mode.
	 * @param value Wrapping mode to use or null to use default.
	 */
	public set wrapMode(value: TextureWrapModes | null) {
		this._wrapMode = value;
	}

	/**
	 * Get raw image.
	 * @returns {Image} Image instance.
	 */
	public abstract get image(): unknown;

	/**
	 * Get texture width.
	 * @returns Texture width.
	 */
	public abstract get width(): number;

	/**
	 * Get texture height.
	 * @returns Texture height.
	 */
	public abstract get height(): number;

	/**
	 * Get texture size as a vector.
	 * @returns Texture size.
	 */
	public getSize(): Vector2 {
		return new Vector2(this.width, this.height);
	}

	/**
	 * Get texture instance for WebGL.
	 */
	protected abstract get _glTexture(): unknown;
}
