/**
 * A plane in 3D space.
 * Based on code from THREE.js.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\utils\plane.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Line = require("./line");
const Sphere = require("./sphere");
const Vector3 = require("./vector3");


/**
 * A plane in 3D space shape.
 */
class Plane 
{
    /**
     * Create the plane.
     * @param {Vector3} normal Plane normal vector.
     * @param {Number} constant Plane constant.
     */
	constructor(normal = new Vector3(1, 0, 0), constant = 0)
    {
		this.normal = normal;
		this.constant = constant;
	}

    /**
     * Set the plane components.
     * @param {Vector3} normal Plane normal.
     * @param {Number} constant Plane constant.
     * @returns {Plane} Self.
     */
	set( normal, constant ) 
    {
		this.normal.copy( normal );
		this.constant = constant;
		return this;
	}

    /**
     * Set the plane components.
     * @param {Number} x Plane normal X.
     * @param {Number} y Plane normal Y.
     * @param {Number} z Plane normal Z.
     * @param {Number} w Plane constant.
     * @returns {Plane} Self.
     */
	setComponents(x, y, z, w)
    {
		this.normal.set( x, y, z );
		this.constant = w;
		return this;
	}

    /**
     * Set plane from normal and coplanar point vectors.
     * @param {Vector3} normal Plane normal.
     * @param {Vector3} point Coplanar point.
     * @returns {Plane} Self.
     */
	setFromNormalAndCoplanarPoint(normal, point) 
    {
		this.normal.copy(normal);
		this.constant = -(point.dot( this.normal ));
		return this;
	}

    /**
     * Copy values from another plane.
     * @param {Plane} plane Plane to copy.
     * @returns {Plane} Self.
     */
	copy(plane)
    {
		this.normal.copy( plane.normal );
		this.constant = plane.constant;
		return this;
	}

    /**
     * Normalize the plane.
     * @returns {Plane} self.
     */
	normalizeSelf() 
    {
		// Note: will lead to a divide by zero if the plane is invalid.
		const inverseNormalLength = 1.0 / this.normal.length();
		this.normal.mulSelf(inverseNormalLength);
		this.constant *= inverseNormalLength;
		return this;
	}

    /**
     * Normalize a clone of this plane.
     * @returns {Plane} Normalized clone.
     */
	normalized() 
    {
		return this.clone().normalizeSelf();
	}

    /**
     * Negate this plane.
     * @returns {Plane} Self.
     */
	negateSelf() 
    {
		this.constant *= -1;
		this.normal.mulSelf(-1);
		return this;
	}

    /**
     * Calculate distance to point.
     * @param {Vector3} point Point to calculate distance to.
     * @returns {Number} Distance to point.
     */
	distanceToPoint(point) 
    {
		return this.normal.dot(point) + this.constant;
	}

    /**
     * Calculate distance to sphere.
     * @param {Sphere} sphere Sphere to calculate distance to.
     * @returns {Number} Distance to sphere.
     */
	distanceToSphere(sphere) 
    {
		return this.distanceToPoint(sphere.center) - sphere.radius;
	}

    /**
     * Check if this plane collide with a line.
     * @param {Line} line Line to check.
     * @returns {Boolean} True if collide, false otherwise.
     */
	collideLine( line ) 
    {
		// Note: this tests if a line collide the plane, not whether it (or its end-points) are coplanar with it.
		const startSign = this.distanceToPoint( line.start );
		const endSign = this.distanceToPoint( line.end );
		return ( startSign < 0 && endSign > 0 ) || ( endSign < 0 && startSign > 0 );
	}

    /**
     * Check if this plane collide with a sphere.
     * @param {Sphere} sphere Sphere to check.
     * @returns {Boolean} True if collide, false otherwise.
     */
	collideSphere(sphere) 
    {
		return sphere.collidePlane( this );
	}

    /**
     * Coplanar a point.
     * @returns {Vector3} Coplanar point as a new vector.
     */
	coplanarPoint() 
    {
		return this.normal.mul(-this.constant);
	}

    /**
     * Translate this plane.
     * @param {Vector3} offset Offset to translate to.
     * @returns {Plane} Self.
     */
	translateSelf(offset) 
    {
		this.constant -= offset.dot( this.normal );
		return this;
	}

    /**
     * Check if this plane equals another plane.
     * @param {Plane} plane Other plane to compare to.
     * @returns {Boolean} True if equal, false otherwise.
     */
	equals(plane) 
    {
		return plane.normal.equals( this.normal ) && ( plane.constant === this.constant );
	}

    /**
     * Clone this plane.
     * @returns {Plane} Cloned plane.
     */
	clone() 
    {
		return new this.constructor().copy(this);
	}
}


// export the plane object
module.exports = Plane;