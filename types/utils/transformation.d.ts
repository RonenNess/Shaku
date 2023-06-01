export = Transformation;
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
declare class Transformation {
    /**
     * Combine child transformations with parent transformations.
     * @param {Transformation} child Child transformations.
     * @param {Transformation} parent Parent transformations.
     * @returns {Transformation} Combined transformations.
     */
    static combine(child: Transformation, parent: Transformation): Transformation;
    /**
     * Create the transformations.
     * @param {Vector2} position Optional position value.
     * @param {Number} rotation Optional rotation value.
     * @param {Vector2} scale Optional sscale value.
     */
    constructor(position: Vector2, rotation: number, scale: Vector2);
    /**
     * @private
     * Transformation local position.
     * @name Transformation#position
     * @type {Vector2}
     */
    private _position;
    /**
     * @private
     * Position transformation mode.
     * @name Transformation#positionMode
     * @type {TransformModes}
     */
    private _positionMode;
    /**
     * @private
     * Transformation local scale.
     * @name Transformation#scale
     * @type {Vector2}
     */
    private _scale;
    /**
     * @private
     * Scale transformation mode.
     * @name Transformation#scaleMode
     * @type {TransformModes}
     */
    private _scaleMode;
    /**
     * @private
     * Transformation local rotation.
     * @name Transformation#rotation
     * @type {Number}
     */
    private _rotation;
    /**
     * @private
     * Rotation transformation mode.
     * @name Transformation#rotationMode
     * @type {TransformModes}
     */
    private _rotationMode;
    /**
     * Method to call when this transformation change.
     * Function params: transformation instance (this), properties changed (boolean), transform modes changed (boolean).
     * @name Transformation#onChange
     * @type {Function}
     */
    onChange: Function;
    /**
     * Get position.
     * @returns {Vector2} Position.
     */
    getPosition(): Vector2;
    /**
     * Get position transformations mode.
     * @returns {TransformModes} Position transformation mode.
     */
    getPositionMode(): {
        Relative: string;
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
        AxisAligned: string;
        Absolute: string;
    };
    /**
     * Set position.
     * @param {Vector2} value New position.
     * @returns {Transformation} this.
     */
    setPosition(value: Vector2): Transformation;
    /**
     * Set position X value.
     * @param {Number} value New position.x value.
     * @returns {Transformation} this.
     */
    setPositionX(value: number): Transformation;
    /**
     * Set position Y value.
     * @param {Number} value New position.y value.
     * @returns {Transformation} this.
     */
    setPositionY(value: number): Transformation;
    /**
     * Move position by a given vector.
     * @param {Vector2} value Vector to move position by.
     * @returns {Transformation} this.
     */
    move(value: Vector2): Transformation;
    /**
     * Set position transformations mode.
     * @param {TransformModes} value Position transformation mode.
     * @returns {Transformation} this.
     */
    setPositionMode(value: {
        Relative: string;
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
        AxisAligned: string;
        Absolute: string;
    }): Transformation;
    /**
     * Get scale.
     * @returns {Vector2} Scale.
     */
    getScale(): Vector2;
    /**
     * Get scale transformations mode.
     * @returns {TransformModes} Scale transformation mode.
     */
    getScaleMode(): {
        Relative: string;
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
        AxisAligned: string;
        Absolute: string;
    };
    /**
     * Set scale.
     * @param {Vector2} value New scale.
     * @returns {Transformation} this.
     */
    setScale(value: Vector2): Transformation;
    /**
     * Set scale X value.
     * @param {Number} value New scale.x value.
     * @returns {Transformation} this.
     */
    setScaleX(value: number): Transformation;
    /**
     * Set scale Y value.
     * @param {Number} value New scale.y value.
     * @returns {Transformation} this.
     */
    setScaleY(value: number): Transformation;
    /**
     * Scale by a given vector.
     * @param {Vector2} value Vector to scale by.
     * @returns {Transformation} this.
     */
    scale(value: Vector2): Transformation;
    /**
     * Set scale transformations mode.
     * @param {TransformModes} value Scale transformation mode.
     * @returns {Transformation} this.
     */
    setScaleMode(value: {
        Relative: string;
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
        AxisAligned: string;
        Absolute: string;
    }): Transformation;
    /**
     * Get rotation.
     * @returns {Number} rotation.
     */
    getRotation(): number;
    /**
     * Get rotation as degrees.
     * @returns {Number} rotation.
     */
    getRotationDegrees(): number;
    /**
     * Get rotation as degrees, wrapped between 0 to 360.
     * @returns {Number} rotation.
     */
    getRotationDegreesWrapped(): number;
    /**
     * Get rotation transformations mode.
     * @returns {TransformModes} Rotation transformations mode.
     */
    getRotationMode(): {
        Relative: string;
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
        AxisAligned: string;
        Absolute: string;
    };
    /**
     * Set rotation.
     * @param {Number} value New rotation.
     * @param {Boolean} wrap If true, will wrap value if out of possible range.
     * @returns {Transformation} this.
     */
    setRotation(value: number, wrap: boolean): Transformation;
    /**
     * Rotate transformation by given radians.
     * @param {Number} value Rotate value in radians.
     * @param {Boolean} wrap If true, will wrap value if out of possible range.
     * @returns {Transformation} this.
     */
    rotate(value: number, wrap: boolean): Transformation;
    /**
     * Set rotation as degrees.
     * @param {Number} value New rotation.
     * @param {Boolean} wrap If true, will wrap value if out of possible range.
     * @returns {Transformation} this.
     */
    setRotationDegrees(value: number, wrap: boolean): Transformation;
    /**
     * Rotate transformation by given degrees.
     * @param {Number} value Rotate value in degrees.
     * @returns {Transformation} this.
     */
    rotateDegrees(value: number): Transformation;
    /**
     * Set rotation transformations mode.
     * @param {TransformModes} value Rotation transformation mode.
     * @returns {Transformation} this.
     */
    setRotationMode(value: {
        Relative: string;
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
        AxisAligned: string;
        Absolute: string;
    }): Transformation;
    _matrix: Matrix;
    /**
     * Check if this transformation equals another.
     * @param {Transformation} other Other transform to compare to.
     * @returns {Boolean} True if equal, false otherwise.
     */
    equals(other: Transformation): boolean;
    /**
     * Return a clone of this transformations.
     * @returns {Transformation} Cloned transformations.
     */
    clone(): Transformation;
    /**
     * Serialize this transformation into a dictionary.
     */
    serialize(): {
        pos: Vector2;
        posm: {
            Relative: string;
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
            AxisAligned: string;
            Absolute: string;
        };
        scl: Vector2;
        sclm: {
            Relative: string;
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
            AxisAligned: string;
            Absolute: string;
        };
        rot: number;
        rotm: {
            Relative: string;
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
            AxisAligned: string;
            Absolute: string;
        };
    };
    /**
     * Deserialize this transformation from a dictionary.
     * @param {*} data Data to set.
     */
    deserialize(data: any): void;
    /**
     * Create and return a transformation matrix.
     * @returns {Matrix} New transformation matrix.
     */
    asMatrix(): Matrix;
    #private;
}
import Vector2 = require("./vector2");
import Matrix = require("./matrix");
//# sourceMappingURL=transformation.d.ts.map