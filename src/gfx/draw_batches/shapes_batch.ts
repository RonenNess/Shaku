import { ShapesEffect } from "..";
import { Circle, Color, LoggerFactory, Matrix, Rectangle, Vector2, Vector3 } from "../../utils";
import { Vertex } from "../vertex";
import { DrawBatch } from "./draw_batch";

const _logger = LoggerFactory.getLogger("gfx - sprite - batch"); // TODO

/**
 * Colored shapes renderer.
 * Responsible to drawing a batch of basic geometric shapes with as little draw calls as possible.
 */
export class ShapesBatch extends DrawBatch {
	public onOverflow: (() => void) | null;
	public snapPixels: boolean;

	private __maxPolyCount: number;
	private __polyCount: number;
	private __dirty: boolean;
	private _buffers: {
		positionBuffer: unknown;
		positionArray: Float32Array;
		colorsBuffer: unknown;
		colorsArray: Float32Array;
		indexBuffer: unknown;
	} | null;
	private __indicesType: unknown;

	/**
	 * Create the sprites batch.
	 * @param {Number=} batchPolygonsCount Internal buffers size, in polygons count (polygon = 3 vertices). Bigger value = faster rendering but more RAM.
	 */
	public constructor(batchPolygonsCount?: number) {
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
	get #_gfx(): unknown {
		return DrawBatch._gfx;
	}

