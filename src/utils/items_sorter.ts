import { Rectangle, Vector2 } from "./shapes";

/**
 * Utility class to arrange rectangles in minimal region.
 */
export class ItemsSorter {
	/**
	 * Efficiently arrange rectangles into a minimal size area.
	 * Based on code from here:
	 * https://github.com/mapbox/potpack
	 * @example
	 * // "id" will be used to identify the items after the sort.
	 * let boxes = [{x: 100, y: 50, id: 1}, {x: 50, y: 70, id: 2}, {x: 125, y: 85, id: 3}, ... more boxes here ];
	 * let result = RectanglesSorter.arrangeRectangles(boxes);
	 * // show result
	 * console.log(`Output region size is: ${result.width},${result.height}, and it utilizes ${result.utilized} of the area.`);
	 * for (let res of result.rectangles) {
	 *   console.log(`Rectangle ${res.source.id} is at position: ${res.x},${res.y}.`);
	 * }
	 * @param {Array<Rectangle|Vector2|*>} rectangles Array of vectors or rectangles to sort.
	 * If the object have "width" and "height" properties, these properties will be used to define the rectangle size.
	 * If not but the object have "x" and "y" properties, x and y will be taken instead.
	 * The source object will be included in the result objects.
	 * @param processRegionWidthMethod If provided, will run this method when trying to decide on the result region width.
	 * Method receive desired width as argument, and return a new width to override the decision. You can use this method to limit max width or round it to multiplies of 2 for textures.
	 * Note: by default, the algorithm will try to create a square region.
	 * @param extraMargins Optional extra empty pixels to add between textures in atlas.
	 * @returns Result object with the following keys: {width, height, rectangles, utilized}.
	 *  width = required container width.
	 *  height = required container width.
	 *  rectangles = list of sorted rectangles. every entry has {x, y, width, height, source} where x and y are the offset in container and source is the source input object.
	 *  utilized = how much of the output space was utilized.
	 */
	public static arrangeRectangles<R extends Rectangle | Vector2>(rectangles: R, processRegionWidthMethod?: (...args: unknown[]) => unknown, extraMargins?: Vector2): { x: number, y: number, width: number, height: number, rectangles: R[], utilized: number; } {
		// default margins
		extraMargins = extraMargins || Vector2.zeroReadonly;

		// normalize rectangles / vectors
		let normalizedRects = [];
		for(let rect of rectangles) {
			normalizedRects.push({
				width: ((rect.width !== undefined) ? rect.width : rect.x) + extraMargins.x,
				height: ((rect.height !== undefined) ? rect.height : rect.y) + extraMargins.y,
				source: rect
			});
		}
		rectangles = normalizedRects;

		// calculate result area and maximum rectangle width
		let area = 0;
		let maxRectWidth = 0;
		for(const rect of rectangles) {
			area += rect.width * rect.height;
			maxRectWidth = Math.max(maxRectWidth, rect.width);
		}

		// sort textures by height descending
		rectangles.sort((a, b) => b.height - a.height);

		// aim for a squarish resulting container
		let startWidth = Math.max(Math.ceil(Math.sqrt(area / 0.95)), maxRectWidth);

		// if we got a method to process width, apply it
		if(processRegionWidthMethod) {
			startWidth = processRegionWidthMethod(startWidth);
		}

		// start with a single empty space, unbounded at the bottom
		const spaces = [{ x: 0, y: 0, w: startWidth, h: Infinity }];

		// arrange texture rects
		let width = 0;
		let height = 0;
		for(const rect of rectangles) {
			// look through spaces backwards so that we check smaller spaces first
			for(let i = spaces.length - 1; i >= 0; i--) {

				// get current space
				const space = spaces[i];

				// look for empty spaces that can accommodate the current box
				if(rect.width > space.w || rect.height > space.h) continue;

				// found the space; add the box to its top-left corner
				// |-------|-------|
				// |  box  |       |
				// |_______|       |
				// |         space |
				// |_______________|
				rect.x = space.x;
				rect.y = space.y;

				height = Math.max(height, rect.y + rect.height);
				width = Math.max(width, rect.x + rect.width);

				if(rect.width === space.w && rect.height === space.h) {
					// space matches the box exactly; remove it
					const last = spaces.pop();
					if(i < spaces.length) spaces[i] = last;

				} else if(rect.height === space.h) {
					// space matches the box height; update it accordingly
					// |-------|---------------|
					// |  box  | updated space |
					// |_______|_______________|
					space.x += rect.width;
					space.w -= rect.width;

				} else if(rect.width === space.w) {
					// space matches the box width; update it accordingly
					// |---------------|
					// |      box      |
					// |_______________|
					// | updated space |
					// |_______________|
					space.y += rect.height;
					space.h -= rect.height;

				} else {
					// otherwise the box splits the space into two spaces
					// |-------|-----------|
					// |  box  | new space |
					// |_______|___________|
					// | updated space     |
					// |___________________|
					spaces.push({
						x: space.x + rect.width,
						y: space.y,
						w: space.w - rect.width,
						h: rect.height
					});
					space.y += rect.height;
					space.h -= rect.height;
				}
				break;
			}
		}

		// return result
		return {
			width: width,                               // container width.
			height: height,                             // container height.
			rectangles: rectangles,                     // rectangles and where to place them.
			utilized: (area / (width * height)) || 0    // space utilization.
		};
	}
}
