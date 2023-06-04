/**
 * A ray in 3D space.
 * Based on code from THREE.js.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\utils\ray.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Vector3 = require("./vector3");


/**
 * A 3D ray.
 */
class Ray 
{
  /**
   * Create the Ray.
   * @param {Vector3} origin Ray origin point.
   * @param {Vector3} direction Ray 3d direction.
   */
	constructor(origin, direction)
  {
		this.origin = origin.clone();
		this.direction = direction.clone();
	}

  /**
   * Set the ray components.
   * @param {Vector3} origin Ray origin point.
   * @param {Vector3} direction Ray 3d direction.
   * @returns {Plane} Self.
   */
	set( origin, direction ) 
  {
		this.origin.copy( origin );
		this.direction.copy( direction );
		return this;
	}

  /**
   * Copy values from another ray.
   * @param {Ray} ray Ray to copy.
   * @returns {Ray} Self.
   */
	copy(ray)
  {
		this.set(ray.origin, ray.direction);
		return this;
	}

  /**
   * Check if this ray equals another ray.
   * @param {Ray} ray Other ray to compare to.
   * @returns {Boolean} True if equal, false otherwise.
   */
	equals(ray) 
  {
		return ray.origin.equals( this.origin ) && ray.direction.equals( this.direction ) ;
	}

  /**
   * Get the 3d point on the ray by distance from origin.
   * @param {Number} distance Distance from origin to travel.
   * @returns {Vector3} Point on ray from origin.
   */
  at(distance) 
  {
    return this.origin.add(this.direction.mul(distance));
	}

  /**
   * Calculate distance to a 3d point.
   * @param {Vector3} point Point to calculate distance to.
   * @returns {Number} Distance to point.
   */
	distanceToPoint(point) 
  {
		return Math.sqrt( this.distanceToPointSquared( point ) );
	}

  /**
   * Calculate squared distance to a 3d point.
   * @param {Vector3} point Point to calculate distance to.
   * @returns {Number} Squared distance to point.
   */
	distanceToPointSquared(point) 
  {
		const directionDistance = point.sub(this.origin ).dot(this.direction);

		// point behind the ray
		if ( directionDistance < 0 ) {
			return this.origin.distanceToSquared( point );
		}

		const v = this.origin.add( this.direction.mul(directionDistance) );
		return v.distanceToSquared(point);
	}

  /**
   * Check if this ray collides with a sphere.
   * @param {Sphere} sphere Sphere to test collision with.
   * @returns {Boolean} True if collide with sphere, false otherwise.
   */
	collideSphere(sphere) 
  {
	  return this.distanceToPointSquared(sphere.center) <= (sphere.radius * sphere.radius);
	}

  /**
   * Check if this ray collides with a box.
   * @param {Box} box Box to test collision with.
   * @returns {Boolean} True if collide with box, false otherwise.
   */
  collideBox(box)
  {
    return Boolean(this.findColliionPointWithBox(box));
  }

  /**
   * Return the collision point between the ray and a box, or null if they don't collide.
   * @param {Box} box Box to get collision with.
   * @returns {Vector3|null} Collision point or null.
   */
  findColliionPointWithBox( box ) 
  {

		let tmin, tmax, tymin, tymax, tzmin, tzmax;

		const invdirx = 1 / this.direction.x,
			invdiry = 1 / this.direction.y,
			invdirz = 1 / this.direction.z;

		const origin = this.origin;

		if ( invdirx >= 0 ) {

			tmin = ( box.min.x - origin.x ) * invdirx;
			tmax = ( box.max.x - origin.x ) * invdirx;

		} else {

			tmin = ( box.max.x - origin.x ) * invdirx;
			tmax = ( box.min.x - origin.x ) * invdirx;

		}

		if ( invdiry >= 0 ) {

			tymin = ( box.min.y - origin.y ) * invdiry;
			tymax = ( box.max.y - origin.y ) * invdiry;

		} else {

			tymin = ( box.max.y - origin.y ) * invdiry;
			tymax = ( box.min.y - origin.y ) * invdiry;

		}

		if ( ( tmin > tymax ) || ( tymin > tmax ) ) return null;

		if ( tymin > tmin || isNaN( tmin ) ) tmin = tymin;

		if ( tymax < tmax || isNaN( tmax ) ) tmax = tymax;

		if ( invdirz >= 0 ) {

			tzmin = ( box.min.z - origin.z ) * invdirz;
			tzmax = ( box.max.z - origin.z ) * invdirz;

		} else {

			tzmin = ( box.max.z - origin.z ) * invdirz;
			tzmax = ( box.min.z - origin.z ) * invdirz;

		}

		if ( ( tmin > tzmax ) || ( tzmin > tmax ) ) return null;

		if ( tzmin > tmin || tmin !== tmin ) tmin = tzmin;

		if ( tzmax < tmax || tmax !== tmax ) tmax = tzmax;

		//return point closest to the ray (positive side)

		if ( tmax < 0 ) { 
      return null;
    }

    // return position
		return this.at(tmin >= 0 ? tmin : tmax);
	}

  /**
   * Clone this ray.
   * @returns {Ray} Cloned ray.
   */
	clone() 
  {
		return new Ray(this.origin, this.direction);
	}
}


// export the ray object
module.exports = Ray;