import Animator from './animator';
import Box from './box';
import Circle from './circle';
import Color from './color';
import Frustum from './frustum';
import GameTime from './game_time';
import ItemsSorter from './items_sorter';
import Line from './line';
import MathHelper from './math_helper';
import Matrix from './matrix';
import PathFinder from './path_finder';
import Perlin from './perlin';
import Plane from './plane';
import Ray from './ray';
import Rectangle from './rectangle';
import SeededRandom from './seeded_random';
import Sphere from './sphere';
import Storage from './storage';
import { StorageAdapter } from './storage_adapter';
import TransformationModes from './transform_modes';
import Transformation from './transformation';
import Vector2 from './vector2';
import Vector3 from './vector3';

/**
 * Shaku Utils module.
 * Contains general stuff, utilities and core objects that Shaku uses.
 */
const Utils = {
	Vector2,
	Vector3,
	Rectangle,
	Circle,
	Line,
	Color,
	Animator,
	GameTime,
	MathHelper,
	SeededRandom,
	Perlin,
	Storage,
	PathFinder,
	Transformation,
	TransformationModes,
	ItemsSorter,
	Frustum,
	Plane,
	Sphere,
	Matrix,
	Box,
	Ray,
};

// add a 'isXXX' property to all util objects, for faster alternative to 'instanceof' checks.
// for example this will generate a 'isVector3' that will be true for all Vector3 instances.
for(let key in Utils) {
	if(Utils[key].prototype) {
		Utils[key].prototype['is' + key] = true;
	}
}

// export the Utils module.
export {
	Animator,
	Box,
	Circle,
	Color,
	Frustum,
	GameTime,
	ItemsSorter,
	Line,
	MathHelper,
	Matrix,
	PathFinder,
	Perlin,
	Plane,
	Ray,
	Rectangle,
	SeededRandom,
	Sphere,
	Storage, Transformation,
	TransformationModes,
	Vector2,
	Vector3,
	type StorageAdapter
};
