/**
 * Transformations object to store position, rotation and scale, that also support transformations inheritance.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\utils\transformation.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const MathHelper = require("./math_helper");
const TransformModes = require("./transform_modes");
const Matrix = require("./matrix");
const Vector2 = require("./vector2");

// some default values
const _defaults = {};
_defaults.position = Vector2.zero();
_defaults.positionMode = TransformModes.Relative;
_defaults.scale = Vector2.one();
_defaults.scaleMode = TransformModes.AxisAligned;
_defaults.rotation = 0;
_defaults.rotationMode = TransformModes.Relative;


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
class Transformation
{
    /**
     * Create the transformations.
     * @param {Vector2} position Optional position value.
     * @param {Number} rotation Optional rotation value.
     * @param {Vector2} scale Optional sscale value.
     */
    constructor(position, rotation, scale)
    {
        /**
         * @private
         * Transformation local position.
         * @name Transformation#position
         * @type {Vector2}
         */
        this._position = position || _defaults.position.clone();
        
        /**
         * @private
         * Position transformation mode.
         * @name Transformation#positionMode
         * @type {TransformModes}
         */
        this._positionMode = _defaults.positionMode;

        /**
         * @private
         * Transformation local scale.
         * @name Transformation#scale
         * @type {Vector2}
         */
        this._scale = scale || _defaults.scale.clone();

        /**
         * @private
         * Scale transformation mode.
         * @name Transformation#scaleMode
         * @type {TransformModes}
         */
        this._scaleMode = _defaults.scaleMode;

        /**
         * @private
         * Transformation local rotation.
         * @name Transformation#rotation
         * @type {Number}
         */
        this._rotation = rotation || _defaults.rotation;

        /**
         * @private
         * Rotation transformation mode.
         * @name Transformation#rotationMode
         * @type {TransformModes}
         */
        this._rotationMode = _defaults.rotationMode;

        /**
         * Method to call when this transformation change.
         * Function params: transformation instance (this), properties changed (boolean), transform modes changed (boolean).
         * @name Transformation#onChange
         * @type {Function}
         */
        this.onChange = null;
    }

    /**
     * Get position.
     * @returns {Vector2} Position.
     */
    getPosition()
    {
        return this._position.clone();
    }

    /**
     * Get position transformations mode.
     * @returns {TransformModes} Position transformation mode.
     */
    getPositionMode()
    {
        return this._positionMode;
    }

    /**
     * Set position.
     * @param {Vector2} value New position.
     * @returns {Transformation} this.
     */
    setPosition(value)
    {
        if (this._position.equals(value)) { return; }
        this._position.copy(value);
        this.#_markDirty(true, false);
        return this;
    }

    /**
     * Set position X value.
     * @param {Number} value New position.x value.
     * @returns {Transformation} this.
     */
    setPositionX(value)
    {
        if (this._position.x === value) { return; }
        this._position.x = value;
        this.#_markDirty(true, false);
        return this;
    }

    /**
     * Set position Y value.
     * @param {Number} value New position.y value.
     * @returns {Transformation} this.
     */
    setPositionY(value)
    {
        if (this._position.y === value) { return; }
        this._position.y = value;
        this.#_markDirty(true, false);
        return this;
    }

    /**
     * Move position by a given vector.
     * @param {Vector2} value Vector to move position by.
     * @returns {Transformation} this.
     */
    move(value)
    {
        this._position.addSelf(value);
        this.#_markDirty(true, false);
        return this;
    }
    
    /**
     * Set position transformations mode.
     * @param {TransformModes} value Position transformation mode.
     * @returns {Transformation} this.
     */
    setPositionMode(value)
    {
        if (this._positionMode === value) { return; }
        this._positionMode = value;
        this.#_markDirty(false, true);
        return this;
    }

    /**
     * Get scale.
     * @returns {Vector2} Scale.
     */
    getScale()
    {
        return this._scale.clone();
    }

    /**
     * Get scale transformations mode.
     * @returns {TransformModes} Scale transformation mode.
     */
    getScaleMode()
    {
        return this._scaleMode;
    }

    /**
     * Set scale.
     * @param {Vector2} value New scale.
     * @returns {Transformation} this.
     */
    setScale(value)
    {
        if (this._scale.equals(value)) { return; }
        this._scale.copy(value);
        this.#_markDirty(true, false);
        return this;
    }

    /**
     * Set scale X value.
     * @param {Number} value New scale.x value.
     * @returns {Transformation} this.
     */
    setScaleX(value)
    {
        if (this._scale.x === value) { return; }
        this._scale.x = value;
        this.#_markDirty(true, false);
        return this;
    }
    
    /**
     * Set scale Y value.
     * @param {Number} value New scale.y value.
     * @returns {Transformation} this.
     */
    setScaleY(value)
    {
        if (this._scale.y === value) { return; }
        this._scale.y = value;
        this.#_markDirty(true, false);
        return this;
    }

    /**
     * Scale by a given vector.
     * @param {Vector2} value Vector to scale by.
     * @returns {Transformation} this.
     */
    scale(value)
    {
        this._scale.mulSelf(value);
        this.#_markDirty(true, false);
        return this;
    }

    /**
     * Set scale transformations mode.
     * @param {TransformModes} value Scale transformation mode.
     * @returns {Transformation} this.
     */
    setScaleMode(value)
    {
        if (this._scaleMode === value) { return; }
        this._scaleMode = value;
        this.#_markDirty(false, true);
        return this;
    }

    /**
     * Get rotation.
     * @returns {Number} rotation.
     */
    getRotation()
    {
        return this._rotation;
    }
    
    /**
     * Get rotation as degrees.
     * @returns {Number} rotation.
     */
    getRotationDegrees()
    {
        return MathHelper.toDegrees(this._rotation);
    }

    /**
     * Get rotation as degrees, wrapped between 0 to 360.
     * @returns {Number} rotation.
     */
    getRotationDegreesWrapped()
    {
        let ret = this.getRotationDegrees();
        return MathHelper.wrapDegrees(ret);
    }

    /**
     * Get rotation transformations mode.
     * @returns {TransformModes} Rotation transformations mode.
     */
    getRotationMode()
    {
        return this._rotationMode;
    }

    /**
     * Set rotation.
     * @param {Number} value New rotation.
     * @param {Boolean} wrap If true, will wrap value if out of possible range.
     * @returns {Transformation} this.
     */
    setRotation(value, wrap)
    {
        if (this._rotation === value) { return; }
        this._rotation = value;
        if (wrap && ((this._rotation < 0) || (this._rotation > (Math.PI * 2)))) {
            this._rotation = Math.atan2(Math.sin(this._rotation), Math.cos(this._rotation));
        }
        this.#_markDirty(true, false);
        return this;
    }

    /**
     * Rotate transformation by given radians.
     * @param {Number} value Rotate value in radians.
     * @param {Boolean} wrap If true, will wrap value if out of possible range.
     * @returns {Transformation} this.
     */
    rotate(value, wrap)
    {
        this.setRotation(this._rotation + value, wrap);
        return this;
    }

    /**
     * Set rotation as degrees.
     * @param {Number} value New rotation.
     * @param {Boolean} wrap If true, will wrap value if out of possible range.
     * @returns {Transformation} this.
     */
    setRotationDegrees(value, wrap)
    {
        const rads = MathHelper.toRadians(value, wrap);
        return this.setRotation(rads);
    }

    /**
     * Rotate transformation by given degrees.
     * @param {Number} value Rotate value in degrees.
     * @returns {Transformation} this.
     */
    rotateDegrees(value)
    {
        this._rotation += MathHelper.toRadians(value);
        this.#_markDirty(true, false);
        return this;
    }
        
    /**
     * Set rotation transformations mode.
     * @param {TransformModes} value Rotation transformation mode.
     * @returns {Transformation} this.
     */
    setRotationMode(value)
    {
        if (this._rotationMode === value) { return; }
        this._rotationMode = value;
        this.#_markDirty(false, true);
        return this;
    }

    /**
     * Notify about changes in values.
     * @param {Boolean} localTransform Local transformations changed. 
     * @param {Boolean} transformationModes Transformation modes changed.
     */
    #_markDirty(localTransform, transformationModes)
    {
        this._matrix = null;
        if (this.onChange) {
            this.onChange(this, localTransform, transformationModes);
        }
    }
    
    /**
     * Check if this transformation equals another.
     * @param {Transformation} other Other transform to compare to.
     * @returns {Boolean} True if equal, false otherwise.
     */
    equals(other)
    {
        return  (this._rotation === other._rotation) && 
                (this._position.equals(other._position)) && 
                (this._scale.equals(other._scale));
    }

    /**
     * Return a clone of this transformations.
     * @returns {Transformation} Cloned transformations.
     */
    clone()
    {
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
    serialize()
    {
        const ret = {};

        // position + mode
        if (!this._position.equals(_defaults.position)) {
            ret.pos = this._position;
        }
        if (this._positionMode !== _defaults.positionMode) {
            ret.posm = this._positionMode;
        }

        // scale + mode
        if (!this._scale.equals(_defaults.scale)) {
            ret.scl = this._scale;
        }
        if (this._scaleMode !== _defaults.scaleMode) {
            ret.sclm = this._scaleMode;
        }

        // rotation + mode
        if (this._rotation !== _defaults.rotation) {
            ret.rot = Math.floor(MathHelper.toDegrees(this._rotation));
        }
        if (this._rotationMode !== _defaults.rotationMode) {
            ret.rotm = this._rotationMode;
        }

        return ret;
    }

    /**
     * Deserialize this transformation from a dictionary.
     * @param {*} data Data to set.
     */
    deserialize(data)
    {
        this._position.copy(data.pos || _defaults.position);
        this._scale.copy(data.scl || _defaults.scale);
        this._rotation = MathHelper.toRadians(data.rot || _defaults.rotation);
        this._positionMode = data.posm || _defaults.positionMode;
        this._scaleMode = data.sclm || _defaults.scaleMode;
        this._rotationMode = data.rotm || _defaults.rotationMode;
        this.#_markDirty(true, true);
    }
    
    /**
     * Create and return a transformation matrix.
     * @returns {Matrix} New transformation matrix.
     */
    asMatrix()
    {
        // return cached
        if (this._matrix) {
            return this._matrix;
        }

        // get matrix type and create list of matrices to combine
        let matrices = [];

        // apply position
        if ((this._position.x !== 0) || (this._position.y !== 0)) 
        { 
            matrices.push(Matrix.createTranslation(this._position.x, this._position.y, 0));
        }
        
        // apply rotation
        if (this._rotation) 
        { 
            matrices.push(Matrix.createRotationZ(-this._rotation));
        }
        
        // apply scale
        if ((this._scale.x !== 1) || (this._scale.y !== 1)) 
        { 
            matrices.push(Matrix.createScale(this._scale.x, this._scale.y));
        }

        // no transformations? identity matrix
        if (matrices.length === 0) { 
            this._matrix = Matrix.identity; 
        }
        // only one transformation? return it
        else if (matrices.length === 1) { 
            this._matrix = matrices[0]; 
        }
        // more than one transformation? combine matrices
        else { 
            this._matrix = Matrix.multiplyMany(matrices); 
        }

        // return matrix
        return this._matrix;
    }

    /**
     * Combine child transformations with parent transformations.
     * @param {Transformation} child Child transformations.
     * @param {Transformation} parent Parent transformations.
     * @returns {Transformation} Combined transformations.
     */
    static combine(child, parent)
    {
        var position = combineVector(child._position, parent._position, parent, child._positionMode);
        var scale = combineVectorMul(child._scale, parent._scale, parent, child._scaleMode);
        var rotation = combineScalar(child._rotation, parent._rotation, parent, child._rotationMode);
        return new Transformation(position, rotation, scale);
    }
}


