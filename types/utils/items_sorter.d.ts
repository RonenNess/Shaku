export = ItemsSorter;
/**
 * Utility class to arrange rectangles in minimal region.
 */
declare class ItemsSorter {
    /**
     * Efficiently arrange rectangles into a minimal size area.
     * Based on code from here:
     * https://github.com/mapbox/potpack
     * @example
     * // 'id' will be used to identify the items after the sort.
     * let boxes = [{x: 100, y: 50, id: 1}, {x: 50, y: 70, id: 2}, {x: 125, y: 85, id: 3}, ... more boxes here ];
     * let result = RectanglesSorter.arrangeRectangles(boxes);
     * // show result
     * console.log(`Output region size is: ${result.width},${result.height}, and it utilizes ${result.utilized} of the area.`);
     * for (let res of result.rectangles) {
     *   console.log(`Rectangle ${res.source.id} is at position: ${res.x},${res.y}.`);
     * }
     * @param {Array<Rectangle|Vector2|*>} rectangles Array of vectors or rectangles to sort.
     * If the object have 'width' and 'height' properties, these properties will be used to define the rectangle size.
     * If not but the object have 'x' and 'y' properties, x and y will be taken instead.
     * The source object will be included in the result objects.
     * @param {Function=} processRegionWidthMethod If provided, will run this method when trying to decide on the result region width.
     * Method receive desired width as argument, and return a new width to override the decision. You can use this method to limit max width or round it to multiplies of 2 for textures.
     * Note: by default, the algorithm will try to create a square region.
     * @param {Vector2=} extraMargins Optional extra empty pixels to add between textures in atlas.
     * @returns {*} Result object with the following keys: {width, height, rectangles, utilized}.
     *  width = required container width.
     *  height = required container width.
     *  rectangles = list of sorted rectangles. every entry has {x, y, width, height, source} where x and y are the offset in container and source is the source input object.
     *  utilized = how much of the output space was utilized.
     */
    static arrangeRectangles(rectangles: Array<Rectangle | Vector2 | any>, processRegionWidthMethod?: Function | undefined, extraMargins?: Vector2 | undefined): any;
}
import Rectangle = require("./rectangle");
import Vector2 = require("./vector2");
//# sourceMappingURL=items_sorter.d.ts.map