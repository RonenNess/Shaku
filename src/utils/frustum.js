/**
 * A 3d frustum shape.
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
const Plane = require("./plane");
const Matrix = require("./matrix");
const Vector3 = require("./vector3");
const Box = require("./box");


/**
 * Implement a 3D Frustum shape.
 */
class Frustum 
{
    /**
     * Create the frustum.
     * @param {Plane} p0 Frustum plane.
     * @param {Plane} p1 Frustum plane. 
     * @param {Plane} p2 Frustum plane. 
     * @param {Plane} p3 Frustum plane. 
     * @param {Plane} p4 Frustum plane. 
     * @param {Plane} p5 Frustum plane. 
     */
	constructor( p0 = new Plane(), p1 = new Plane(), p2 = new Plane(), p3 = new Plane(), p4 = new Plane(), p5 = new Plane() ) 
    {
		this.planes = [ p0, p1, p2, p3, p4, p5 ];
	}

    /**
     * Set the Frustum values.
     * @param {Plane} p0 Frustum plane.
     * @param {Plane} p1 Frustum plane. 
     * @param {Plane} p2 Frustum plane. 
     * @param {Plane} p3 Frustum plane. 
     * @param {Plane} p4 Frustum plane. 
     * @param {Plane} p5 Frustum plane. 
     * @returns {Frustum} Self.
     */
	set( p0, p1, p2, p3, p4, p5 ) 
    {
		const planes = this.planes;
		planes[ 0 ].copy( p0 );
		planes[ 1 ].copy( p1 );
		planes[ 2 ].copy( p2 );
		planes[ 3 ].copy( p3 );
		planes[ 4 ].copy( p4 );
		planes[ 5 ].copy( p5 );
		return this;
	}

    /**
     * Copy values from another frustum.
     * @param {Frustum} frustum Frustum to copy.
     * @returns {Frustum} Self.
     */
	copy(frustum)
    {
		const planes = this.planes;
		for ( let i = 0; i < 6; i ++ ) {
			planes[ i ].copy( frustum.planes[ i ] );
		}
		return this;
	}

    /**
     * Set frustum from projection matrix.
     * @param {Matrix} m Matrix to build frustum from.
     * @returns {Frustum} Self.
     */
	setFromProjectionMatrix( m ) 
    {
		const planes = this.planes;
		const me = m.values;
		const me0 = me[ 0 ], me1 = me[ 1 ], me2 = me[ 2 ], me3 = me[ 3 ];
		const me4 = me[ 4 ], me5 = me[ 5 ], me6 = me[ 6 ], me7 = me[ 7 ];
		const me8 = me[ 8 ], me9 = me[ 9 ], me10 = me[ 10 ], me11 = me[ 11 ];
		const me12 = me[ 12 ], me13 = me[ 13 ], me14 = me[ 14 ], me15 = me[ 15 ];

		planes[ 0 ].setComponents( me3 - me0, me7 - me4, me11 - me8, me15 - me12 ).normalizeSelf();
		planes[ 1 ].setComponents( me3 + me0, me7 + me4, me11 + me8, me15 + me12 ).normalizeSelf();
		planes[ 2 ].setComponents( me3 + me1, me7 + me5, me11 + me9, me15 + me13 ).normalizeSelf();
		planes[ 3 ].setComponents( me3 - me1, me7 - me5, me11 - me9, me15 - me13 ).normalizeSelf();
		planes[ 4 ].setComponents( me3 - me2, me7 - me6, me11 - me10, me15 - me14 ).normalizeSelf();
		planes[ 5 ].setComponents( me3 + me2, me7 + me6, me11 + me10, me15 + me14 ).normalizeSelf();

		return this;
	}

    /**
     * Check if the frustum collides with a sphere.
     * @param {Sphere} sphere Sphere to check.
     * @returns {Boolean} True if point is in frustum, false otherwise.
     */
	collideSphere(sphere) 
    {
		const planes = this.planes;
		const center = sphere.center;
		const negRadius = - sphere.radius;
		for ( let i = 0; i < 6; i ++ ) {
			const distance = planes[ i ].distanceToPoint( center );
			if ( distance < negRadius ) {
				return false;
			}
		}
		return true;
	}

    /**
     * Check if collide with a box.
     * @param {Box} box Box to check.
     * @returns {Boolean} True if collide, false otherwise.
     */
    collideBox( box ) 
    {
		const planes = this.planes;
		for ( let i = 0; i < 6; i ++ ) 
        {
			const plane = planes[ i ];

			// corner at max distance
			_vector.x = plane.normal.x > 0 ? box.max.x : box.min.x;
			_vector.y = plane.normal.y > 0 ? box.max.y : box.min.y;
			_vector.z = plane.normal.z > 0 ? box.max.z : box.min.z;

			if ( plane.distanceToPoint( _vector ) < 0 ) {
				return false;
			}
		}
		return true;
	}

    /**
     * Check if the frustum contains a point.
     * @param {Vector3} point Vector to check.
     * @returns {Boolean} True if point is in frustum, false otherwise.
     */
	containsPoint(point) 
    {
		const planes = this.planes;
		for ( let i = 0; i < 6; i ++ ) {
			if ( planes[i].distanceToPoint(point) < 0 ) {
				return false;
			}
		}
		return true;
	}

    /**
     * Clone this frustum.
     * @returns {Frustum} Cloned frustum.
     */
	clone() 
    {
		return new this.constructor().copy( this );
	}
}


// export the frustum class
module.exports = Frustum;