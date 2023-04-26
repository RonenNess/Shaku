export = ShapesEffect;
/**
 * Default basic effect to draw 2d shapes.
 */
declare class ShapesEffect extends Effect {
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
//# sourceMappingURL=shapes.d.ts.map