import { MathHelper } from "./math_helper";
import { Matrix } from "./matrix";
import { Vector2 } from "./shapes";
import { TransformModes } from "./transform_modes";

/**
 * Transformations helper class to store 2d position, rotation and scale.
 * Can also perform transformations inheritance, where we combine local with parent transformations.
 *
 * @example
 * // create local and world transformations
 * const transform = new Shaku.utils.Transformation();
 * const worldTransform = new Shaku.utils.Transformation();
 * // set offset to world transform and rotation to local transform
 * worldTransform.setPosition({x: 100, y:50});
 * transform.setRotation(5);
 * // combine transformations and convert to a matrix
 * const combined = Shaku.utils.Transformation.combine(transform, worldTransform);
 * const matrix = combined.asMatrix();
 */
export class Transformation {

	// some default values
	private static readonly defaults = {
		position: Vector2.zero(),
		positionMode: TransformModes.RELATIVE,
		scale: Vector2.one(),
		scaleMode: TransformModes.AXIS_ALIGNED,
		rotation: 0,
		rotationMode: TransformModes.RELATIVE,
	};

	/**
	 * Method to call when this transformation change.
	 * Function params: transformation instance (this), properties changed (boolean), transform modes changed (boolean).
	 */
	public onChange: null | ((transformation: Transformation, propertiesChanged: boolean, transformModesChanged: boolean) => void);

	/**
	 * Transformation local position.
	 */
	private position: Vector2;

	/**
	 * Position transformation mode.
	 */
	private positionMode: TransformModes;

	/**
	 * Transformation local scale.
	 */
	private _scale: Vector2;

	/**
	 * Scale transformation mode.
	 */
	private scaleMode: TransformModes;

	/**
	 * Transformation local rotation.
	 */
	private rotation: number;

	/**
	 * Rotation transformation mode.
	 */
	private rotationMode: TransformModes;

	private dirty: boolean;
	private matrix: Matrix | null;
	private worldMatrix: Matrix;
	private worldPosition: Vector2;

	/**
	 * Create the transformations.
	 * @param position Optional position value.
	 * @param rotation Optional rotation value.
	 * @param scale Optional scale value.
	 */
	public constructor(position: Vector2 = Transformation.defaults.position.clone(), rotation: number = Transformation.defaults.rotation, scale: Vector2 = Transformation.defaults.scale.clone()) {
		this.position = position;
		this.positionMode = Transformation.defaults.positionMode;
		this._scale = scale;
		this.scaleMode = Transformation.defaults.scaleMode;
		this.rotation = rotation;
		this.rotationMode = Transformation.defaults.rotationMode;
		this.onChange = null;
	}

	/**
	 * Get position.
	 * @returns Position.
	 */
	public getPosition(): Vector2 {
		return this.position.clone();
	}

	/**
	 * Get position transformations mode.
	 * @returns Position transformation mode.
	 */
	public getPositionMode(): TransformModes {
		return this.positionMode;
	}

	/**
	 * Set position.
	 * @param value New position.
	 * @returns this.
	 */
	public setPosition(value: Vector2): Transformation {
		if(this.position.equals(value)) return this;
		this.position.copy(value);
		this.#_markDirty(true, false);
		return this;
	}

	/**
	 * Set position X value.
	 * @param value New position.x value.
	 * @returns this.
	 */
	public setPositionX(value: number): Transformation {
		if(this.position.x === value) return this;
		this.position.x = value;
		this.#_markDirty(true, false);
		return this;
	}

	/**
	 * Set position Y value.
	 * @param value New position.y value.
	 * @returns this.
	 */
	public setPositionY(value: number): Transformation {
		if(this.position.y === value) return this;
		this.position.y = value;
		this.#_markDirty(true, false);
		return this;
	}

	/**
	 * Move position by a given vector.
	 * @param value Vector to move position by.
	 * @returns this.
	 */
	public move(value: Vector2): Transformation {
		this.position.addSelf(value);
		this.#_markDirty(true, false);
		return this;
	}

	/**
	 * Set position transformations mode.
	 * @param value Position transformation mode.
	 * @returns this.
	 */
	public setPositionMode(value: TransformModes): Transformation {
		if(this.positionMode === value) return this;
		this.positionMode = value;
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
		return this.scaleMode;
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
		if(this.scaleMode === value) return this;
		this.scaleMode = value;
		this.#_markDirty(false, true);
		return this;
	}

	/**
	 * Get rotation.
	 * @returns rotation.
	 */
	public getRotation(): number {
		return this.rotation;
	}

	/**
	 * Get rotation as degrees.
	 * @returns rotation.
	 */
	public getRotationDegrees(): number {
		return MathHelper.toDegrees(this.rotation);
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
		return this.rotationMode;
	}

