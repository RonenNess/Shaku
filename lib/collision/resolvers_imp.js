/**
 * All default collision detection implementations.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\resolvers_imp.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

 
// export the main methods
module.exports = {
    
    /**
     * Test collision between two points.
     */
    pointPoint: function(v1, v2) {
        return v1._position.approximate(v2._position) ? v1._position : false;
    },

    /**
     * Test collision between point and circle.
     */
    pointCircle: function(v1, c1) {
        return (v1._position.distanceTo(c1._circle.center) <= c1._circle.radius) ? v1._position : false;
    },

    /**
     * Test collision between point and rectangle.
     */
    pointRectangle: function(v1, r1) {
        return r1._rect.containsVector(v1._position) ? v1._position : false;
    },

    /**
     * Test collision between point and line.
     */
    pointLine: function(v1, l1) {
        for (let i = 0; i < l1._lines.length; ++i) {
            if (l1._lines[i].containsVector(v1._position)) {
                return v1._position;
            }
        }
        return false;
    },

    /**
     * Test collision between circle and circle.
     */
    circleCircle: function(c1, c2) {
        return c1._circle.center.distanceTo(c2._circle.center) <= (c1._circle.radius + c2._circle.radius);
    },

    /**
     * Test collision between circle and rectangle.
     */
    circleRectangle: function(c1, r1) {
        return r1._rect.collideCircle(c1._circle);
    },

    /**
     * Test collision between circle and lines.
     */
    circleLine: function(c1, l1) {     
        for (let i = 0; i < l1._lines.length; ++i) {
            if (l1._lines[i].distanceToVector(c1._circle.center) <= c1._circle.radius) {
                return true;
            }
        }
        return false;
    },
    
    /**
     * Test collision between rectangle and rectangle.
     */
    rectangleRectangle: function(r1, r2) {
        return r1._rect.collideRect(r2._rect);
    },
    
    /**
     * Test collision between rectangle and line.
     */
    rectangleLine: function(r1, l1) {
        return false; // TODO
    },

    /**
     * Test collision between line and line.
     */
     lineLine: function(l1, l2) {
        return false; // TODO
    },
}