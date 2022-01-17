/**
 * Implement the collision manager.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\collision_world.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Color = require("../utils/color");
const Vector2 = require("../utils/vector2");
const resolver = require('./resolver');
const CollisionTestResult = require("./result");
const CollisionShape = require("./shapes/shape");
const gfx = require('./../gfx');
const Rectangle = require("../utils/rectangle");
const _logger = require('../logger.js').getLogger('collision');


/**
 * A collision world is a set of collision shapes that interact with each other.
 * You can use different collision worlds to represent different levels or different parts of your game world.
 */
class CollisionWorld
{
    /**
     * Create the collision world.
     * @param {Number|Vector2} gridCellSize For optimize collision testing, the collision world is divided into a collision grid. This param determine the grid cell size.
     */
    constructor(gridCellSize)
    {
        // set grid cell size
        if (typeof gridCellSize === 'undefined') { gridCellSize = new Vector2(512, 512); }
        else if (typeof gridCellSize === 'number') { gridCellSize = new Vector2(gridCellSize, gridCellSize); }
        else { gridCellSize = gridCellSize.clone(); }
        this._gridCellSize = gridCellSize;

        // create collision grid
        this._grid = {};

        // shapes that need updates and grid chunks to delete
        this._shapesToUpdate = new Set();
        this._cellsToDelete = new Set();
    }

    /**
     * Do collision world updates, if we have any.
     * @private
     */
    _performUpdates()
    {
        // delete empty grid cells
        if (this._cellsToDelete.size > 0) {
            for (let key of this._cellsToDelete) {
                if (this._grid[key] && this._grid[key].size === 0) { 
                    delete this._grid[key];
                }
            }
            this._cellsToDelete.clear();
        }

        // update all shapes
        if (this._shapesToUpdate.size > 0) {
            for (let shape of this._shapesToUpdate) {
                this._updateShape(shape);
            }
            this._shapesToUpdate.clear();
        }
    }

    /**
     * Update a shape in collision world after it moved or changed.
     * @private
     */
    _updateShape(shape)
    {

    }

    /**
     * Request update for this shape on next updates call.
     * @private
     */
    _queueUpdate(shape)
    {
        this._shapesToUpdate.add(shape);
    }

    /**
     * Add a collision shape to this world.
     * @param {CollisionShape} shape Shape to add.
     */
    addShape(shape)
    {
        // add shape
        shape._setParent(this);

        // get shape bounding box and add to grid
        let bb = shape.getBoundingBox();
        let minx = Math.floor(bb.left / this._gridCellSize.x);
        let miny = Math.floor(bb.top / this._gridCellSize.y);
        let maxx = Math.ceil(bb.right / this._gridCellSize.x);
        let maxy = Math.ceil(bb.bottom / this._gridCellSize.y);
        for (let i = minx; i <= maxx; ++i) {
            for (let j = miny; j <= maxy; ++j) {

                let key = i + ',' + j;
                let currSet = this._grid[key];
                if (!currSet) { 
                    this._grid[key] = currSet = new Set(); 
                }
                currSet.add(shape);
            }
        }
        shape._worldRange = [minx, miny, maxx, maxy];

        // do general updates
        this._performUpdates();
    }

    /**
     * Remove a collision shape from this world.
     * @param {CollisionShape} shape Shape to remove.
     */
    removeShape(shape)
    {
        // sanity
        if (shape._world !== this) {
            _logger.warn("Shape to remove is not in this collision world!");
            return;
        }

        // remove from grid
        if (shape._worldRange) {
            let minx = shape._worldRange[0];
            let miny = shape._worldRange[1];
            let maxx = shape._worldRange[2];
            let maxy = shape._worldRange[3];
            for (let i = minx; i <= maxx; ++i) {
                for (let j = miny; j <= maxy; ++j) {
                    let key = i + ',' + j;
                    let currSet = this._grid[key];
                    if (currSet) {
                        currSet.delete(shape);
                        if (currSet.size === 0) {
                            this._cellsToDelete.add(key);
                        }
                    }
                }
            }
        }

        // remove shape
        this._updateShape.delete(shape);
        shape._setParent(null);

        // do general updates
        this._performUpdates();
    }

    /**
     * Test collision with shapes in world, and return just the first result found.
     * @param {CollisionShape} sourceShape Source shape to check collision for. If shape is in world, it will not collide with itself.
     * @param {Boolean} sortByDistance If true will return the nearest collision found (based on center of shapes).
     * @param {Function} predicate Optional filter to run on any shape we're about to test collision with. If the predicate returns false, we will skip this shape.
     * @returns {CollisionTestResult} A collision test result, or null if not found.
     */
    testCollision(sourceShape, sortByDistance, predicate)
    {
        // do updates before check
        this._performUpdates();
    }

    /**
     * Test collision with shapes in world, and return all results found.
     * @param {CollisionShape} sourceShape Source shape to check collision for. If shape is in world, it will not collide with itself.
     * @param {Boolean} sortByDistance If true will sort results by distance.
     * @param {Function} predicate Optional filter to run on any shape we're about to test collision with. If the predicate returns false, we will skip this shape.
     * @returns {Array<CollisionTestResult>} An array of collision test results, or empty array if none found.
     */
    testCollisionMany(sourceShape, sortByDistance, predicate)
    {
        // do updates before check
        this._performUpdates();
    }

    /**
     * Debug-draw the current collision world.
     * @param {Color} gridColor Optional grid color (default to black).
     * @param {Color} gridHighlitColor Optional grid color for cells with shapes in them (default to red).
     * @param {Number} opacity Optional opacity factor (default to 0.5).
     */
    debugDraw(gridColor, gridHighlitColor, opacity)
    {
        // default grid colors
        if (!gridColor) {
            gridColor = Color.black;
            gridColor.a *= 0.75;
        }
        if (!gridHighlitColor) {
            gridHighlitColor = Color.red;
            gridHighlitColor.a *= 0.75;
        }

        // default opacity
        if (opacity === undefined) { 
            opacity = 0.5;
        }

        // set grid color opacity
        gridColor.a *= opacity;
        gridHighlitColor.a *= opacity;

        // get visible grid cells
        let bb = gfx.renderingRegion;
        let minx = Math.floor(bb.left / this._gridCellSize.x);
        let miny = Math.floor(bb.top / this._gridCellSize.y);
        let maxx = Math.ceil(bb.right / this._gridCellSize.x);
        let maxy = Math.ceil(bb.bottom / this._gridCellSize.y);
        for (let i = minx; i <= maxx; ++i) {
            for (let j = miny; j <= maxy; ++j) {

                // get current cell
                let cell = this._grid[i + ',' + j];

                // draw grid cell
                let color = (cell && cell.size) ? gridHighlitColor : gridColor;
                let cellRect = new Rectangle(i * this._gridCellSize.x, j * this._gridCellSize.y, this._gridCellSize.x-1, this._gridCellSize.y-1);
                gfx.outlineRect(cellRect, color, gfx.BlendModes.AlphaBlend, 0);

                // draw shapes in grid
                if (cell) {
                    for (let shape of cell)
                    {
                        shape.debugDraw(opacity);
                    }
                }
            }
        }
    }
}

// export collision world
module.exports = CollisionWorld;