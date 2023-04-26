export = SpritesEffectNoVertexColor;
/**
 * Default basic effect to draw 2d sprites without vertex color.
 */
declare class SpritesEffectNoVertexColor extends Effect {
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
//# sourceMappingURL=sprites_no_vertex_color.d.ts.map