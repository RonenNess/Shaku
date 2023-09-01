import { MathHelper } from "./math_helper";
import { Matrix } from "./matrix";
import { Vector2 } from "./shapes";
import { TransformModes } from "./transform_modes";

// some default values
const _defaults = {
	position: Vector2.zero(),
	positionMode: TransformModes.RELATIVE,
	scale: Vector2.one(),
	scaleMode: TransformModes.AXIS_ALIGNED,
	rotation: 0,
	rotationMode: TransformModes.RELATIVE,
};

/**
 * Transformations helper class to store 2d position, rotation and scale.
 * Can also perform transformations inheritance, where we combine local with parent transformations.
 *
 * @example
 * // create local and world transformations
 * const transform = new Shaku.utils.Transformation();
 * const worldTransform = new Shaku.utils.Transformation();
 * // set offset to world transofm and rotation to local transform
 * worldTransform.setPosition({x: 100, y:50});
 * transform.setRotation(5);
 * // combine transformations and convert to a matrix
 * const combined = Shaku.utils.Transformation.combine(transform, worldTransform);
 * const matrix = combined.asMatrix();
 */
export class Transformation {
	/**
	 * Method to call when this transformation change.
	 * Function params: transformation instance (this), properties changed (boolean), transform modes changed (boolean).
	 */
	public onChange: null | ((transformation: Transformation, propertiesChanged: boolean, transformaModesChanged: boolean) => void);

	/**
	 * Transformation local position.
	 */
	private _position: Vector2;

	/**
	 * Position transformation mode.
	 */
	private _positionMode: TransformModes;

	/**
	 * Transformation local scale.
	 */
	private _scale: Vector2;

	/**
	 * Scale transformation mode.
	 */
	private _scaleMode: TransformModes;

	/**
	 * Transformation local rotation.
	 */
	private _rotation: number;

	/**
	 * Rotation transformation mode.
	 */
	private _rotationMode: TransformModes;

	private _dirty: boolean;
	private _matrix: Matrix | null;
	private _worldMatrix: Matrix;
	private _worldPosition: Vector2;

	/**
	 * Create the transformations.
	 * @param position Optional position value.
	 * @param rotation Optional rotation value.
	 * @param scale Optional scale value.
	 */
	public constructor(position: Vector2 = _defaults.position.clone(), rotation: number = _defaults.rotation, scale: Vector2 = _defaults.scale.clone()) {
		this._position = position;
		this._positionMode = _defaults.positionMode;
		this._scale = scale;
		this._scaleMode = _defaults.scaleMode;
		this._rotation = rotation;
		this._rotationMode = _defaults.rotationMode;
		this.onChange = null;
	}

	/**
	 * Get position.
	 * @returns Position.
	 */
	public getPosition(): Vector2 {
		return this._position.clone();
	}

	/**
	 * Get position transformations mode.
	 * @returns Position transformation mode.
	 */
	public getPositionMode(): TransformModes {
		return this._positionMode;
	}

	/**
	 * Set position.
	 * @param value New position.
	 * @returns this.
	 */
	public setPosition(value: Vector2): Transformation {
		if(this._position.equals(value)) return this;
		this._position.copy(value);
		this.#_markDirty(true, false);
		return this;
	}

	/**
	 * Set position X value.
	 * @param value New position.x value.
	 * @returns this.
	 */
	public setPositionX(value: number): Transformation {
		if(this._position.x === value) return this;
		this._position.x = value;
		this.#_markDirty(true, false);
		return this;
	}

	/**
	 * Set position Y value.
	 * @param value New position.y value.
	 * @returns this.
	 */
	public setPositionY(value: number): Transformation {
		if(this._position.y === value) return this;
		this._position.y = value;
		this.#_markDirty(true, false);
		return this;
	}

	/**
	 * Move position by a given vector.
	 * @param value Vector to move position by.
	 * @returns this.
	 */
	public move(value: Vector2): Transformation {
		this._position.addSelf(value);
		this.#_markDirty(true, false);
		return this;
	}

	/**
	 * Set position transformations mode.
	 * @param value Position transformation mode.
	 * @returns this.
	 */
	public setPositionMode(value: TransformModes): Transformation {
		if(this._positionMode === value) return this;
		this._positionMode = value;
		this.#_markDirty(false, true);
		return this;
	}

	/**
	 * Get scale.
	 * @returns Scale.
	 */
	public getScale(): Vector2 {
		return this._scale.clone();
	}

	/**
	 * Get scale transformations mode.
	 * @returns Scale transformation mode.
	 */
	public getScaleMode(): TransformModes {
		return this._scaleMode;
	}

	/**
	 * Set scale.
	 * @param value New scale.
	 * @returns this.
	 */
	public setScale(value: Vector2): Transformation {
		if(this._scale.equals(value)) return this;
		this._scale.copy(value);
		this.#_markDirty(true, false);
		return this;
	}

	/**
	 * Set scale X value.
	 * @param value New scale.x value.
	 * @returns this.
	 */
	public setScaleX(value: number): Transformation {
		if(this._scale.x === value) return this;
		this._scale.x = value;
		this.#_markDirty(true, false);
		return this;
	}

