/**
 * Find a path between start to target.
 * @param {IGrid} grid Grid provider to check if tiles are blocked.
 * @param {Vector2|Vector3} startPos Starting tile index.
 * @param {Vector2|Vector3} targetPos Target tile index.
 * @param {*} options Additional options: { maxIterations, ignorePrices, allowDiagonal }
 * @returns {Array<Vector2>} List of tiles to traverse.
 */
export function findPath(grid: IGrid, startPos: Vector2 | Vector3, targetPos: Vector2 | Vector3, options: any): Array<Vector2>;
/**
 * Interface for a supported grid.
 */
export class IGrid {
    /**
     * Check if a given tile is blocked from a given neihbor.
     * @param {Vector2|Vector3} _from Source tile index.
     * @param {Vector2|Vector3} _to Target tile index. Must be a neighbor of _from.
     * @returns {Boolean} Can we travel from _from to _to?
     */
    isBlocked(_from: Vector2 | Vector3, _to: Vector2 | Vector3): boolean;
    /**
     * Get the price to travel on a given tile.
     * Should return 1 for "normal" traveling price, > 1 for expensive tile, and < 1 for a cheap tile to pass on.
     * @param {Vector2|Vector3} _index Tile index.
     * @returns {Number} Price factor to walk on.
     */
    getPrice(_index: Vector2 | Vector3): number;
}
import Vector2 = require("./vector2");
//# sourceMappingURL=path_finder.d.ts.map