	/**
	 * Get the web gl instance.
	 * @private
	 */
	get #_gl(): unknown {
		return DrawBatch._gfx._internal.gl;
	}

	/**
	 * Build the dynamic buffers.
	 * @private
	 */
	#_createBuffers(batchPolygonsCount: number): void {
		const gl = this.#_gl;

		// dynamic buffers, used for batch rendering
		this._buffers = {

			positionBuffer: gl.createBuffer(),
			positionArray: new Float32Array(3 * 3 * batchPolygonsCount),

			colorsBuffer: gl.createBuffer(),
			colorsArray: new Float32Array(4 * 3 * batchPolygonsCount),

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

		// extand buffers functionality
		function extendBuffer(buff) {
			if(buff) { buff._index = 0; }
		}
		extendBuffer(this._buffers.positionArray);
		extendBuffer(this._buffers.colorsArray);
	}

	/**
	 * @inheritdoc
	 */
	public clear(): void {
		super.clear();
		this._buffers.positionArray._index = 0;
		this._buffers.colorsArray._index = 0;
		this.__polyCount = 0;
		this.__dirty = false;
	}

	/**
	 * @inheritdoc
	 */
	public destroy(): void {
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
	public get isDestroyed(): boolean {
		return Boolean(this._buffers) === false;
	}

	/**
	 * @inheritdoc
	 */
	public get defaultEffect(): ShapesEffect {
		return this.#_gfx.builtinEffects.Shapes;
	}

	/**
	 * Draw a line between two points.
	 * This method actually uses a rectangle internally, which is less efficient than using a proper LinesBatch, but have the advantage of supporting width.
	 * @param fromPoint Starting position.
	 * @param toPoint Ending position.
	 * @param color Line color.
	 * @param width Line width.
	 */
	public drawLine(fromPoint: Vector2, toPoint: Vector2, color: Color, width?: number): void {
		width = width || 1;
		length = fromPoint.distanceTo(toPoint);
		const rotation = Vector2.radiansBetween(fromPoint, toPoint);
		const position = (width > 1) ? (new Vector2(fromPoint.x, fromPoint.y - width / 2)) : fromPoint;
		const size = new Vector2(length, width);
		this.drawQuad(position, size, color, rotation, new Vector2(0, 0.5));
	}

	/**
	 * Push vertices to drawing batch.
	 * @param vertices Vertices to push. Vertices count must be dividable by 3 to keep the batch consistent of polygons.
	 */
	public drawVertices(vertices: Vertex[]): void {
		// sanity
		this.__validateDrawing(true);

		// sanity check
		if((vertices.length % 3) !== 0) {
			_logger.warn("Tried to push vertices that are not multiplication of 3!");
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

			// every 3 vertices..
			if(i++ === 2) {
				// update quads count
				this.__polyCount++;

				// check if full
				if(this.__polyCount >= this.__maxPolyCount) {
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
	 * @param position Drawing position (at origin). If vector3 is provided, will pass z value to the shader code position attribute.
	 * @param size Drawing size. If vector3 is provided, will pass z value to the shader code position attribute for the bottom vertices, as position.z + size.z.
	 * @param color Rectangle color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
	 * @param rotation Rotate rectangle.
	 * @param origin Drawing origin. This will be the point at "position" and rotation origin.
	 * @param skew Skew the drawing corners on X and Y axis, around the origin point.
	 */
	public drawQuad(position: Vector2 | Vector3, size: Vector2 | Vector3 | number, color?: Color | Color[] | undefined, rotation?: number, origin?: Vector2, skew?: Vector2): void {
		const sprite = this.#_gfx.Sprite.build(null, position, size, undefined, color, rotation, origin, skew);
		this.#_addRect(sprite);
	}

	/**
	 * Adds a 1x1 point.
	 * @param position Point position.
	 * @param color Point color.
	 */
	public addPoint(position: Vector2 | Vector3, color: Color): void {
		this.drawVertices([
			new Vertex(position, null, color),
			new Vertex(position.add(2, 0), null, color),
			new Vertex(position.add(0, 2), null, color),
		]);
	}

	/**
	 * Add a rectangle that covers a given destination rectangle.
	 * @param destRect Destination rectangle to draw on. If vector is provided, will draw from 0,0 with vector as size.
	 * @param color Rectangle color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
	 * @param rotation Rotate rectangle.
	 * @param origin Drawing origin. This will be the point at "position" and rotation origin.
	 */
	public drawRectangle(destRect: Rectangle | Vector2, color?: Color | Color[] | undefined, rotation?: number, origin?: Vector2): void {
		if((destRect instanceof Vector2) || (destRect instanceof Vector3)) {
			destRect = new Rectangle(0, 0, destRect.x, destRect.y);
		}
		const position = origin ? destRect.getPosition().addSelf(size.mul(origin)) : destRect.getCenter();
		origin = origin || Vector2.halfReadonly;
		const size = destRect.getSize();
		this.drawQuad(position, size, color, rotation, origin);
	}

	/**
	 * Draw a colored circle.
	 * @param circle Circle to draw.
	 * @param color Circle fill color.
	 * @param segmentsCount How many segments to build the circle from (more segments = smoother circle).
	 * @param outsideColor If provided, will create a gradient-colored circle and this value will be the outter side color.
	 * @param ratio If procided, will scale the circle on X and Y axis to turn it into an oval. If a number is provided, will use this number to scale Y axis.
	 * @param rotation If provided will rotate the oval / circle.
	 */
	public drawCircle(circle: Circle, color: Color, segmentsCount?: number, outsideColor?: Color, ratio?: number | Vector2, rotation?: number): void {
		// sanity
		this.__validateDrawing(true);

		// defaults segments count
		if(segmentsCount === undefined) {
			segmentsCount = 24;
		}
		else if(segmentsCount < 2) {
			return;
		}

		// default outside color
		if(!outsideColor) {
			outsideColor = color;
		}

		// default ratio
		if(!ratio) {
			ratio = Vector2.oneReadonly;
		}
		else if(typeof ratio === "number") {
			ratio = new Vector2(1, ratio);
		}

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
		if(rotateVec) { rotateVec(prevPoint); }

		// generate list of vertices to draw the circle
		for(let i = 1; i <= segmentsCount; i++) {
			const newPoint = new Vector2(
				(circle.radius * Math.cos(i * segmentStep)) * ratio.x,
				(circle.radius * Math.sin(i * segmentStep)) * ratio.y
			);
			if(rotateVec) { rotateVec(newPoint); }
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
	#_addRect(sprite: unknown, transform: unknown) {
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
				function rotateVec(vector) {
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
	 * @returns Polygons in batch count.
	 */
	public get polygonsInBatch(): number {
		return this.__polyCount;
	}

	/**
	 * Get how many polygons this sprite batch can contain.
	 * @returns Max polygons count.
	 */
	public get maxPolygonsCount(): number {
		return this.__maxPolyCount;
	}

	/**
	 * Check if this batch is full.
	 * @returns True if batch is full.
	 */
	public get isFull(): boolean {
		return this.__polyCount >= this.__maxPolyCount;
	}

	/**
	 * Called when the batch becomes full while drawing and there's no handler.
	 * @private
	 */
	private _handleFullBuffer(): void {
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
	 * @private
	 */
	private _drawBatch(): void {
		// get default effect
		const effect = this.__currDrawingParams.effect;

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

		// calculate current batch quads count
		const _currPolyCount = this.polygonsInBatch;

		// nothing to draw? skip
		if(_currPolyCount === 0) {
			return;
		}

		// call base method to set effect and draw params
		super._drawBatch();

		// copy position buffer
		effect.setPositionsAttribute(positionBuffer, true);
		if(needBuffersCopy) {
			gl.bufferData(gl.ARRAY_BUFFER,
				positionArray,
				this.__buffersUsage, 0, _currPolyCount * 3 * 3);
		}

		// copy color buffer
		if(this.__currDrawingParams.hasVertexColor && colorsBuffer) {
			effect.setColorsAttribute(colorsBuffer, true);
			if(needBuffersCopy && colorsArray) {
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
		if(this.__staticBuffers) {
			this._buffers.positionArray = this._buffers.colorsArray = null;
		}
	}
}

// used for vertices calculations
const topLeft: Vector2 = new Vector2(0, 0);
const topRight: Vector2 = new Vector2(0, 0);
const bottomLeft: Vector2 = new Vector2(0, 0);
const bottomRight: Vector2 = new Vector2(0, 0);
