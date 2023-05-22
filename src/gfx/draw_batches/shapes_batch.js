/**
 * Implement the gfx shapes batch renderer.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\gfx\draw_batches\shapes_batch.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const { Rectangle } = require('../../utils');
const Vector2 = require('../../utils/vector2');
const Vector3 = require('../../utils/vector3');
const Matrix = require('../../utils/matrix.js');
const Vertex = require('../vertex');
const DrawBatch = require('./draw_batch');
const _logger = require('../../logger.js').getLogger('gfx-sprite-batch');


/**
 * Colored shapes renderer. 
 * Responsible to drawing a batch of basic geometric shapes with as little draw calls as possible.
 */
class ShapesBatch extends DrawBatch
{
    /**
     * Create the sprites batch.
     * @param {Number=} batchPolygonsCount Internal buffers size, in polygons count (polygon = 3 vertices). Bigger value = faster rendering but more RAM.
     */
    constructor(batchPolygonsCount)
    {
        // init draw batch
        super();

        // create buffers for drawing shapes
        this.#_createBuffers(batchPolygonsCount || 500);

        /**
         * How many polygons this batch can hold.
         * @private
         */
        this.__maxPolyCount = Math.floor((this._buffers.positionArray.length / 9));

        /**
         * How many polygons we currently have.
         * @private
         */
        this.__polyCount = 0;

        /**
         * Indicate there were changes in buffers.
         * @private
         */
        this.__dirty = false;
        
        /**
         * Optional method to trigger when shapes batch overflows and can't contain any more polygons.
         * @type {Function}
         * @name ShapesBatch#onOverflow
         */
        this.onOverflow = null;
        
        /** 
         * If true, will floor vertices positions before pushing them to batch.
         * @type {Boolean}
         * @name ShapesBatch#snapPixels
         */
        this.snapPixels = false;
    }

    /**
     * Get the gfx manager.
     * @private
     */
    get #_gfx()
    {
        return DrawBatch._gfx;
    }

    /**
     * Get the web gl instance.
     * @private
     */
    get #_gl()
    {
        return DrawBatch._gfx._internal.gl;
    }

