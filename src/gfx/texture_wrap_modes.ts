

/** @typedef {String} TextureWrapMode */

/**
 * Texture wrap modes, determine what to do when texture coordinates are outside texture boundaries.
 * @readonly
 * @enum {TextureWrapMode}
 */
export const TextureWrapModes = {
	Clamp: "CLAMP_TO_EDGE",
	Repeat: "REPEAT",
	RepeatMirrored: "MIRRORED_REPEAT",
};

Object.defineProperty(TextureWrapModes, '_values', {
	value: new Set(Object.values(TextureWrapModes)),
	writable: false,
});

Object.freeze(TextureWrapModes);
