export = MsdfFontTextureAsset;
/**
 * A MSDF font texture asset, from a pregenerated msdf texture atlas (from msdf-bmfont-xml, for example).
 * This asset uses a signed distance field atlas to render characters as sprites at high res.
 */
declare class MsdfFontTextureAsset extends FontTextureAsset {
    _positionOffsets: {};
    _xAdvances: {};
    _kernings: {};
    /** @inheritdoc */
    getPositionOffset(character: any): any;
    /** @inheritdoc */
    getXAdvance(character: any): any;
}
import FontTextureAsset = require("./font_texture_asset");
//# sourceMappingURL=msdf_font_texture_asset.d.ts.map