	/**
	 * Set scale Y value.
	 * @param value New scale.y value.
	 * @returns this.
	 */
	public setScaleY(value: number): Transformation {
		if(this._scale.y === value) return this;
		this._scale.y = value;
		this.#_markDirty(true, false);
		return this;
	}

	/**
	 * Scale by a given vector.
	 * @param value Vector to scale by.
	 * @returns this.
	 */
	public scale(value: Vector2): Transformation {
		this._scale.mulSelf(value);
		this.#_markDirty(true, false);
		return this;
	}

	/**
	 * Set scale transformations mode.
	 * @param value Scale transformation mode.
	 * @returns this.
	 */
	public setScaleMode(value: TransformModes): Transformation {
		if(this._scaleMode === value) return this;
		this._scaleMode = value;
		this.#_markDirty(false, true);
		return this;
	}

	/**
	 * Get rotation.
	 * @returns rotation.
	 */
	public getRotation(): number {
		return this._rotation;
	}

	/**
	 * Get rotation as degrees.
	 * @returns rotation.
	 */
	public getRotationDegrees(): number {
		return MathHelper.toDegrees(this._rotation);
	}

	/**
	 * Get rotation as degrees, wrapped between 0 to 360.
	 * @returns rotation.
	 */
	public getRotationDegreesWrapped(): number {
		const degrees = this.getRotationDegrees();
		return MathHelper.wrapDegrees(degrees);
	}

	/**
	 * Get rotation transformations mode.
	 * @returns Rotation transformations mode.
	 */
	public getRotationMode(): TransformModes {
		return this._rotationMode;
	}

	/**
	 * Set rotation.
	 * @param value New rotation.
	 * @param wrap If true, will wrap value if out of possible range.
	 * @returns this.
	 */
	public setRotation(value: number, wrap: boolean): Transformation {
		if(this._rotation === value) return this;
		this._rotation = value;
		if(wrap && ((this._rotation < 0) || (this._rotation > (Math.PI * 2)))) {
			this._rotation = Math.atan2(Math.sin(this._rotation), Math.cos(this._rotation));
		}
		this.#_markDirty(true, false);
		return this;
	}

	/**
	 * Rotate transformation by given radians.
	 * @param value Rotate value in radians.
	 * @param wrap If true, will wrap value if out of possible range.
	 * @returns this.
	 */
	public rotate(value: number, wrap: boolean): Transformation {
		this.setRotation(this._rotation + value, wrap);
		return this;
	}

	/**
	 * Set rotation as degrees.
	 * @param value New rotation.
	 * @param wrap If true, will wrap value if out of possible range.
	 * @returns this.
	 */
	public setRotationDegrees(value: number, wrap: boolean): Transformation {
		const rads = MathHelper.toRadians(value);
		return this.setRotation(rads, wrap);
	}

	/**
	 * Rotate transformation by given degrees.
	 * @param value Rotate value in degrees.
	 * @returns this.
	 */
	public rotateDegrees(value: number): Transformation {
		this._rotation += MathHelper.toRadians(value);
		this.#_markDirty(true, false);
		return this;
	}

	/**
	 * Set rotation transformations mode.
	 * @param {TransformModes} value Rotation transformation mode.
	 * @returns {Transformation} this.
	 */
	public setRotationMode(value: TransformModes): Transformation {
		if(this._rotationMode === value) return this;
		this._rotationMode = value;
		this.#_markDirty(false, true);
		return this;
	}

