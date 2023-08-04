

/** @typedef {String} BlendMode */

/**
 * Blend modes we can draw with, determine how we blend new draws with existing buffer.
 * @readonly
 * @enum {BlendMode}
 */
export const BlendModes = {
	AlphaBlend: "alpha",
	Opaque: "opaque",
	Additive: "additive",
	Multiply: "multiply",
	Subtract: "subtract",
	Screen: "screen",
	Overlay: "overlay",
	Invert: "invert",
	Darken: "darken",
	DestIn: "dest-in",
	DestOut: "dest-out"
};

Object.defineProperty(BlendModes, '_values', {
	value: new Set(Object.values(BlendModes)),
	writable: false,
});
Object.freeze(BlendModes);
