export = MsdfFontEffect;
/**
 * Default effect to draw MSDF font textures.
 */
declare class MsdfFontEffect extends Effect {
    /** @inheritdoc */
    get uniformTypes(): {
        u_texture: {
            type: string;
            bind: string;
        };
        u_projection: {
            type: string;
            bind: string;
        };
        u_world: {
            type: string;
            bind: string;
        };
    };
    /** @inheritdoc */
    get attributeTypes(): {
        a_position: {
            size: number;
            type: string;
            normalize: boolean;
            bind: string;
        };
        a_coord: {
            size: number;
            type: string;
            normalize: boolean;
            bind: string;
        };
        a_color: {
            size: number;
            type: string;
            normalize: boolean;
            bind: string;
        };
    };
}
import Effect = require("./effect");
//# sourceMappingURL=msdf_font.d.ts.map