/** @typedef {String} TextureFilterMode */

/**
 * Texture filter modes, determine how to scale textures.
 * @readonly
 * @enum {TextureFilterMode}
 */
export const TextureFilterModes = {
	Nearest: "NEAREST",
	Linear: "LINEAR",
	NearestMipmapNearest: "NEAREST_MIPMAP_NEAREST",
	LinearMipmapNearest: "LINEAR_MIPMAP_NEAREST",
	NearestMipmapLinear: "NEAREST_MIPMAP_LINEAR",
	LinearMipmapLinear: "LINEAR_MIPMAP_LINEAR",
};

Object.defineProperty(TextureFilterModes, '_values', {
	value: new Set(Object.values(TextureFilterModes)),
	writable: false,
});

Object.freeze(TextureFilterModes);
