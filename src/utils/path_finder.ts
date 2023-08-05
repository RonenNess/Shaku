import Vector2 from "./vector2";
import Vector3 from "./vector3";

/**
 * Interface for a supported grid.
 */
interface IGrid {
	/**
	 * Check if a given tile is blocked from a given neihbor.
	 * @param _from Source tile index.
	 * @param _to Target tile index. Must be a neighbor of _from.
	 * @returns Can we travel from _from to _to?
	 */
	isBlocked(_from: Vector2, _to: Vector2): boolean;
	isBlocked(_from: Vector3, _to: Vector3): boolean;
	isBlocked(_from: Vector2 | Vector3, _to: Vector2 | Vector3): boolean;

	/**
	 * Get the price to travel on a given tile.
	 * Should return 1 for "normal" traveling price, > 1 for expensive tile, and < 1 for a cheap tile to pass on.
	 * @param _index Tile index.
	 * @returns Price factor to walk on.
	 */
	getPrice(_index: Vector2): number;
	getPrice(_index: Vector3): number;
	getPrice(_index: Vector2 | Vector3): number;
}

/**
 * A path node.
 */
class Node {
	public position: Vector2 | Vector3;
	public gCost: number;
	public hCost: number;
	public parent: Node | null;
	public price: number;

	/**
	 * Create the node from a position.
	 * @param position Node position.
	 */
	public constructor(position: Vector2 | Vector3) {
		this.position = position;
		this.gCost = 0;
		this.hCost = 0;
		this.parent = null;
		this.price = 1;
	}

	/**
	 * Get the node fCost factor.
	 */
	public get fCost() {
		return this.gCost + this.hCost;
	}
}

/**
 * Find a path between start to target.
 * @param grid Grid provider to check if tiles are blocked.
 * @param startPos Starting tile index.
 * @param targetPos Target tile index.
 * @param options Additional options: { maxIterations, ignorePrices, allowDiagonal }
 * @returns List of tiles to traverse.
 */
function findPath<P extends Vector2 | Vector3>(grid: IGrid, startPos: P, targetPos: P, options: { maxIterations?: number, ignorePrices?: boolean, allowDiagonal?: boolean; } = {}): P[] {
	let ret = _ImpFindPath(grid, startPos, targetPos, options);
	return ret;
}

/**
 * Internal function that implements the path-finding algorithm.
 * @private
 */
function _ImpFindPath<P extends Vector2 | Vector3>(grid: IGrid, startPos: P, targetPos: P, options: { maxIterations?: number, ignorePrices?: boolean, allowDiagonal?: boolean; }): P[] {
	// do we allow diagonal tiles?
	const allowDiagonal = options.allowDiagonal;

	// get / create node
	let nodesCache = {};
	function getOrCreateNode(position) {

		// get from cache
		let key = (position.x + "," + position.y);
		if(nodesCache[key]) {
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
		if(index !== -1) {
			arr.splice(index, 1);
		}
	}

	// while we got open way to go...
	let iterationsCount = -1;
	while(openSet.length > 0) {
		// check iterations count
		if(options.maxIterations) {
			if(iterationsCount++ > options.maxIterations) {
				break;
			}
		}

		// find optimal node to start from
		let currentNode = openSet[0];
		for(let i = 1; i < openSet.length; i++) {
			if((openSet[i].fCost <= currentNode.fCost) && (openSet[i].hCost < currentNode.hCost)) {
				currentNode = openSet[i];
			}
		}

		// add current node to close set
		removeFromArray(openSet, currentNode);
		closedSet.add(currentNode);

		// did we reach target? :D
		if(currentNode == targetNode) {
			let finalPath = retracePath(startNode, targetNode);
			return finalPath;
		}

		// get neighbor tiles
		let neighbors = [];
		for(let nx = -1; nx <= 1; nx++) {
			for(let ny = -1; ny <= 1; ny++) {
				if(nx === 0 && ny === 0) { continue; }
				if(!allowDiagonal && (nx !== 0 && ny !== 0)) { continue; }
				neighbors.push(getOrCreateNode({ x: currentNode.position.x + nx, y: currentNode.position.y + ny, z: currentNode.position.z }));
			}
		}

		// iterate neighbors
		for(let neighbor of neighbors) {
			// skip if already passed or can't walk there
			if(closedSet.has(neighbor) || grid.isBlocked(currentNode.position, neighbor.position)) {
				continue;
			}

			// calc const and price to walk there
			let price = (options.ignorePrices) ? 1 : grid.getPrice(neighbor.position);
			let currStepCost = currentNode.gCost + getDistance(currentNode, neighbor) * price;

			// update node price and add to open set
			let isInOpenSet = (openSet.indexOf(neighbor) !== -1);
			if(!isInOpenSet || (currStepCost < neighbor.gCost)) {
				// update node price and parent
				neighbor.gCost = currStepCost;
				neighbor.hCost = getDistance(neighbor, targetNode);
				neighbor.parent = currentNode;

				// add to open set
				if(!isInOpenSet) {
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
function retracePath(startNode: Node, endNode: Node) {
	let path = [];
	let currentNode = endNode;

	while(currentNode !== startNode) {
		path.unshift(currentNode.position);
		currentNode = currentNode.parent;
	}

	return path;
}

/**
 * Get distance between two points on grid.
 * This method is quick and dirty and takes diagonal into consideration.
 */
function getDistance(pa, pb) {
	let dx = (pa.position.x - pb.position.x);
	let dy = (pa.position.y - pb.position.y);
	return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Path finder utilitiy.
 * To use it:
 *  1. Implement a `IGrid` instance that returns if a grid node is blocking and what's the price to cross it.
 *  2. Call findPath() with your grid to find a path between start and end points.
 */
const PathFinder = {
	findPath: findPath, // TODO: had to remove IGrid since it has been turned into an interface
};

// export the path finder object
export default PathFinder;
