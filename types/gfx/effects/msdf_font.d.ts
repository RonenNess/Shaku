export = MsdfFontEffect;
/**
 * Default effect to draw MSDF font textures.
 */
declare class MsdfFontEffect extends Effect {
    /** @inheritdoc */
    get uniformTypes(): {
        [x: string]: {
            type: string;
            bind: string;
        };
    };
    /** @inheritdoc */
    get attributeTypes(): {
        [x: string]: {
            size: number;
            type: string;
            normalize: boolean;
            bind: string;
        };
    };
}
import Effect = require("./effect");
//# sourceMappingURL=msdf_font.d.ts.map