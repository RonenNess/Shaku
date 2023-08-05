import { TextureFilterModes } from "../gfx";
import { Rectangle, Vector2 } from "../utils";
import { FontTextureAsset } from "./font_texture_asset";
import { JsonAsset } from "./json_asset";
import { TextureAsset } from "./texture_asset";

/**
 * A MSDF font texture asset, from a pregenerated msdf texture atlas (from msdf-bmfont-xml, for example).
 * This asset uses a signed distance field atlas to render characters as sprites at high res.
 */
export class MsdfFontTextureAsset extends FontTextureAsset {
	private _positionOffsets: Record<string, Vector2> | null;
	private _xAdvances: Record<string, number> | null;
	private _placeholderChar: string;
	private _fontName: string;
	private _fontSize: number;
	private _lineHeight: number;
	private _sourceRects: unknown;
	private _kernings: unknown | null;
	private _texture: TextureAsset | null;

	/** @inheritdoc */
	public constructor(url: string) {
		super(url);
		this._positionOffsets = null;
		this._xAdvances = null;
	}

	/**
	 * Generate the font metadata and texture from the given URL.
	 * @param params Additional params. Possible values are:
	 * - jsonUrl: mandatory url for the font's json metadata (generated via msdf-bmfont-xml, for example)
	 * - textureUrl: mandatory url for the font's texture atlas (generated via msdf-bmfont-xml, for example)
	 * - missingCharPlaceholder (default="?"): character to use for missing characters.
	 *
	 * @returns Promise to resolve when fully loaded.
	 */
	public load(params: { jsonUrl: string; textureUrl: string; missingCharPlaceholder?: string; }): Promise<void> {
		return new Promise(async (resolve, reject) => {

			if(!params || !params.jsonUrl || !params.textureUrl) {
				return reject("When loading an msdf font you must provide params with a 'jsonUrl' and a 'textureUrl'!");
			}

			// TODO: allow atlas with multiple textures
			// TODO: infer textureUrl from json contents
			// TODO: infer jsonUrl from url

			let atlasJson = new JsonAsset(params.jsonUrl);
			let atlasTexture = new TextureAsset(params.textureUrl);
			await Promise.all([atlasJson.load(), atlasTexture.load()]);

			let atlasMetadata = atlasJson.data;
			atlasTexture.filter = TextureFilterModes.LINEAR;

			if(atlasMetadata.common.pages > 1) {
				throw new Error("Can't use MSDF font with several pages");
			}

			// set default missing char placeholder + store it
			this._placeholderChar = (params.missingCharPlaceholder || "?")[0];

			if(!atlasMetadata.info.charset.includes(this._placeholderChar)) {
				throw new Error("The atlas' charset doesn't include the given placeholder character");
			}

			this._fontName = atlasMetadata.info.face;
			this._fontSize = atlasMetadata.info.size;

			// set line height
			this._lineHeight = atlasMetadata.common.lineHeight;

			// dictionaries to store per-character data
			this._sourceRects = {};
			this._positionOffsets = {};
			this._xAdvances = {};
			this._kernings = {};

			for(const charData of atlasMetadata.chars) {
				let currChar = charData.char;

				let sourceRect = new Rectangle(charData.x, charData.y, charData.width, charData.height);
				this._sourceRects[currChar] = sourceRect;
				this._positionOffsets[currChar] = new Vector2(
					charData.xoffset,
					charData.yoffset
				);
				this._xAdvances[currChar] = charData.xadvance;
			}

			this._texture = atlasTexture;
			this._notifyReady();
			resolve();
		});
	}

	/**
	 * Get texture width.
	 * @returns Texture width.
	 */
	public get width(): number {
		return this._texture._width;
	}

	/**
	 * Get texture height.
	 * @returns Texture height.
	 */
	public get height(): number {
		return this._texture._height;
	}

	/**
	 * Get texture size as a vector.
	 * @returns Texture size.
	 */
	public getSize(): Vector2 {
		return this._texture.getSize();
	}

	/** @inheritdoc */
	public getPositionOffset(character: string): Vector2 {
		return this._positionOffsets[character] || this._positionOffsets[this.placeholderCharacter];
	}

	/** @inheritdoc */
	public getXAdvance(character: string): number {
		return this._xAdvances[character] || this._xAdvances[this.placeholderCharacter];
	}

	/** @inheritdoc */
	public destroy(): void {
		super.destroy();
		this._positionOffsets = null;
		this._xAdvances = null;
		this._kernings = null;
	}
}
