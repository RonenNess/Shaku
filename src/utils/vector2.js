/**
 * Implement a simple 2d vector.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\utils\vector2.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

const MathHelper = require("./math_helper");

/**
 * A simple Vector object for 2d positions.
 */
class Vector2
{
    /**
     * Create the Vector object.
     * @param {number} x Vector X.
     * @param {number} y Vector Y.
     */
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }
    
    /**
     * Clone the vector.
     * @returns {Vector2} cloned vector.
     */
    clone()
    {
        return new Vector2(this.x, this.y);
    }
    
    /**
     * Set vector value.
     * @param {Number} x X component.
     * @param {Number} y Y component.
     * @returns {Vector2} this.
     */
    set(x, y)
    {
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * Copy values from other vector into self.
     * @returns {Vector2} this.
     */
    copy(other) 
    {
        this.x = other.x;
        this.y = other.y;
        return this;
    }
    
    /**
     * Return a new vector of this + other.
     * @param {Number|Vector2} Other Vector3 or number to add to all components.
     * @returns {Vector2} result vector.
     */
    add(other) 
    {
        if (typeof other === 'number') {
            return new Vector2(this.x + other, this.y + (arguments[1] === undefined ? other : arguments[1]));
        }
        return new Vector2(this.x + other.x, this.y + other.y);
    }
    
    /**
     * Return a new vector of this - other.
     * @param {Number|Vector2} Other Vector3 or number to sub from all components.
     * @returns {Vector2} result vector.
     */
    sub(other) 
    {
        if (typeof other === 'number') {
            return new Vector2(this.x - other, this.y - (arguments[1] === undefined ? other : arguments[1]));
        }
        return new Vector2(this.x - other.x, this.y - other.y);
    }
    
    /**
     * Return a new vector of this / other.
     * @param {Number|Vector2} Other Vector3 or number to divide by all components.
     * @returns {Vector2} result vector.
     */
    div(other) 
    {
        if (typeof other === 'number') {
            return new Vector2(this.x / other, this.y / (arguments[1] === undefined ? other : arguments[1]));
        }
        return new Vector2(this.x / other.x, this.y / other.y);
    }
    
    /**
     * Return a new vector of this * other.
     * @param {Number|Vector2} Other Vector2 or number to multiply with all components.
     * @returns {Vector2} result vector.
     */
    mul(other) 
    {
        if (typeof other === 'number') {
            return new Vector2(this.x * other, this.y * (arguments[1] === undefined ? other : arguments[1]));
        }
        return new Vector2(this.x * other.x, this.y * other.y);
    }
    
    /**
     * Return a round copy of this vector.
     * @returns {Vector2} result vector.
     */
    round() 
    {
        return new Vector2(Math.round(this.x), Math.round(this.y));
    }
    
    /**
     * Return a floored copy of this vector.
     * @returns {Vector2} result vector.
     */
    floor() 
    {
        return new Vector2(Math.floor(this.x), Math.floor(this.y));
    }
        
    /**
     * Return a ceiled copy of this vector.
     * @returns {Vector2} result vector.
     */
    ceil() 
    {
        return new Vector2(Math.ceil(this.x), Math.ceil(this.y));
    }
    
    /**
     * Set self values to be min values between self and a given vector.
     * @param {Vector2} v Vector to min with.
     * @returns {Vector2} Self.
     */
    minSelf(v) 
    {
		this.x = Math.min( this.x, v.x );
		this.y = Math.min( this.y, v.y );
    	return this;
	}

    /**
     * Set self values to be max values between self and a given vector.
     * @param {Vector2} v Vector to max with.
     * @returns {Vector2} Self.
     */
	maxSelf(v) 
    {
		this.x = Math.max( this.x, v.x );
		this.y = Math.max( this.y, v.y );
		return this;
	}

    /**
     * Create a clone vector that is the min result between self and a given vector.
     * @param {Vector2} v Vector to min with.
     * @returns {Vector2} Result vector.
     */
    min(v) 
    {
		this.clone().minSelf(v);
	}

    /**
     * Create a clone vector that is the max result between self and a given vector.
     * @param {Vector2} v Vector to max with.
     * @returns {Vector2} Result vector.
     */
    max(v) 
    {
		this.clone().maxSelf(v);
	}

    /**
     * Return a normalized copy of this vector.
     * @returns {Vector2} result vector.
     */
    normalized()
    {
        if (this.x == 0 && this.y == 0) { return Vector2.zero(); }
        let mag = this.length();
        return new Vector2(this.x / mag, this.y / mag);
    }

    /**
     * Get a copy of this vector rotated by radians.
     * @param {Number} radians Radians to rotate by. 
     * @returns {Vector2} New vector with the length of this vector and direction rotated by given radians.
     */
    rotatedByRadians(radians)
    {
        return Vector2.fromRadians(this.getRadians() + radians).mulSelf(this.length());
    }

    /**
     * Get a copy of this vector rotated by degrees.
     * @param {Number} degrees Degrees to rotate by. 
     * @returns {Vector2} New vector with the length of this vector and direction rotated by given degrees.
     */
    rotatedByDegrees(degrees)
    {
        return Vector2.fromDegrees(this.getDegrees() + degrees).mulSelf(this.length());
    }
    
    /**
     * Add other vector values to self.
     * @param {Number|Vector2} Other Vector or number to add.
     * @returns {Vector2} this.
     */
    addSelf(other) 
    {
        if (typeof other === 'number') {
            this.x += other;
            this.y += (arguments[1] === undefined ? other : arguments[1]);
        }
        else {
            this.x += other.x;
            this.y += other.y;
        }
        return this;
    }

    /**
     * Sub other vector values from self.
     * @param {Number|Vector2} Other Vector or number to substract.
     * @returns {Vector2} this.
     */
    subSelf(other) 
    {
        if (typeof other === 'number') {
            this.x -= other;
            this.y -= (arguments[1] === undefined ? other : arguments[1]);
        }
        else {
            this.x -= other.x;
            this.y -= other.y;
        }
        return this;
    }
    
    /**
     * Divide this vector by other vector values.
     * @param {Number|Vector2} Other Vector or number to divide by.
     * @returns {Vector2} this.
     */
    divSelf(other) 
    {
        if (typeof other === 'number') {
            this.x /= other;
            this.y /= (arguments[1] === undefined ? other : arguments[1]);
        }
        else {
            this.x /= other.x;
            this.y /= other.y;
        }
        return this;
    }

    /**
     * Multiply this vector by other vector values.
     * @param {Number|Vector2} Other Vector or number to multiply by.
     * @returns {Vector2} this.
     */
    mulSelf(other) 
    {
        if (typeof other === 'number') {
            this.x *= other;
            this.y *= (arguments[1] === undefined ? other : arguments[1]);
        }
        else {
            this.x *= other.x;
            this.y *= other.y;
        }
        return this;
    }
    
    /**
     * Round self.
     * @returns {Vector2} this.
     */
    roundSelf() 
    {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }
    
    /**
     * Floor self.
     * @returns {Vector2} this.
     */
    floorSelf() 
    {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }
     
    /**
     * Ceil self.
     * @returns {Vector2} this.
     */
    ceilSelf() 
    {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }

    /**
     * Return a normalized copy of this vector.
     * @returns {Vector2} this.
     */
    normalizeSelf()
    {
        if (this.x == 0 && this.y == 0) { return this; }
        let mag = this.length();
        this.x /= mag;
        this.y /= mag;
        return this;
    }
    
    /**
     * Return if vector equals another vector.
     * @param {Vector2} other Other vector to compare to.
     * @returns {Boolean} if vectors are equal.
     */
    equals(other)
    {
        return ((this === other) || ((other.constructor === this.constructor) && this.x === other.x && this.y === other.y));
    }
    
    /**
     * Return if vector approximately equals another vector.
     * @param {Vector2} other Other vector to compare to.
     * @param {Number} threshold Distance threshold to consider as equal. Defaults to 1.
     * @returns {Boolean} if vectors are equal.
     */
    approximate(other, threshold)
    {
        threshold = threshold || 1;
        return ((this === other) || 
                (
                 (Math.abs(this.x - other.x) <= threshold) && 
                 (Math.abs(this.y - other.y) <= threshold))
                );
    }

    /**
     * Return vector length (aka magnitude).
     * @returns {Number} Vector length.
     */
    length()
    {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    /**
     * Return a copy of this vector multiplied by a factor.
     * @returns {Vector2} result vector.
     */
    scaled(fac) 
    {
        return new Vector2(this.x * fac, this.y * fac);
    }

    /**
     * Get vector (0,0).
     * @returns {Vector2} result vector.
     */
    static zero()
    {
        return new Vector2(0, 0);
    }

    /**
     * Get vector with 1,1 values.
     * @returns {Vector2} result vector.
     */
    static one()
    {
        return new Vector2(1, 1);
    }

    /**
     * Get vector with 0.5,0.5 values.
     * @returns {Vector2} result vector.
     */
    static half()
    {
        return new Vector2(0.5, 0.5);
    }

    /**
     * Get vector with -1,0 values.
     * @returns {Vector2} result vector.
     */
    static left()
    {
        return new Vector2(-1, 0);
    }

    /**
     * Get vector with 1,0 values.
     * @returns {Vector2} result vector.
     */
    static right()
    {
        return new Vector2(1, 0);
    }

    /**
     * Get vector with 0,-1 values.
     * @returns {Vector2} result vector.
     */
    static up()
    {
        return new Vector2(0, -1);
    }

    /**
     * Get vector with 0,1 values.
     * @returns {Vector2} result vector.
     */
    static down()
    {
        return new Vector2(0, 1);
    }

    /**
     * Get a random vector with length of 1.
     * @returns {Vector2} result vector.
     */
    static random()
    {
        return Vector2.fromDegrees(Math.random() * 360);
    }

    /**
     * Get degrees between this vector and another vector.
     * @param {Vector2} other Other vector.
     * @returns {Number} Angle between vectors in degrees.
     */
    degreesTo(other) 
    {
        return Vector2.degreesBetween(this, other);
    };

    /**
     * Get radians between this vector and another vector.
     * @param {Vector2} other Other vector.
     * @returns {Number} Angle between vectors in radians.
     */
    radiansTo(other) 
    {
        return Vector2.radiansBetween(this, other);
    };
    
    /**
     * Get degrees between this vector and another vector.
     * Return values between 0 to 360.
     * @param {Vector2} other Other vector.
     * @returns {Number} Angle between vectors in degrees.
     */
    wrappedDegreesTo(other) 
    {
        return Vector2.wrappedDegreesBetween(this, other);
    };

    /**
     * Get radians between this vector and another vector.
     * Return values between 0 to PI2.
     * @param {Vector2} other Other vector.
     * @returns {Number} Angle between vectors in radians.
     */
    wrappedRadiansTo(other) 
    {
        return Vector2.wrappedRadiansBetween(this, other);
    };
    
    /**
     * Calculate distance between this vector and another vectors.
     * @param {Vector2} other Other vector.
     * @returns {Number} Distance between vectors.
     */
    distanceTo(other)
    {
        return Vector2.distance(this, other);
    }
    
    /**
     * Calculate squared distance between this vector and another vector.
     * @param {Vector2} other Other vector.
     * @returns {Number} Distance between vectors.
     */
    distanceToSquared(other)
    {
		const dx = this.x - other.x, dy = this.y - other.y;
		return dx * dx + dy * dy;
	}

    /**
     * Return a clone and clamp its values to be between min and max.
     * @param {Vector2} min Min vector.
     * @param {Vector2} max Max vector.
     * @returns {Vector2} Clamped vector.
     */
    clamp( min, max ) 
    {
        return this.clone().clampSelf(min, max);
    }

    /**
     * Clamp this vector values to be between min and max.
     * @param {Vector2} min Min vector.
     * @param {Vector2} max Max vector.
     * @returns {Vector2} Self.
     */
    clampSelf( min, max ) 
    {
		this.x = Math.max( min.x, Math.min( max.x, this.x ) );
		this.y = Math.max( min.y, Math.min( max.y, this.y ) );
		return this;
	}

    /**
     * Calculate the dot product with another vector.
     * @param {Vector2} other Vector to calculate dot with.
     * @returns {Number} Dot product value.
     */
    dot(other)
    {
		return this.x * other.x + this.y * other.y;
	}

    /**
     * Get vector from degrees.
     * @param {Number} degrees Angle to create vector from (0 = vector pointing right).
     * @returns {Vector2} result vector.
     */
    static fromDegrees(degrees)
    {
        let rads = degrees * (Math.PI / 180);
        return new Vector2(Math.cos(rads), Math.sin(rads));
    }

    /**
     * Get vector from radians.
     * @param {Number} radians Angle to create vector from (0 = vector pointing right).
     * @returns {Vector2} result vector.
     */
    static fromRadians(radians)
    {
        return new Vector2(Math.cos(radians), Math.sin(radians));
    }
    
    /**
     * Lerp between two vectors.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @param {Number} a Lerp factor (0.0 - 1.0).
     * @returns {Vector2} result vector.
     */
    static lerp(p1, p2, a)
    {
        let lerpScalar = MathHelper.lerp;
        return new Vector2(lerpScalar(p1.x, p2.x, a), lerpScalar(p1.y, p2.y, a));
    }

    /**
     * Get degrees between two vectors.
     * Return values between -180 to 180.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @returns {Number} Angle between vectors in degrees.
     */
    static degreesBetween(P1, P2) 
    {
        let deltaY = P2.y - P1.y,
        deltaX = P2.x - P1.x;
        return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    };

    /**
     * Get radians between two vectors.
     * Return values between -PI to PI.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @returns {Number} Angle between vectors in radians.
     */
    static radiansBetween(P1, P2) 
    {
        return MathHelper.toRadians(Vector2.degreesBetween(P1, P2));
    };
    
    /**
     * Get degrees between two vectors.
     * Return values between 0 to 360.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @returns {Number} Angle between vectors in degrees.
     */
    static wrappedDegreesBetween(P1, P2) 
    {
        let temp = P2.sub(P1);
        return temp.getDegrees();
    };

    /**
     * Get vector's angle in degrees.
     * @returns {Number} Vector angle in degrees.
     */
    getDegrees()
    {
        var angle = Math.atan2(this.y, this.x);
        var degrees = 180 * angle / Math.PI;
        return (360+Math.round(degrees)) % 360;
    }

    /**
     * Get vector's angle in radians.
     * @returns {Number} Vector angle in degrees.
     */
    getRadians()
    {
        var angle = Math.atan2(this.y, this.x);
        return angle;
    }
    
    /**
     * Get radians between two vectors.
     * Return values between 0 to PI2.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @returns {Number} Angle between vectors in radians.
     */
    static wrappedRadiansBetween(P1, P2) 
    {
        return MathHelper.toRadians(Vector2.wrappedDegreesBetween(P1, P2));
    };

    /**
     * Calculate distance between two vectors.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @returns {Number} Distance between vectors.
     */
    static distance(p1, p2)
    {
        let a = p1.x - p2.x;
        let b = p1.y - p2.y;
        return Math.sqrt(a*a + b*b);
    }

    /**
     * Return cross product between two vectors.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @returns {Number} Cross between vectors.
     */
    static cross(p1, p2)
    {
        return p1.x * p2.y - p1.y * p2.x;
    }
     
    /**
     * Return dot product between two vectors.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @returns {Number} Dot between vectors.
     */
    static dot(p1, p2)
    {
        return p1.x * p2.x + p1.y * p2.y;
    }

    /**
     * Convert to string.
     */
    string()
    {
        return this.x + ',' + this.y;
    }

    /**
     * Parse and return a vector object from string in the form of "x,y".
     * @param {String} str String to parse.
     * @returns {Vector2} Parsed vector.
     */
    static parse(str)
    {
        let parts = str.split(',');
        return new Vector2(parseFloat(parts[0].trim()), parseFloat(parts[1].trim()));
    }

    /**
     * Convert to array of numbers.
     * @returns {Array<Number>} Vector components as array.
     */
    toArray()
    {
        return [this.x, this.y];
    }

    /**
     * Create vector from array of numbers.
     * @param {Array<Number>} arr Array of numbers to create vector from.
     * @returns {Vector2} Vector instance.
     */
    static fromArray(arr)
    {
        return new Vector2(arr[0], arr[1]);
    }

    /**
     * Create vector from a dictionary.
     * @param {*} data Dictionary with {x,y}.
     * @returns {Vector2} Newly created vector.
     */
    static fromDict(data)
    {
        return new Vector2(data.x || 0, data.y || 0);
    }

    /**
     * Convert to dictionary.
     * @param {Boolean} minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
     * @returns {*} Dictionary with {x,y}
     */
    toDict(minimized)
    {
        if (minimized) {
            const ret = {};
            if (this.x) { ret.x = this.x; }
            if (this.y) { ret.y = this.y; }
            return ret;
        }
        return {x: this.x, y: this.y};
    }
}

/**
 * Vector with 0,0 values as a frozen shared object.
 * Be careful not to try and change it.
 */
Vector2.zeroReadonly = new Vector2(0, 0);
Object.freeze(Vector2.zeroReadonly);

/**
 * Vector with 1,1 values as a frozen shared object.
 * Be careful not to try and change it.
 */
Vector2.oneReadonly = new Vector2(1, 1);
Object.freeze(Vector2.oneReadonly);

/**
 * Vector with 0.5,0.5 values as a frozen shared object.
 * Be careful not to try and change it.
 */
Vector2.halfReadonly = new Vector2(0.5, 0.5);
Object.freeze(Vector2.halfReadonly);

/**
 * Vector with -1,0 values as a frozen shared object.
 * Be careful not to try and change it.
 */
Vector2.leftReadonly = new Vector2(-1, 0);
Object.freeze(Vector2.leftReadonly);

/**
 * Vector with 1,0 values as a frozen shared object.
 * Be careful not to try and change it.
 */
Vector2.rightReadonly = new Vector2(1, 0);
Object.freeze(Vector2.rightReadonly);

/**
 * Vector with 0,1 values as a frozen shared object.
 * Be careful not to try and change it.
 */
Vector2.upReadonly = new Vector2(0, -1);
Object.freeze(Vector2.upReadonly);

/**
 * Vector with 0,-1 values as a frozen shared object.
 * Be careful not to try and change it.
 */
Vector2.downReadonly = new Vector2(0, 1);
Object.freeze(Vector2.downReadonly);


// export vector object
module.exports = Vector2;