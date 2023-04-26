export = LinesShape;
/**
 * Collision lines class.
 * This shape is made of one line or more.
 */
declare class LinesShape extends CollisionShape {
    /**
     * Create the collision shape.
     * @param {Array<Line>|Line} lines Starting line / lines.
     */
    constructor(lines: Array<Line> | Line);
    _lines: any[];
    /**
     * Add line or lines to this collision shape.
     * @param {Array<Line>|Line} lines Line / lines to add.
     */
    addLines(lines: Array<Line> | Line): void;
    _boundingBox: Rectangle;
    _circle: Circle;
    /**
     * Set this shape from line or lines array.
     * @param {Array<Line>|Line} lines Line / lines to set.
     */
    setLines(lines: Array<Line> | Line): void;
    /**
     * @inheritdoc
     */
    debugDraw(opacity: any, shapesBatch: any): void;
}
import CollisionShape = require("./shape");
import Line = require("../../utils/line");
import Rectangle = require("../../utils/rectangle");
import Circle = require("../../utils/circle");
//# sourceMappingURL=lines.d.ts.map