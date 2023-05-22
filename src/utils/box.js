/**
 * A 3d box shape.
 * Based on code from THREE.js.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\utils\game_time.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Vector3 = require("./vector3");


/**
 * A 3D box shape.
 */
class Box 
{
    /**
     * Create the 3d box.
     * @param {Vector3} min Box min vector.
     * @param {Vector3} max Box max vector.
     */
	constructor( min = new Vector3( + Infinity, + Infinity, + Infinity ), max = new Vector3( - Infinity, - Infinity, - Infinity ) ) 
    {
		this.min = min;
		this.max = max;
	}

    /**
     * Set the box min and max corners.
     * @param {Vector3} min Box min vector.
     * @param {Vector3} max Box max vector.
     * @returns {Box} Self.
     */
	set(min, max) 
    {
		this.min.copy( min );
		this.max.copy( max );
		return this;
	}

    /**
     * Set box values from array.
     * @param {Array<Number>} array Array of values to load from.
     * @returns {Box} Self.
     */
	setFromArray( array ) 
    {
		this.makeEmpty();
		for ( let i = 0, il = array.length; i < il; i += 3 ) {
			this.expandByPoint( _vector.fromArray( array, i ) );
		}
		return this;
	}

    /**
     * Set box from array of points.
     * @param {Array<Vector3>} points Points to set box from.
     * @returns {Box} Self.
     */
	setFromPoints( points ) 
    {
		this.makeEmpty();
		for ( let i = 0, il = points.length; i < il; i ++ ) {
			this.expandByPoint( points[i] );
		}
		return this;
	}

    /**
     * Set box from center and size.
     * @param {Vector3} center Center position.
     * @param {Vector3} size Box size.
     * @returns {Box} Self.
     */
	setFromCenterAndSize( center, size ) 
    {
		const halfSize = size.mul(0.5);
		this.min.copy( center.sub( halfSize ));
		this.max.copy( center.add( halfSize ));
		return this;
	}

    /**
     * Clone this box.
     * @returns {Box} Cloned box.
     */
	clone() 
    {
		return new this.constructor().copy(this);
	}

    /**
     * Copy values from another box.
     * @param {Box} box Box to copy.
     * @returns {Box} Self.
     */
	copy( box ) 
    {
		this.min.copy( box.min );
		this.max.copy( box.max );
		return this;
	}

    /**
     * Turn this box into empty state.
     * @returns {Box} Self.
     */
	makeEmpty() 
    {
		this.min.x = this.min.y = this.min.z = + Infinity;
		this.max.x = this.max.y = this.max.z = - Infinity;
		return this;
	}

    /**
     * Check if this box is empty.
     * @returns {Boolean} True if empty.
     */
	isEmpty() 
    {
		// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
		return ( this.max.x < this.min.x ) || ( this.max.y < this.min.y ) || ( this.max.z < this.min.z );

	}

    /**
     * Get center position.
     * @returns {Vector3} Center position.
     */
	getCenter()
    {
		return this.isEmpty() ? Vector3.zero() : this.min.add(this.max).mulSelf(0.5);
	}

    /**
     * Get box size.
     * @returns {Vector3} Box size.
     */
	getSize(target) {

		return this.isEmpty() ? Vector3.zero() : this.max.sub(this.min);

	}

    /**
     * Expand this box by a point.
     * This will adjust the box boundaries to contain the point.
     * @param {Vector3} point Point to extend box by.
     * @returns {Box} Self.
     */
	expandByPoint( point ) 
    {
		this.min.minSelf(point);
		this.max.maxSelf(point);
		return this;
	}

    /**
     * Expand this box by pushing its boundaries by a vector.
     * This will adjust the box boundaries by pushing them away from the center by the value of the given vector.
     * @param {Vector3} vector Vector to expand by.
     * @returns {Box} Self.
     */
	expandByVector( vector ) 
    {
		this.min.subSelf(vector);
		this.max.addSelf(vector);
		return this;
	}

    /**
     * Expand this box by pushing its boundaries by a given scalar.
     * This will adjust the box boundaries by pushing them away from the center by the value of the given scalar.
     * @param {Number} scalar Value to expand by.
     * @returns {Box} Self.
     */
	expandByScalar(scalar) 
    {
		this.min.subSelf(scalar);
		this.max.addSelf(scalar);
		return this;
	}

    /**
     * Check if this box contains a point.
     * @param {Vector3} point Point to check.
     * @returns {Boolean} True if box containing the point.
     */
	containsPoint( point ) 
    {
		return point.x < this.min.x || point.x > this.max.x ||
			point.y < this.min.y || point.y > this.max.y ||
			point.z < this.min.z || point.z > this.max.z ? false : true;
	}

