/**
 * Blend modes we can draw with, determine how we blend new draws with existing buffer.
 */
export enum BlendModes {
	ALPHA_BLEND = "alpha",
	OPAQUE = "opaque",
	ADDITIVE = "additive",
	MULTIPLY = "multiply",
	SUBSTRACT = "subtract",
	SCREEN = "screen",
	OBERLAY = "overlay",
	INVERT = "invert",
	DARKEN = "darken",
	DEST_IN = "dest-in",
	DEST_OUT = "dest-out",
};
