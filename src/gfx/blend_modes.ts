/**
 * Blend modes we can draw with, determine how we blend new draws with existing buffer.
 */
export enum BlendModes {
	ALPHA_BLEND = "alpha",
	OPAQUE = "opaque",
	ADDITIVE = "additive",
	MULTIPLY = "multiply",
	SUBTRACT = "subtract",
	SCREEN = "screen",
	OVERLAY = "overlay",
	INVERT = "invert",
	DARKEN = "darken",
	DEST_IN = "dest-in",
	DEST_OUT = "dest-out",
}
