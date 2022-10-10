export = BasicEffect;
/**
 * Default basic effect to draw 2d sprites.
 */
declare class BasicEffect extends Effect {
    /** @inheritdoc */
    get uniformTypes(): {
        texture: {
            type: string;
            bind: string;
        };
        projection: {
            type: string;
            bind: string;
        };
        world: {
            type: string;
            bind: string;
        };
    };
    /** @inheritdoc */
    get attributeTypes(): {
        position: {
            size: number;
            type: string;
            normalize: boolean;
            bind: string;
        };
        coord: {
            size: number;
            type: string;
            normalize: boolean;
            bind: string;
        };
        color: {
            size: number;
            type: string;
            normalize: boolean;
            bind: string;
        };
    };
}
import Effect = require("./effect");
//# sourceMappingURL=basic.d.ts.map