	/**
	 * Set rotation.
	 * @param value New rotation.
	 * @param wrap If true, will wrap value if out of possible range.
	 * @returns this.
	 */
	public setRotation(value: number, wrap: boolean): Transformation {
		if(this.rotation === value) return this;
		this.rotation = value;
		if(wrap && ((this.rotation < 0) || (this.rotation > (Math.PI * 2)))) {
			this.rotation = Math.atan2(Math.sin(this.rotation), Math.cos(this.rotation));
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
		this.setRotation(this.rotation + value, wrap);
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
		this.rotation += MathHelper.toRadians(value);
		this.#_markDirty(true, false);
		return this;
	}

	/**
	 * Set rotation transformations mode.
	 * @param {TransformModes} value Rotation transformation mode.
	 * @returns {Transformation} this.
	 */
	public setRotationMode(value: TransformModes): Transformation {
		if(this.rotationMode === value) return this;
		this.rotationMode = value;
		this.#_markDirty(false, true);
		return this;
	}

	/**
	 * Notify about changes in values.
	 * @param localTransform Local transformations changed.
	 * @param transformationModes Transformation modes changed.
	 */
	#_markDirty(localTransform: boolean, transformationModes: boolean): void {
		this.matrix = null;
		this.onChange?.(this, localTransform, transformationModes);
	}

	/**
	 * Check if this transformation equals another.
	 * @param other Other transform to compare to.
	 * @returns True if equal, false otherwise.
	 */
	public equals(other: Transformation): boolean {
		return this.rotation === other.rotation
			&& this.position.equals(other.position)
			&& this._scale.equals(other._scale);
	}

	/**
	 * Return a clone of this transformations.
	 * @returns Cloned transformations.
	 */
	public clone(): Transformation {
		// create cloned transformation
		const ret = new Transformation(this.position.clone(), this.rotation, this._scale.clone());

		// copy transformation modes
		ret.rotationMode = this.rotationMode;
		ret.positionMode = this.positionMode;
		ret.scaleMode = this.scaleMode;

		// clone matrix
		ret.matrix = this.matrix;

		// return clone
		return ret;
	}

	/**
	 * Serialize this transformation into a dictionary.
	 */
	public serialize(): Partial<SerializedTransformation> {
		const ret: Partial<SerializedTransformation> = {};

		// position + mode
		if(!this.position.equals(Transformation.defaults.position)) ret.pos = this.position;
		if(this.positionMode !== Transformation.defaults.positionMode) ret.posm = this.positionMode;

		// scale + mode
		if(!this._scale.equals(Transformation.defaults.scale)) ret.scl = this._scale;
		if(this.scaleMode !== Transformation.defaults.scaleMode) ret.sclm = this.scaleMode;

		// rotation + mode
		if(this.rotation !== Transformation.defaults.rotation) ret.rot = Math.floor(MathHelper.toDegrees(this.rotation));
		if(this.rotationMode !== Transformation.defaults.rotationMode) ret.rotm = this.rotationMode;

		return ret;
	}

	/**
	 * Deserialize this transformation from a dictionary.
	 * @param data Data to set.
	 */
	public deserialize(data: Partial<SerializedTransformation>): Transformation {
		// position + mode
		this.position.copy(data.pos ?? Transformation.defaults.position);
		this.positionMode = data.posm ?? Transformation.defaults.positionMode;

		// scale + mode
		this._scale.copy(data.scl ?? Transformation.defaults.scale);
		this.scaleMode = data.sclm ?? Transformation.defaults.scaleMode;

		// rotation + mode
		this.rotation = MathHelper.toRadians(data.rot ?? Transformation.defaults.rotation);
		this.rotationMode = data.rotm ?? Transformation.defaults.rotationMode;

		this.#_markDirty(true, true);
		return this;
	}

	/**
	 * Create and return a transformation matrix.
	 * @returns  New transformation matrix.
	 */
	public asMatrix(): Matrix {
		// return cached
		if(this.matrix) return this.matrix;

		// get matrix type and create list of matrices to combine
		const matrices: Matrix[] = [];

		// apply position
		if((this.position.x !== 0) || (this.position.y !== 0)) matrices.push(Matrix.createTranslation(this.position.x, this.position.y, 0));

		// apply rotation
		if(this.rotation) matrices.push(Matrix.createRotationZ(-this.rotation));

		// apply scale
		if((this._scale.x !== 1) || (this._scale.y !== 1)) matrices.push(Matrix.createScale(this._scale.x, this._scale.y));

		// no transformations? identity matrix
		if(matrices.length === 0) this.matrix = Matrix.identity;
		// only one transformation? return it
		else if(matrices.length === 1) this.matrix = matrices[0];
		// more than one transformation? combine matrices
		else this.matrix = Matrix.multiplyMany(matrices);

		// return matrix
		return this.matrix;
	}

	/**
	 * Combine child transformations with parent transformations.
	 * @param child Child transformations.
	 * @param parent Parent transformations.
	 * @returns Combined transformations.
	 */
	public static combine(child: Transformation, parent: Transformation): Transformation {
		const position = combineVector(child.position, parent.position, parent, child.positionMode);
		const scale = combineVectorMul(child._scale, parent._scale, parent, child.scaleMode);
		const rotation = combineScalar(child.rotation, parent.rotation, parent, child.rotationMode);
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