	/**
	 * Notify about changes in values.
	 * @param localTransform Local transformations changed.
	 * @param transformationModes Transformation modes changed.
	 */
	#_markDirty(localTransform: boolean, transformationModes: boolean): void {
		this._matrix = null;
		this.onChange?.(this, localTransform, transformationModes);
	}

	/**
	 * Check if this transformation equals another.
	 * @param other Other transform to compare to.
	 * @returns True if equal, false otherwise.
	 */
	public equals(other: Transformation): boolean {
		return this._rotation === other._rotation
			&& this._position.equals(other._position)
			&& this._scale.equals(other._scale);
	}

	/**
	 * Return a clone of this transformations.
	 * @returns Cloned transformations.
	 */
	public clone(): Transformation {
		// create cloned transformation
		const ret = new Transformation(this._position.clone(), this._rotation, this._scale.clone());

		// copy transformation modes
		ret._rotationMode = this._rotationMode;
		ret._positionMode = this._positionMode;
		ret._scaleMode = this._scaleMode;

		// clone matrix
		ret._matrix = this._matrix;

		// return clone
		return ret;
	}

	/**
	 * Serialize this transformation into a dictionary.
	 */
	public serialize(): Partial<SerializedTransformation> {
		const ret: Partial<SerializedTransformation> = {};

		// position + mode
		if(!this._position.equals(_defaults.position)) ret.pos = this._position;
		if(this._positionMode !== _defaults.positionMode) ret.posm = this._positionMode;

		// scale + mode
		if(!this._scale.equals(_defaults.scale)) ret.scl = this._scale;
		if(this._scaleMode !== _defaults.scaleMode) ret.sclm = this._scaleMode;

		// rotation + mode
		if(this._rotation !== _defaults.rotation) ret.rot = Math.floor(MathHelper.toDegrees(this._rotation));
		if(this._rotationMode !== _defaults.rotationMode) ret.rotm = this._rotationMode;

		return ret;
	}

	/**
	 * Deserialize this transformation from a dictionary.
	 * @param data Data to set.
	 */
	public deserialize(data: Partial<SerializedTransformation>): Transformation {
		// position + mode
		this._position.copy(data.pos ?? _defaults.position);
		this._positionMode = data.posm ?? _defaults.positionMode;

		// scale + mode
		this._scale.copy(data.scl ?? _defaults.scale);
		this._scaleMode = data.sclm ?? _defaults.scaleMode;

		// rotation + mode
		this._rotation = MathHelper.toRadians(data.rot ?? _defaults.rotation);
		this._rotationMode = data.rotm ?? _defaults.rotationMode;

		this.#_markDirty(true, true);
		return this;
	}

	/**
	 * Create and return a transformation matrix.
	 * @returns  New transformation matrix.
	 */
	public asMatrix(): Matrix {
		// return cached
		if(this._matrix) return this._matrix;

		// get matrix type and create list of matrices to combine
		const matrices: Matrix[] = [];

		// apply position
		if((this._position.x !== 0) || (this._position.y !== 0)) matrices.push(Matrix.createTranslation(this._position.x, this._position.y, 0));

		// apply rotation
		if(this._rotation) matrices.push(Matrix.createRotationZ(-this._rotation));

		// apply scale
		if((this._scale.x !== 1) || (this._scale.y !== 1)) matrices.push(Matrix.createScale(this._scale.x, this._scale.y));

		// no transformations? identity matrix
		if(matrices.length === 0) this._matrix = Matrix.identity;
		// only one transformation? return it
		else if(matrices.length === 1) this._matrix = matrices[0];
		// more than one transformation? combine matrices
		else this._matrix = Matrix.multiplyMany(matrices);

		// return matrix
		return this._matrix;
	}

	/**
	 * Combine child transformations with parent transformations.
	 * @param child Child transformations.
	 * @param parent Parent transformations.
	 * @returns Combined transformations.
	 */
	public static combine(child: Transformation, parent: Transformation): Transformation {
		const position = combineVector(child._position, parent._position, parent, child._positionMode);
		const scale = combineVectorMul(child._scale, parent._scale, parent, child._scaleMode);
		const rotation = combineScalar(child._rotation, parent._rotation, parent, child._rotationMode);
		return new Transformation(position, rotation, scale);
	}
}

export interface SerializedTransformation {
	pos: Vector2;
	posm: TransformModes;
	scl: Vector2;
	sclm: TransformModes;
	rot: number;
	rotm: TransformModes;
}

/**
 * Combine child scalar value with parent using a transformation mode.
 * @param childValue Child value.
 * @param parentValue Parent value.
 * @param parent Parent transformations.
 * @param mode Transformation mode.
 * @returns Combined value.
 */
function combineScalar(childValue: number, parentValue: number, parent: Transformation, mode: TransformModes): number {
	switch(mode) {
		case TransformModes.ABSOLUTE:
			return childValue;

		case TransformModes.AXIS_ALIGNED:
		case TransformModes.RELATIVE:
			return parentValue + childValue;

		default:
			throw new Error("Unknown transform mode!");
	}
}

/**
 * Combine child vector value with parent using a transformation mode.
 * @param childValue Child value.
 * @param parentValue Parent value.
 * @param parent Parent transformations.
 * @param mode Transformation mode.
 * @returns Combined value.
 */
function combineVector(childValue: Vector2, parentValue: Vector2, parent: Transformation, mode: TransformModes): Vector2 {
	switch(mode) {
		case TransformModes.ABSOLUTE:
			return childValue.clone();

		case TransformModes.AXIS_ALIGNED:
			return parentValue.add(childValue);

		case TransformModes.RELATIVE:
			return parentValue.add(childValue.rotatedByRadians(parent._rotation));

		default:
			throw new Error("Unknown transform mode!");
	}
}

/**
 * Combine child vector value with parent using a transformation mode and multiplication.
 * @param childValue Child value.
 * @param parentValue Parent value.
 * @param parent Parent transformations.
 * @param mode Transformation mode.
 * @returns Combined value.
 */
function combineVectorMul(childValue: Vector2, parentValue: Vector2, parent: Transformation, mode: TransformModes): Vector2 {
	switch(mode) {
		case TransformModes.ABSOLUTE:
			return childValue.clone();

		case TransformModes.AXIS_ALIGNED:
			return parentValue.mul(childValue);

		case TransformModes.RELATIVE:
			return parentValue.mul(childValue.rotatedByRadians(parent._rotation));

		default:
			throw new Error("Unknown transform mode!");
	}
}