/**
 * Combine child scalar value with parent using a transformation mode.
 * @param {Number} childValue Child value. 
 * @param {Number} parentValue Parent value.
 * @param {Transformation} parent Parent transformations.
 * @param {TransformModes} mode Transformation mode. 
 * @returns {Number} Combined value.
 */
function combineScalar(childValue, parentValue, parent, mode)
{
    switch (mode)
    {
        case TransformModes.Absolute:
            return childValue;

        case TransformModes.AxisAligned:
        case TransformModes.Relative:
            return parentValue + childValue;

        default:
            throw new Error("Unknown transform mode!");
    }
}


/**
 * Combine child vector value with parent using a transformation mode.
 * @param {Vector2} childValue Child value. 
 * @param {Vector2} parentValue Parent value.
 * @param {Transformation} parent Parent transformations.
 * @param {TransformModes} mode Transformation mode.
 * @returns {Vector2} Combined value.
 */
function combineVector(childValue, parentValue, parent, mode)
{
    switch (mode)
    {
        case TransformModes.Absolute:
            return childValue.clone();

        case TransformModes.AxisAligned:
            return parentValue.add(childValue);

        case TransformModes.Relative:
            return parentValue.add(childValue.rotatedByRadians(parent._rotation));

        default:
            throw new Error("Unknown transform mode!");
    }
}


/**
 * Combine child vector value with parent using a transformation mode and multiplication.
 * @param {Vector2} childValue Child value. 
 * @param {Vector2} parentValue Parent value.
 * @param {Transformation} parent Parent transformations.
 * @param {TransformModes} mode Transformation mode.
 * @returns {Vector2} Combined value.
 */
function combineVectorMul(childValue, parentValue, parent, mode)
{
    switch (mode)
    {
        case TransformModes.Absolute:
            return childValue.clone();

        case TransformModes.AxisAligned:
            return parentValue.mul(childValue);

        case TransformModes.Relative:
            return parentValue.mul(childValue.rotatedByRadians(parent._rotation));

        default:
            throw new Error("Unknown transform mode!");
    }
}


// export the transformation object
module.exports = Transformation;