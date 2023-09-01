
export const CollisionsImp = {

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
		for(let i = 0; i < l1._lines.length; ++i) {
			if(l1._lines[i].containsVector(v1._position)) {
				return v1._position;
			}
		}
		return false;
	},

	/**
	 * Test collision between a point and a tilemap.
	 */
	pointTilemap: function(v1, tm) {
		if(tm._intBoundingRect.containsVector(v1._position)) {
			const tile = tm.getTileAt(v1._position);
			return tile ? CollisionsImp.pointRectangle(v1, tile) : false;
		}
		if(tm._borderThickness && tm._boundingRect.containsVector(v1._position)) {
			return v1._position;
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
		for(let i = 0; i < l1._lines.length; ++i) {
			if(l1._lines[i].distanceToVector(c1._circle.center) <= c1._circle.radius) {
				return true;
			}
		}
		return false;
	},

	/**
	 * Test collision between circle and tilemap.
	 */
	circleTilemap: function(c1, tm) {
		let collide = false;
		tm.iterateTilesAtRegion(c1._getBoundingBox(), (tile) => {
			if(CollisionsImp.circleRectangle(c1, tile)) {
				collide = true;
				return false;
			}
		});
		return collide;
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
		for(let i = 0; i < l1._lines.length; ++i) {
			if(r1._rect.collideLine(l1._lines[i])) {
				return true;
			}
		}
		return false;
	},

	/**
	 * Test collision between rectangle and tilemap.
	 */
	rectangleTilemap: function(r1, tm) {
		let collide = false;
		tm.iterateTilesAtRegion(r1._getBoundingBox(), (tile) => {
			collide = true;
			return false;
		});
		return collide;
	},

	/**
	 * Test collision between line and line.
	 */
	lineLine: function(l1, l2) {
		for(let i = 0; i < l1._lines.length; ++i) {
			for(let j = 0; j < l2._lines.length; ++j) {
				if(l1._lines[i].collideLine(l2._lines[j])) {
					return true;
				}
			}
		}
		return false;
	},

	/**
	 * Test collision between line and tilemap.
	 */
	lineTilemap: function(l1, tm) {
		let collide = false;
		tm.iterateTilesAtRegion(l1._getBoundingBox(), (tile) => {
			if(CollisionsImp.rectangleLine(tile, l1)) {
				collide = true;
				return false;
			}
		});
		return collide;
	},
};
