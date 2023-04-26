export type BlendMode = string;
/**
 * Blend modes we can draw with, determine how we blend new draws with existing buffer.
 */
export type BlendModes = BlendMode;
export namespace BlendModes {
	const AlphaBlend: BlendMode;
	const Opaque: BlendMode;
	const Additive: BlendMode;
	const Multiply: BlendMode;
	const Subtract: BlendMode;
	const Screen: BlendMode;
	const Overlay: BlendMode;
	const Invert: BlendMode;
	const Darken: BlendMode;
	const DestIn: BlendMode;
	const DestOut: BlendMode;
    const _values: Set<string>;
}
//# sourceMappingURL=blend_modes.d.ts.map