    /**
     * Build the dynamic buffers.
     * @private
     */
    #_createBuffers(batchPolygonsCount)
    {
        let gl = this.#_gl;

        // dynamic buffers, used for batch rendering
        this._buffers = {
            
            positionBuffer: gl.createBuffer(),
            positionArray: new Float32Array(3 * 3 * batchPolygonsCount),

            colorsBuffer: gl.createBuffer(),
            colorsArray: new Float32Array(4 * 3 * batchPolygonsCount),

            indexBuffer: gl.createBuffer(),
        }

        // create the indices buffer
        let maxIndex = (batchPolygonsCount * 3);
        let indicesArrayType;
        if (maxIndex <= 256) {
            indicesArrayType = Uint8Array;
            this.__indicesType = gl.UNSIGNED_BYTE;
        }
        if (maxIndex <= 65535) {
            indicesArrayType = Uint16Array;
            this.__indicesType = gl.UNSIGNED_SHORT;
        }
        else {
            indicesArrayType = Uint32Array;
            this.__indicesType = gl.UNSIGNED_INT;
        }
        let indices = new indicesArrayType(batchPolygonsCount * 3); // 3 = number of indices per sprite
        for (let i = 0; i < indices.length; i++) {
            
            indices[i] = i;
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffers.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        // extand buffers functionality
        function extendBuffer(buff) {
            if (buff) { buff._index = 0; }
        }
        extendBuffer(this._buffers.positionArray);
        extendBuffer(this._buffers.colorsArray);
    }

    /**
     * @inheritdoc
     */
    clear()
    {
        super.clear();
        this._buffers.positionArray._index = 0;
        this._buffers.colorsArray._index = 0;
        this.__polyCount = 0;
        this.__dirty = false;
    }

    /**
     * @inheritdoc
     */
    destroy()
    {
        let gl = this.#_gl;
        if (this._buffers) {
            if (this._buffers.positionBuffer) gl.deleteBuffer(this._buffers.positionBuffer);
            if (this._buffers.colorsBuffer) gl.deleteBuffer(this._buffers.colorsBuffer);
        }
        this._buffers = null;
    }

    /**
     * @inheritdoc
     */
    get isDestroyed()
    {
        return Boolean(this._buffers) === false;
    }

    /**
     * @inheritdoc
     */
    get defaultEffect()
    {
        return this.#_gfx.builtinEffects.Shapes;
    }

    /**
     * Draw a line between two points.
     * This method actually uses a rectangle internally, which is less efficient than using a proper LinesBatch, but have the advantage of supporting width.
     * @param {Vector2} fromPoint Starting position.
     * @param {Vector2} toPoint Ending position.
     * @param {Color} color Line color.
     * @param {Number=} width Line width.
     */
    drawLine(fromPoint, toPoint, color, width)
    {
        width = width || 1;
        length = fromPoint.distanceTo(toPoint);
        let rotation = Vector2.radiansBetween(fromPoint, toPoint);
        let position = (width > 1) ? (new Vector2(fromPoint.x, fromPoint.y - width / 2)) : fromPoint;
        let size = new Vector2(length, width);
        this.drawQuad(position, size, color, rotation, new Vector2(0, 0.5));
    }

    /**
     * Push vertices to drawing batch.
     * @param {Array<Vertex>} vertices Vertices to push. Vertices count must be dividable by 3 to keep the batch consistent of polygons.
     */
    drawVertices(vertices)
    {
        // sanity
        this.__validateDrawing(true);

        // sanity check
        if ((vertices.length % 3) !== 0) {
            _logger.warn("Tried to push vertices that are not multiplication of 3!");
            return;
        }

        // push vertices
        let i = 0;
        let colors = this._buffers.colorsArray;
        let positions = this._buffers.positionArray;
        for (let vertex of vertices)
        {
            // push color
            if (this.__currDrawingParams.hasVertexColor) {
                colors[colors._index++] = (vertex.color.r || 0);
                colors[colors._index++] = (vertex.color.g || 0);
                colors[colors._index++] = (vertex.color.b || 0);
                colors[colors._index++] = (vertex.color.a || 0);
            }

            // push position
            positions[positions._index++] = (vertex.position.x || 0);
            positions[positions._index++] = (vertex.position.y || 0);
            positions[positions._index++] = (vertex.position.z || 0);

            // every 3 vertices..
            if (i++ === 2) 
            {
                // update quads count
                this.__polyCount++;

                // check if full
                if (this.__polyCount >= this.__maxPolyCount) {
                    this._handleFullBuffer();
                }

                // reset count
                i = 0;
            }
        }

        // mark as dirty
        this.__dirty = true;
    }

    /**
     * Add a rectangle to draw.
     * @param {Vector2|Vector3} position Drawing position (at origin). If vector3 is provided, will pass z value to the shader code position attribute.
     * @param {Vector2|Vector3|Number} size Drawing size. If vector3 is provided, will pass z value to the shader code position attribute for the bottom vertices, as position.z + size.z.
     * @param {Color|Array<Color>|undefined=} color Rectangle color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
     * @param {Number=} rotation Rotate rectangle.
     * @param {Vector2=} origin Drawing origin. This will be the point at 'position' and rotation origin.
     * @param {Vector2=} skew Skew the drawing corners on X and Y axis, around the origin point.
     */
    drawQuad(position, size, color, rotation, origin, skew)
    {
        let sprite = this.#_gfx.Sprite.build(null, position, size, undefined, color, rotation, origin, skew);
        this.#_addRect(sprite);
    }

    /**
     * Adds a 1x1 point.
     * @param {Vector2|Vector3} position Point position.
     * @param {Color} color Point color.
     */
    addPoint(position, color)
    {
        this.drawVertices([new Vertex(position, null, color), new Vertex(position.add(2,0), null, color), new Vertex(position.add(0,2), null, color)]);
    }

    /**
     * Add a rectangle that covers a given destination rectangle.
     * @param {Rectangle|Vector2} destRect Destination rectangle to draw on. If vector is provided, will draw from 0,0 with vector as size.
     * @param {Color|Array<Color>|undefined=} color Rectangle color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
     * @param {Number=} rotation Rotate rectangle.
     * @param {Vector2=} origin Drawing origin. This will be the point at 'position' and rotation origin.
     */
    drawRectangle(destRect, color, rotation, origin)
    {
        if ((destRect instanceof Vector2) || (destRect instanceof Vector3)) {
            destRect = new Rectangle(0, 0, destRect.x, destRect.y);
        }
        let position = origin ? destRect.getPosition().addSelf(size.mul(origin)) : destRect.getCenter();
        origin = origin || Vector2.halfReadonly;
        let size = destRect.getSize();
        this.drawQuad(position, size, color, rotation, origin);
    }

    /**
     * Draw a colored circle.
     * @param {Circle} circle Circle to draw.
     * @param {Color} color Circle fill color.
     * @param {Number=} segmentsCount How many segments to build the circle from (more segments = smoother circle).
     * @param {Color=} outsideColor If provided, will create a gradient-colored circle and this value will be the outter side color.
     * @param {Number|Vector2=} ratio If procided, will scale the circle on X and Y axis to turn it into an oval. If a number is provided, will use this number to scale Y axis.
     * @param {Number=} rotation If provided will rotate the oval / circle.
     */
    drawCircle(circle, color, segmentsCount, outsideColor, ratio, rotation)
    {
        // sanity
        this.__validateDrawing(true);

        // defaults segments count
        if (segmentsCount === undefined) { 
            segmentsCount = 24; 
        }
        else if (segmentsCount < 2) {
            return;
        }

        // default outside color
        if (!outsideColor) {
            outsideColor = color;
        }

        // default ratio
        if (!ratio) {
            ratio = Vector2.oneReadonly;
        }
        else if (typeof ratio === 'number') {
            ratio = new Vector2(1, ratio);
        }

        // for rotation
        let rotateVec;
        if (rotation) {
            let cos = Math.cos(rotation);
            let sin = Math.sin(rotation);
            rotateVec = function(vector)
            {
                let x = (vector.x * cos - vector.y * sin);
                let y = (vector.x * sin + vector.y * cos);
                vector.x = x;
                vector.y = y;
                return vector;
            }
        }

        // build first position that is not center
        const segmentStep = (2 * Math.PI)  / segmentsCount;
        let prevPoint = new Vector2(
            (circle.radius * Math.cos(0)) * ratio.x, 
            (circle.radius * Math.sin(0)) * ratio.y
        );
        if (rotateVec) { rotateVec(prevPoint); }

        // generate list of vertices to draw the circle
        for (let i = 1; i <= segmentsCount; i++) {
            let newPoint = new Vector2(
                (circle.radius * Math.cos(i * segmentStep)) * ratio.x, 
                (circle.radius * Math.sin(i * segmentStep)) * ratio.y
            );
            if (rotateVec) { rotateVec(newPoint); }
            this.drawVertices([
                new Vertex(circle.center, null, color),
                new Vertex(prevPoint.add(circle.center), null, outsideColor),
                new Vertex(newPoint.add(circle.center), null, outsideColor),
            ]);
            prevPoint = newPoint;
        }
    }

    /**
     * Add a rectangle from sprite data.
     * @private
     */
    #_addRect(sprite, transform)
    {
        // sanity
        this.__validateDrawing(true);

        // mark as dirty
        this.__dirty = true;

        // add rectangle from sprite data
        {
            // calculate vertices positions
            let sizeX = sprite.size.x;
            let sizeY = sprite.size.y;
            let left = -sizeX * sprite.origin.x;
            let top = -sizeY * sprite.origin.y;

            // calculate corners
            topLeft.x = left;               topLeft.y = top;
            topRight.x = left + sizeX;      topRight.y = top;
            bottomLeft.x = left;            bottomLeft.y = top + sizeY;
            bottomRight.x = left + sizeX;   bottomRight.y = top + sizeY;

            // are vertices axis aligned?
            let axisAlined = true;

            // apply skew
            if (sprite.skew) 
            {
                // skew on x axis
                if (sprite.skew.x) {
                    topLeft.x += sprite.skew.x * sprite.origin.y;
                    topRight.x += sprite.skew.x * sprite.origin.y;
                    bottomLeft.x -= sprite.skew.x * (1 - sprite.origin.y);
                    bottomRight.x -= sprite.skew.x * (1 - sprite.origin.y);
                    axisAlined = false;
                }
                // skew on y axis
                if (sprite.skew.y) {
                    topLeft.y += sprite.skew.y * sprite.origin.x;
                    bottomLeft.y += sprite.skew.y * sprite.origin.x;
                    topRight.y -= sprite.skew.y * (1 - sprite.origin.x);
                    bottomRight.y -= sprite.skew.y * (1 - sprite.origin.x);
                    axisAlined = false;
                }
            }

            // apply rotation
            if (sprite.rotation) {
                let cos = Math.cos(sprite.rotation);
                let sin = Math.sin(sprite.rotation);
                function rotateVec(vector)
                {
                    let x = (vector.x * cos - vector.y * sin);
                    let y = (vector.x * sin + vector.y * cos);
                    vector.x = x;
                    vector.y = y;
                }
                rotateVec(topLeft);
                rotateVec(topRight);
                rotateVec(bottomLeft);
                rotateVec(bottomRight);
                axisAlined = false;
            }

            // add sprite position
            topLeft.x += sprite.position.x;
            topLeft.y += sprite.position.y;
            topRight.x += sprite.position.x;
            topRight.y += sprite.position.y;
            bottomLeft.x += sprite.position.x;
            bottomLeft.y += sprite.position.y;
            bottomRight.x += sprite.position.x;
            bottomRight.y += sprite.position.y;

            // apply transform
            if (transform && !transform.isIdentity) {
                topLeft.copy((topLeft.z !== undefined) ?  Matrix.transformVector3(transform, topLeft) : Matrix.transformVector2(transform, topLeft));
                topRight.copy((topRight.z !== undefined) ?  Matrix.transformVector3(transform, topRight) : Matrix.transformVector2(transform, topRight));
                bottomLeft.copy((bottomLeft.z !== undefined) ?  Matrix.transformVector3(transform, bottomLeft) : Matrix.transformVector2(transform, bottomLeft));
                bottomRight.copy((bottomRight.z !== undefined) ?  Matrix.transformVector3(transform, bottomRight) : Matrix.transformVector2(transform, bottomRight));
            }

            // snap pixels
            if (this.snapPixels)
            {
                topLeft.floorSelf();
                topRight.floorSelf();
                bottomLeft.floorSelf();
                bottomRight.floorSelf();
            }

            // add rectangle vertices
            this.drawVertices([
                new Vertex(topLeft, null, sprite.color),
                new Vertex(topRight, null, sprite.color),
                new Vertex(bottomLeft, null, sprite.color),

                new Vertex(topRight, null, sprite.color),
                new Vertex(bottomLeft, null, sprite.color),
                new Vertex(bottomRight, null, sprite.color),
            ]);
        }
    }

    /**
     * Get how many polygons are currently in batch.
     * @returns {Number} Polygons in batch count.
     */
    get polygonsInBatch()
    {
        return this.__polyCount;
    }

    /**
     * Get how many polygons this sprite batch can contain.
     * @returns {Number} Max polygons count.
     */
    get maxPolygonsCount()
    {
        return this.__maxPolyCount;
    }

    /**
     * Check if this batch is full.
     * @returns {Boolean} True if batch is full.
     */
    get isFull()
    {
        return this.__polyCount >= this.__maxPolyCount;
    }

    /**
     * Called when the batch becomes full while drawing and there's no handler.
     * @private
     */
    _handleFullBuffer()
    {
        // invoke on-overflow callback
        if (this.onOverflow) {
            this.onOverflow();
        }
        
        // draw current batch and clear
        this._drawBatch();
        this.clear();
    }

    /**
     * @inheritdoc
     * @private
     */
    _drawBatch()
    {
        // get default effect
        let effect = this.__currDrawingParams.effect;

        // get some members
        let gl = this.#_gl;
        let gfx = this.#_gfx;
        let positionArray = this._buffers.positionArray;
        let colorsArray = this.__currDrawingParams.hasVertexColor ? this._buffers.colorsArray : null;
        let positionBuffer = this._buffers.positionBuffer;
        let colorsBuffer = this._buffers.colorsBuffer;
        let indexBuffer = this._buffers.indexBuffer;

        // should copy buffers
        let needBuffersCopy = this.__dirty;

        // calculate current batch quads count
        let _currPolyCount = this.polygonsInBatch;

        // nothing to draw? skip
        if (_currPolyCount === 0) {
            return;
        }

        // call base method to set effect and draw params
        super._drawBatch();

        // copy position buffer
        effect.setPositionsAttribute(positionBuffer, true);
        if (needBuffersCopy) {
            gl.bufferData(gl.ARRAY_BUFFER, 
                positionArray, 
                this.__buffersUsage, 0, _currPolyCount * 3 * 3);
        }

        // copy color buffer
        if (this.__currDrawingParams.hasVertexColor && colorsBuffer) {
            effect.setColorsAttribute(colorsBuffer, true);
            if (needBuffersCopy && colorsArray) {
                gl.bufferData(gl.ARRAY_BUFFER, 
                    colorsArray, 
                    this.__buffersUsage, 0, _currPolyCount * 3 * 4);
            }
        }

        // set indices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        // draw elements
        gl.drawElements(gl.TRIANGLES, _currPolyCount * 3, this.__indicesType, 0);
        gfx._internal.drawCallsCount++;
        gfx._internal.drawShapePolygonsCount += _currPolyCount;

        // mark as not dirty
        this.__dirty = false;

        // if static, free arrays we no longer need them
        if (this.__staticBuffers) {
            this._buffers.positionArray = this._buffers.colorsArray = null;
        }
    }
}

// used for vertices calculations
const topLeft = new Vector2(0, 0);
const topRight = new Vector2(0, 0);
const bottomLeft = new Vector2(0, 0);
const bottomRight = new Vector2(0, 0);

// export the shapes batch class
module.exports = ShapesBatch;