    /**
     * Check if this box contains another box.
     * @param {Box} box Box to check.
     * @returns {Boolean} True if box containing the box.
     */
	containsBox( box ) 
    {
		return this.min.x <= box.min.x && box.max.x <= this.max.x &&
			this.min.y <= box.min.y && box.max.y <= this.max.y &&
			this.min.z <= box.min.z && box.max.z <= this.max.z;
	}

    /**
     * Check if this box collides with another box.
     * @param {Box} box Box to test collidion with.
     * @returns {Boolean} True if collide, false otherwise.
     */
	collideBox(box) 
    {
		// using 6 splitting planes to rule out intersections.
		return box.max.x < this.min.x || box.min.x > this.max.x ||
			box.max.y < this.min.y || box.min.y > this.max.y ||
			box.max.z < this.min.z || box.min.z > this.max.z ? false : true;
	}

    /**
     * Check if this box collides with a sphere.
     * @param {Sphere} sphere Sphere to test collidion with.
     * @returns {Boolean} True if collide, false otherwise.
     */
	collideSphere(sphere) 
    {
		// find the point on the AABB closest to the sphere center.
		const clamped = this.clampPoint(sphere.center);

		// if that point is inside the sphere, the AABB and sphere intersect.
		return clamped.distanceToSquared(sphere.center) <= (sphere.radius * sphere.radius);

	}

    /**
     * Check if this box collides with a plane.
     * @param {Plane} plane Plane to test collidion with.
     * @returns {Boolean} True if collide, false otherwise.
     */
	collidePlane(plane) 
    {
		// We compute the minimum and maximum dot product values. If those values
		// are on the same side (back or front) of the plane, then there is no intersection.

		let min, max;

		if ( plane.normal.x > 0 ) {

			min = plane.normal.x * this.min.x;
			max = plane.normal.x * this.max.x;

		} else {

			min = plane.normal.x * this.max.x;
			max = plane.normal.x * this.min.x;

		}

		if ( plane.normal.y > 0 ) {

			min += plane.normal.y * this.min.y;
			max += plane.normal.y * this.max.y;

		} else {

			min += plane.normal.y * this.max.y;
			max += plane.normal.y * this.min.y;

		}

		if ( plane.normal.z > 0 ) {

			min += plane.normal.z * this.min.z;
			max += plane.normal.z * this.max.z;

		} else {

			min += plane.normal.z * this.max.z;
			max += plane.normal.z * this.min.z;

		}

		return ( min <= - plane.constant && max >= - plane.constant );
	}

    /**
     * Clamp a given vector inside this box.
     * @param {Vector3} point Vector to clamp.
     * @returns {Vector3} Vector clammped.
     */
	clampPoint( point ) 
    {
		return point.clampSelf(this.min, this.max);
	}

    /**
     * Get distance between this box and a given point.
     * @param {Vector3} point Point to get distance to.
     * @returns {Number} Distance to point.
     */
	distanceToPoint( point ) 
    {
		return point.clamp(this.min, this.max).distanceTo(point);
	}

    /**
     * Computes the intersection of this box with another box. 
     * This will set the upper bound of this box to the lesser of the two boxes' upper bounds and the lower bound of this box to the greater of the two boxes' lower bounds. 
     * If there's no overlap, makes this box empty.
     * @param {Box} box Box to intersect with.
     * @returns {Box} Self.
     */
	intersectWith( box ) {

		this.min.max( box.min );
		this.max.min( box.max );

		// ensure that if there is no overlap, the result is fully empty, not slightly empty with non-inf/+inf values that will cause subsequence intersects to erroneously return valid values.
		if ( this.isEmpty() ) this.makeEmpty();

		return this;
	}

    /**
     * Computes the union of this box and box.
     * This will set the upper bound of this box to the greater of the two boxes' upper bounds and the lower bound of this box to the lesser of the two boxes' lower bounds.
     * @param {Box} box Box to union with.
     * @returns {Box} Self.
     */
	unionWith( box ) 
    {
		this.min.min( box.min );
		this.max.max( box.max );
		return this;
	}


    /**
     * Move this box.
     * @param {Vector3} offset Offset to move box by.
     * @returns {Box} Self.
     */
	translate( offset ) 
    {
		this.min.add( offset );
		this.max.add( offset );
		return this;
	}

    /**
     * Check if equal to another box.
     * @param {Box} other Other box to compare to.
     * @returns {Boolean} True if boxes are equal, false otherwise.
     */
	equals( box ) 
    {
		return box.min.equals( this.min ) && box.max.equals( this.max );
	}
}

const _vector = /*@__PURE__*/ new Vector3();

const _testAxis = /*@__PURE__*/ new Vector3();


// export the box object
module.exports = Box;