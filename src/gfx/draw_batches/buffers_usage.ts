

/** @typedef {String} BuffersUsage */

/**
 * Buffers usage we can use for drawing batches.
 * This determine how WebGL will treat the buffers we pass to the GPU.
 * @readonly
 * @enum {BuffersUsage}
 */
export const BuffersUsage = {
	StaticDraw: 'static',
	DynamicDraw: 'dynamic',
	StreamDraw: 'stream',
};

Object.defineProperty(BuffersUsage, '_values', {
	value: new Set(Object.values(BuffersUsage)),
	writable: false,
});
Object.freeze(BuffersUsage);
