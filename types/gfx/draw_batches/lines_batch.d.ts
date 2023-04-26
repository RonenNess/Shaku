export = LinesBatch;
/**
 * Colored lines renderer.
 * Responsible to drawing a batch of line segments or strips.
 */
declare class LinesBatch extends DrawBatch {
    /**
     * Create the sprites batch.
     * @param {Number=} lineSegmentsCount Internal buffers size, in line segments count (line segment = 3 vertices). Bigger value = faster rendering but more RAM.
     */
    constructor(lineSegmentsCount?: number | undefined);
    /**
     * How many line segments this batch can hold.
     * @private
     */
    private __maxLinesCount;
    /**
     * How many line segments we currently have.
     * @private
     */
    private __linesCount;
    /**
     * Indicate there were changes in buffers.
     * @private
     */
    private __dirty;
    /**
     * Optional method to trigger when shapes batch overflows and can't contain any more polygons.
     * @type {Function}
     * @name ShapesBatch#onOverflow
     */
    onOverflow: Function;
    /**
     * If true, will floor vertices positions before pushing them to batch.
     * @type {Boolean}
     * @name ShapesBatch#snapPixels
     */
    snapPixels: boolean;
    /**
     * If true, will draw lines as a single lines strip.
     * @type {Boolean}
     * @name ShapesBatch#linesStrip
     */
    linesStrip: boolean;
    _buffers: {
        positionBuffer: any;
        positionArray: Float32Array;
        colorsBuffer: any;
        colorsArray: Float32Array;
        indexBuffer: any;
    };
    __indicesType: any;
    /**
     * Push vertices to drawing batch.
     * @param {Array<Vertex>} vertices Vertices to push. Vertices count must be dividable by 3 to keep the batch consistent of polygons.
     */
    drawVertices(vertices: Array<Vertex>): void;
    /**
     * Add a rectangle to draw.
     * @param {Vector2|Vector3} position Drawing position (at origin). If vector3 is provided, will pass z value to the shader code position attribute.
     * @param {Vector2|Vector3|Number} size Drawing size. If vector3 is provided, will pass z value to the shader code position attribute for the bottom vertices, as position.z + size.z.
     * @param {Color|Array<Color>|undefined=} color Rectangle color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
     * @param {Number=} rotation Rotate rectangle.
     * @param {Vector2=} origin Drawing origin. This will be the point at 'position' and rotation origin.
     * @param {Vector2=} skew Skew the drawing corners on X and Y axis, around the origin point.
     */
    drawQuad(position: Vector2 | Vector3, size: Vector2 | Vector3 | number, color?: (Color | Array<Color> | undefined) | undefined, rotation?: number | undefined, origin?: Vector2 | undefined, skew?: Vector2 | undefined): void;
    /**
     * Add a rectangle that covers a given destination rectangle.
     * @param {Rectangle|Vector2} destRect Destination rectangle to draw on. If vector is provided, will draw from 0,0 with vector as size.
     * @param {Rectangle=} sourceRect Source rectangle, or undefined to use the entire texture.
     * @param {Color|Array<Color>|undefined=} color Rectangle color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
     * @param {Number=} rotation Rotate rectangle.
     * @param {Vector2=} origin Drawing origin. This will be the point at 'position' and rotation origin.
     */
    drawRectangle(destRect: typeof import("../../utils/rectangle") | Vector2, sourceRect?: typeof import("../../utils/rectangle") | undefined, color?: (Color | Array<Color> | undefined) | undefined, rotation?: number | undefined, origin?: Vector2 | undefined): void;
    /**
     * Draw a colored circle.
     * @param {Circle} circle Circle to draw.
     * @param {Color} color Circle fill color.
     * @param {Number=} segmentsCount How many segments to build the circle from (more segments = smoother circle).
     * @param {Number|Vector2=} ratio If procided, will scale the circle on X and Y axis to turn it into an oval. If a number is provided, will use this number to scale Y axis.
     * @param {Number=} rotation If provided will rotate the oval / circle.
     */
    drawCircle(circle: Circle, color: Color, segmentsCount?: number | undefined, ratio?: (number | Vector2) | undefined, rotation?: number | undefined): void;
    /**
     * Get how many line segments are currently in batch.
     * @returns {Number} Line segments in batch count.
     */
    get linesInBatch(): number;
    /**
     * Get how many line segments this batch can contain.
     * @returns {Number} Max line segments count.
     */
    get maxLinesCount(): number;
    /**
     * Check if this batch is full.
     * @returns {Boolean} True if batch is full.
     */
    get isFull(): boolean;
    /**
     * Called when the batch becomes full while drawing and there's no handler.
     * @private
     */
    private _handleFullBuffer;
    #private;
}
import DrawBatch = require("./draw_batch");
import Vertex = require("../vertex");
import Vector2 = require("../../utils/vector2");
import Vector3 = require("../../utils/vector3");
//# sourceMappingURL=lines_batch.d.ts.map