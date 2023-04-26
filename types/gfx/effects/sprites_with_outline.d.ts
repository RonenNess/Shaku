export = SpritesWithOutlineEffect;
/**
 * Default basic effect to draw 2d sprites with outline.
 */
declare class SpritesWithOutlineEffect extends Effect {
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
//# sourceMappingURL=sprites_with_outline.d.ts.map