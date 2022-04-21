/**
 * Provide a pathfinding algorithm.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\path_finder.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
*/
'use strict';
const Vector2 = require("./vector2");


/**
 * Interface for a supported grid.
 */
class IGrid
{
    /**
     * Check if a given tile is blocked from a given neihbor.
     * @param {Vector2|Vector3} _from Source tile index.
     * @param {Vector2|Vector3} _to Target tile index. Must be a neighbor of _from.
     * @returns {Boolean} Can we travel from _from to _to?
     */
    isBlocked(_from, _to) { throw new Error("Not Implemented"); }

    /**
     * Get the price to travel on a given tile.
     * Should return 1 for "normal" traveling price, > 1 for expensive tile, and < 1 for a cheap tile to pass on.
     * @param {Vector2|Vector3} _index Tile index.
     * @returns {Number} Price factor to walk on.
     */
    getPrice(_index) { throw new Error("Not Implemented"); }
}


/**
 * A path node.
 */
class Node
{
    constructor(position)
    {
        this.position = position;
        this.gCost = 0;
        this.hCost = 0;
        this.parent = null;
        this.price = 1;
    }

    get fCost()
    {
        return this.gCost + this.hCost;
    }
}


/**
 * Find a path between start to target.
 * @param {IGrid} grid Grid provider to check if tiles are blocked.
 * @param {Vector2|Vector3} startPos Starting tile index.
 * @param {Vector2|Vector3} targetPos Target tile index.
 * @param {*} options Additional options: { maxIterations, ignorePrices }
 * @returns {Array<Vector2>} List of tiles to traverse.
 */
function findPath(grid, startPos, targetPos, options)
{
    let ret = _ImpFindPath(grid, startPos, targetPos, options || {});
    return ret;
}


/**
 * Internal function that implements the path-finding algorithm.
 * @private
 */
function _ImpFindPath(grid, startPos, targetPos, options)
{
    // get / create node
    let nodesCache = {};
    function getOrCreateNode(position) {

        // get from cache
        let key = (position.x + ',' + position.y);
        if (nodesCache[key]) {
            return nodesCache[key];
        }

        // create new
        let ret = new Node(position);
        nodesCache[key] = ret;
        return ret;
    }
    
    // create start and target node
    let startNode = getOrCreateNode(startPos);
    let targetNode = getOrCreateNode(targetPos);

    // tiles we may still travel to
    let openSet = [];
    openSet.push(startNode);

    // tiles we were blocked at
    let closedSet = new Set();

    // remove from array by value
    function removeFromArray(arr, val) {
        let index = arr.indexOf(val);
        if (index !== -1) {
            arr.splice(index, 1);
        }
    }

    // while we got open way to go...
    let iterationsCount = -1;
    while (openSet.length > 0)
    {
        // check iterations count
        if (options.maxIterations) {
            if (iterationsCount++ > options.maxIterations) {
                break;
            }
        }

        // find optimal node to start from
        let currentNode = openSet[0];
        for (let i = 1; i < openSet.length; i++)
        {
            if ((openSet[i].fCost <= currentNode.fCost) && (openSet[i].hCost < currentNode.hCost))
            {
                currentNode = openSet[i];
            }
        }

        // add current node to close set
        removeFromArray(openSet, currentNode);
        closedSet.add(currentNode);

        // did we reach target? :D
        if (currentNode == targetNode)
        {
            let finalPath = retracePath(startNode, targetNode);
            return finalPath;
        }

        // get neighbor tiles
        let neighbors = [];
        for (let nx = -1; nx <= 1; nx++)
        {
            for (let ny = -1; ny <= 1; ny++)
            {
                if (nx === 0 && ny === 0) { continue; }
                neighbors.push(getOrCreateNode({x: currentNode.position.x + nx, y: currentNode.position.y + ny, z: currentNode.position.z}));
            }
        }

        // iterate neighbors
        for (let neighbor of neighbors)
        {
            // skip if already passed or can't walk there
            if (closedSet.has(neighbor) || grid.isBlocked(currentNode.position, neighbor.position)) {
                continue;
            }

            // calc const and price to walk there
            let price = (options.ignorePrices) ? 1 : grid.getPrice(neighbor.position);
            let currStepCost = currentNode.gCost + getDistance(currentNode, neighbor) * price;

            // update node price and add to open set
            let isInOpenSet = (openSet.indexOf(neighbor) !== -1);
            if (!isInOpenSet || (currStepCost < neighbor.gCost))
            {
                // update node price and parent
                neighbor.gCost = currStepCost;
                neighbor.hCost = getDistance(neighbor, targetNode);
                neighbor.parent = currentNode;

                // add to open set
                if (!isInOpenSet) {
                    openSet.push(neighbor);
                }
            }
        }
    }

    // didn't find path
    return null;
}

/**
 * Convert nodes structure with parents into a list of tile indices.
 * Go from end to start (for shortest path) and build list reversed.
 * @private
 */
function retracePath(startNode, endNode)
{
    let path = [];
    let currentNode = endNode;

    while (currentNode !== startNode)
    {
        path.unshift(currentNode.position);
        currentNode = currentNode.parent;
    }

    return path;
}

/**
 * Get distance between two points on grid.
 * This method is quick and dirty and takes diagonal into consideration.
 */
function getDistance(pa, pb)
{
    let dx = (pa.position.x - pb.position.x);
    let dy = (pa.position.y - pb.position.y);
    return Math.sqrt(dx*dx + dy*dy);
}


// export main method and grid interface.
const PathFinder = {
    findPath: findPath,
    IGrid: IGrid
};
module.exports = PathFinder;