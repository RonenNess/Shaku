import { Circle, Color, LoggerFactory, Matrix, Rectangle, Vector2, Vector3 } from "../../utils";
import { Vertex } from "../vertex";
import { DrawBatch } from "./draw_batch";

const _logger = LoggerFactory.getLogger("gfx - sprite - batch"); // TODO

/**
 * Colored lines renderer.
 * Responsible to drawing a batch of line segments or strips.
 */
export class LinesBatch extends DrawBatch {
	/**
	 * Create the sprites batch.
	 * @param {Number=} lineSegmentsCount Internal buffers size, in line segments count (line segment = 3 vertices). Bigger value = faster rendering but more RAM.
	 */
	public constructor(lineSegmentsCount) {
		// init draw batch
		super();

		// create buffers for drawing shapes
		this.#_createBuffers(lineSegmentsCount || 500);

		/**
		 * How many line segments this batch can hold.

		 */
		this.__maxLinesCount = Math.floor((this._buffers.positionArray.length / 6));

		/**
		 * How many line segments we currently have.

		 */
		this.__linesCount = 0;

		/**
		 * Indicate there were changes in buffers.

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

		/**
		 * If true, will draw lines as a single lines strip.
		 * @type {Boolean}
		 * @name ShapesBatch#linesStrip
		 */
		this.linesStrip = false;
	}

