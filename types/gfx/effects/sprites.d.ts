export = SpritesEffect;
/**
 * Default basic effect to draw 2d sprites.
 */
declare class SpritesEffect extends Effect {
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
//# sourceMappingURL=sprites.d.ts.map