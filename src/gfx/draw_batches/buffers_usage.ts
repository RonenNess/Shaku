/**
 * Buffers usage we can use for drawing batches.
 * This determine how WebGL will treat the buffers we pass to the GPU.
 */
export enum BuffersUsage {
	STATIC_DRAW = 'static',
	DYNAMIC_DRAW = 'dynamic',
	STREAM_DRAW = 'stream',
};