	/**
	 * Get the gfx manager.

	 */
	get #_gfx() {
		return DrawBatch._gfx;
	}

	/**
	 * Get the web gl instance.

	 */
	get #_gl() {
		return DrawBatch._gfx._internal.gl;
	}

	/**
	 * Build the dynamic buffers.

	 */
	#_createBuffers(batchPolygonsCount) {
		const gl = this.#_gl;

		// dynamic buffers, used for batch rendering
		this._buffers = {

			positionBuffer: gl.createBuffer(),
			positionArray: new Float32Array(3 * 2 * batchPolygonsCount),

			colorsBuffer: gl.createBuffer(),
			colorsArray: new Float32Array(4 * 2 * batchPolygonsCount),

			indexBuffer: gl.createBuffer(),
		};

		// create the indices buffer
		const maxIndex = (batchPolygonsCount * 3);
		let indicesArrayType;
		if(maxIndex <= 256) {
			indicesArrayType = Uint8Array;
			this.__indicesType = gl.UNSIGNED_BYTE;
		}
		if(maxIndex <= 65535) {
			indicesArrayType = Uint16Array;
			this.__indicesType = gl.UNSIGNED_SHORT;
		}
		else {
			indicesArrayType = Uint32Array;
			this.__indicesType = gl.UNSIGNED_INT;
		}
		const indices = new indicesArrayType(batchPolygonsCount * 3); // 3 = number of indices per sprite
		for(let i = 0; i < indices.length; i++) {

			indices[i] = i;
		}
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffers.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

		// extend buffers functionality
		function extendBuffer(buff) {
			if(buff) buff._index = 0;
		}
		extendBuffer(this._buffers.positionArray);
		extendBuffer(this._buffers.colorsArray);
	}

	/**
	 * @inheritdoc
	 */
	override clear() {
		super.clear();
		this._buffers.positionArray._index = 0;
		this._buffers.colorsArray._index = 0;
		this.__linesCount = 0;
		this.__dirty = false;
	}

	/**
	 * @inheritdoc
	 */
	override destroy() {
		const gl = this.#_gl;
		if(this._buffers) {
			if(this._buffers.positionBuffer) gl.deleteBuffer(this._buffers.positionBuffer);
			if(this._buffers.colorsBuffer) gl.deleteBuffer(this._buffers.colorsBuffer);
		}
		this._buffers = null;
	}

	/**
	 * @inheritdoc
	 */
	override get isDestroyed() {
		return Boolean(this._buffers) === false;
	}

	/**
	 * @inheritdoc
	 */
	override get defaultEffect() {
		return this.#_gfx.builtinEffects.Shapes;
	}

	/**
	 * Push vertices to drawing batch.
	 * @param {Array<Vertex>} vertices Vertices to push. Vertices count must be dividable by 3 to keep the batch consistent of polygons.
	 */
	drawVertices(vertices) {
		// sanity
		this.__validateDrawing(true);

		// sanity check
		if(!this.linesStrip && ((vertices.length % 2) !== 0)) {
			_logger.warn("Tried to push vertices that are not multiplication of 2!");
			return;
		}

		// push vertices
		let i = 0;
		const colors = this._buffers.colorsArray;
		const positions = this._buffers.positionArray;
		for(const vertex of vertices) {
			// push color
			if(this.__currDrawingParams.hasVertexColor) {
				colors[colors._index++] = (vertex.color.r || 0);
				colors[colors._index++] = (vertex.color.g || 0);
				colors[colors._index++] = (vertex.color.b || 0);
				colors[colors._index++] = (vertex.color.a || 0);
			}

			// push position
			positions[positions._index++] = (vertex.position.x || 0);
			positions[positions._index++] = (vertex.position.y || 0);
			positions[positions._index++] = (vertex.position.z || 0);

			// every 2 vertices..
			if((i++ === 1) || this.linesStrip) {
				// update quads count
				this.__linesCount++;

				// check if full
				if(this.__linesCount >= this.__maxLinesCount) {
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
	 * @param {Vector2=} origin Drawing origin. This will be the point at "position" and rotation origin.
	 * @param {Vector2=} skew Skew the drawing corners on X and Y axis, around the origin point.
	 */
	drawQuad(position, size, color, rotation, origin, skew) {
		const sprite = this.#_gfx.Sprite.build(null, position, size, undefined, color, rotation, origin, skew);
		this.#_addRect(sprite);
	}

	/**
	 * Add a rectangle that covers a given destination rectangle.
	 * @param {Rectangle|Vector2} destRect Destination rectangle to draw on. If vector is provided, will draw from 0,0 with vector as size.
	 * @param {Rectangle=} sourceRect Source rectangle, or undefined to use the entire texture.
	 * @param {Color|Array<Color>|undefined=} color Rectangle color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
	 * @param {Number=} rotation Rotate rectangle.
	 * @param {Vector2=} origin Drawing origin. This will be the point at "position" and rotation origin.
	 */
	drawRectangle(destRect, sourceRect, color, rotation, origin) {
		if((destRect.isVector2) || (destRect.isVector3)) {
			destRect = new Rectangle(0, 0, destRect.x, destRect.y);
		}
		this.drawQuad(destRect.getCenter(), destRect.getSize(), sourceRect, color, rotation, origin);
	}

	/**
	 * Draw a colored circle.
	 * @param circle Circle to draw.
	 * @param color Circle fill color.
	 * @param segmentsCount How many segments to build the circle from (more segments = smoother circle).
	 * @param ratio If provided, will scale the circle on X and Y axis to turn it into an oval. If a number is provided, will use this number to scale Y axis.
	 * @param rotation If provided will rotate the oval / circle.
	 */
	drawCircle(circle: Circle, color: Color, segmentsCount = 24, ratio: Vector2 | number = Vector2.oneReadonly, rotation?: number) {
		// sanity
		this.__validateDrawing(true);

		// defaults segments count
		if(segmentsCount < 2) return;

		// default ratio
		if(typeof ratio === "number") ratio = new Vector2(1, ratio);

		// for rotation
		let rotateVec;
		if(rotation) {
			const cos = Math.cos(rotation);
			const sin = Math.sin(rotation);
			rotateVec = function(vector) {
				const x = (vector.x * cos - vector.y * sin);
				const y = (vector.x * sin + vector.y * cos);
				vector.x = x;
				vector.y = y;
				return vector;
			};
		}

		// build first position that is not center
		const segmentStep = (2 * Math.PI) / segmentsCount;
		let prevPoint = new Vector2(
			(circle.radius * Math.cos(0)) * ratio.x,
			(circle.radius * Math.sin(0)) * ratio.y
		);
		if(rotateVec) rotateVec(prevPoint);

		// generate list of vertices to draw the circle
		for(let i = 1; i <= segmentsCount; i++) {
			// calculate new point
			const newPoint = new Vector2(
				(circle.radius * Math.cos(i * segmentStep)) * ratio.x,
				(circle.radius * Math.sin(i * segmentStep)) * ratio.y
			);
			if(rotateVec) rotateVec(newPoint);

			// add for line strip
			if(this.linesStrip) {
				if(i === 1) {
					this.drawVertices([
						new Vertex(prevPoint.add(circle.center), null, color),
					]);
				}
				this.drawVertices([
					new Vertex(newPoint.add(circle.center), null, color),
				]);
			}
			// add for line segments
			else {
				this.drawVertices([
					new Vertex(prevPoint.add(circle.center), null, color),
					new Vertex(newPoint.add(circle.center), null, color),
				]);
			}
			prevPoint = newPoint;
		}
	}

	/**
	 * Add a rectangle from sprite data.

	 */
	#_addRect(sprite, transform) {
		// sanity
		this.__validateDrawing(true);

		// mark as dirty
		this.__dirty = true;

		// add rectangle from sprite data
		{
			// calculate vertices positions
			const sizeX = sprite.size.x;
			const sizeY = sprite.size.y;
			const left = -sizeX * sprite.origin.x;
			const top = -sizeY * sprite.origin.y;

			// calculate corners
			topLeft.x = left; topLeft.y = top;
			topRight.x = left + sizeX; topRight.y = top;
			bottomLeft.x = left; bottomLeft.y = top + sizeY;
			bottomRight.x = left + sizeX; bottomRight.y = top + sizeY;

			// are vertices axis aligned?
			let axisAlined = true;

			// apply skew
			if(sprite.skew) {
				// skew on x axis
				if(sprite.skew.x) {
					topLeft.x += sprite.skew.x * sprite.origin.y;
					topRight.x += sprite.skew.x * sprite.origin.y;
					bottomLeft.x -= sprite.skew.x * (1 - sprite.origin.y);
					bottomRight.x -= sprite.skew.x * (1 - sprite.origin.y);
					axisAlined = false;
				}
				// skew on y axis
				if(sprite.skew.y) {
					topLeft.y += sprite.skew.y * sprite.origin.x;
					bottomLeft.y += sprite.skew.y * sprite.origin.x;
					topRight.y -= sprite.skew.y * (1 - sprite.origin.x);
					bottomRight.y -= sprite.skew.y * (1 - sprite.origin.x);
					axisAlined = false;
				}
			}

			// apply rotation
			if(sprite.rotation) {
				const cos = Math.cos(sprite.rotation);
				const sin = Math.sin(sprite.rotation);
				function rotateVec(vector: Vector2) {
					const x = (vector.x * cos - vector.y * sin);
					const y = (vector.x * sin + vector.y * cos);
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
			if(transform && !transform.isIdentity) {
				topLeft.copy((topLeft.z !== undefined) ? Matrix.transformVector3(transform, topLeft) : Matrix.transformVector2(transform, topLeft));
				topRight.copy((topRight.z !== undefined) ? Matrix.transformVector3(transform, topRight) : Matrix.transformVector2(transform, topRight));
				bottomLeft.copy((bottomLeft.z !== undefined) ? Matrix.transformVector3(transform, bottomLeft) : Matrix.transformVector2(transform, bottomLeft));
				bottomRight.copy((bottomRight.z !== undefined) ? Matrix.transformVector3(transform, bottomRight) : Matrix.transformVector2(transform, bottomRight));
			}

			// snap pixels
			if(this.snapPixels) {
				topLeft.floorSelf();
				topRight.floorSelf();
				bottomLeft.floorSelf();
				bottomRight.floorSelf();
			}

			// add rectangle vertices
			if(this.linesStrip) {
				this.drawVertices([
					new Vertex(topLeft, null, sprite.color),
					new Vertex(topRight, null, sprite.color),
					new Vertex(bottomRight, null, sprite.color),
					new Vertex(bottomLeft, null, sprite.color),
					new Vertex(topLeft, null, sprite.color),
				]);
			}
			else {
				this.drawVertices([
					new Vertex(topLeft, null, sprite.color),
					new Vertex(topRight, null, sprite.color),

					new Vertex(topRight, null, sprite.color),
					new Vertex(bottomRight, null, sprite.color),

					new Vertex(bottomRight, null, sprite.color),
					new Vertex(bottomLeft, null, sprite.color),

					new Vertex(bottomLeft, null, sprite.color),
					new Vertex(topLeft, null, sprite.color),
				]);
			}
		}
	}

	/**
	 * Get how many line segments are currently in batch.
	 * @returns {Number} Line segments in batch count.
	 */
	get linesInBatch() {
		return this.__linesCount;
	}

	/**
	 * Get how many line segments this batch can contain.
	 * @returns {Number} Max line segments count.
	 */
	get maxLinesCount() {
		return this.__maxLinesCount;
	}

	/**
	 * Check if this batch is full.
	 * @returns {Boolean} True if batch is full.
	 */
	get isFull() {
		return this.__linesCount >= this.__maxLinesCount;
	}

	/**
	 * Called when the batch becomes full while drawing and there's no handler.

	 */
	private _handleFullBuffer() {
		// invoke on-overflow callback
		if(this.onOverflow) {
			this.onOverflow();
		}

		// draw current batch and clear
		this._drawBatch();
		this.clear();
	}

	/**
	 * @inheritdoc

	 */
	private override _drawBatch() {
		// get default effect
		let effect = this.__currDrawingParams.effect;

		// get some members
		const gl = this.#_gl;
		const gfx = this.#_gfx;
		const positionArray = this._buffers.positionArray;
		const colorsArray = this.__currDrawingParams.hasVertexColor ? this._buffers.colorsArray : null;
		const positionBuffer = this._buffers.positionBuffer;
		const colorsBuffer = this._buffers.colorsBuffer;
		const indexBuffer = this._buffers.indexBuffer;

		// should copy buffers
		const needBuffersCopy = this.__dirty;

		// nothing to draw? skip
		if(positionArray._index <= 1) {
			return;
		}

		// get default effect
		effect = effect || this.defaultEffect;

		// call base method to set effect and draw params
		super._drawBatch();

		// vertices count
		const verticesCount = positionArray._index / 3;

		// copy position buffer
		effect.setPositionsAttribute(positionBuffer, true);
		if(needBuffersCopy) {
			gl.bufferData(gl.ARRAY_BUFFER,
				positionArray,
				this.__buffersUsage, 0, positionArray._index);
		}

		// copy color buffer
		if(this.__currDrawingParams.hasVertexColor && colorsBuffer) {
			effect.setColorsAttribute(colorsBuffer, true);
			if(needBuffersCopy && colorsArray) {
				gl.bufferData(gl.ARRAY_BUFFER,
					colorsArray,
					this.__buffersUsage, 0, colorsArray._index);
			}
		}

		// set indices
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

		// draw elements
		gl.drawElements((this.linesStrip ? gl.LINE_STRIP : gl.LINES), verticesCount, this.__indicesType, 0);
		gfx._internal.drawCallsCount++;
		gfx._internal.drawShapePolygonsCount += verticesCount / 2;

		// mark as not dirty
		this.__dirty = false;

		// if static, free arrays we no longer need them
		if(this.__staticBuffers) {
			this._buffers.positionArray = this._buffers.colorsArray = null;
		}
	}
}

// used for vertices calculations
const topLeft = new Vector2(0, 0);
const topRight = new Vector2(0, 0);
const bottomLeft = new Vector2(0, 0);
const bottomRight = new Vector2(0, 0);
