export = Effect;
/**
 * Effect base class.
 * An effect = vertex shader + fragment shader + uniforms & attributes + setup code.
 */
declare class Effect {
    /**
     * Build the effect.
     * Called from gfx manager.
     * @private
     * @param {WebGl} gl WebGL context.
     */
    private _build;
    _gl: WebGl;
    _program: any;
    uniforms: {};
    _uniformBinds: {};
    attributes: {};
    _attributeBinds: {};
    _cachedValues: {};
    /**
     * Get a dictionary with all shaders uniforms.
     * Key = uniform name, as appears in shader code.
     * Value = {
     *              type: UniformTypes to represent uniform type,
     *              bind: Optional bind to one of the built-in uniforms. See Effect.UniformBinds for details.
     *         }
     * @returns {*} Dictionary with uniforms descriptions.
     */
    get uniformTypes(): any;
    /**
     * Get a dictionary with all shader attributes.
     * Key = attribute name, as appears in shader code.
     * Value = {
     *             size: size of every value in this attribute.
     *             type: attribute type. See Effect.AttributeTypes for details.
     *             normalize: if true, will normalize values.
     *             stride: optional stride.
     *             offset: optional offset.
     *             bind: Optional bind to one of the built-in attributes. See Effect.AttributeBinds for details.
     *         }
     * @returns {*} Dictionary with attributes descriptions.
     */
    get attributeTypes(): any;
    /**
     * Make this effect active.
     */
    setAsActive(): void;
    /**
     * Prepare effect before drawing it with batching.
     * @param {Mesh} mesh Mesh we're about to draw.
     * @param {Matrix} world World matrix.
     */
    prepareToDrawBatch(mesh: Mesh, world: Matrix): void;
    /**
     * Get this effect's vertex shader code, as string.
     * @returns {String} Vertex shader code.
     */
    get vertexCode(): string;
    /**
     * Get this effect's fragment shader code, as string.
     * @returns {String} Fragment shader code.
     */
    get fragmentCode(): string;
    /**
     * Should this effect enable depth test?
     */
    get enableDepthTest(): boolean;
    /**
     * Should this effect enable face culling?
     */
    get enableFaceCulling(): boolean;
    /**
     * Should this effect enable stencil test?
     */
    get enableStencilTest(): boolean;
    /**
     * Should this effect enable dithering?
     */
    get enableDithering(): boolean;
    /**
     * Set the main texture.
     * Only works if there's a uniform type bound to 'MainTexture'.
     * @param {TextureAsset} texture Texture to set.
     * @returns {Boolean} True if texture was changed, false if there was no need to change the texture.
     */
    setTexture(texture: TextureAsset): boolean;
    /**
     * Set the main tint color.
     * Only works if there's a uniform type bound to 'Color'.
     * @param {Color} color Color to set.
     */
    setColor(color: Color): void;
    /**
     * Set uvOffset and uvScale params from source rectangle and texture.
     * @param {Rectangle} sourceRect Source rectangle to set, or null to take entire texture.
     * @param {TextureAsset} texture Texture asset to set source rect for.
     */
    setUvOffsetAndScale(sourceRect: Rectangle, texture: TextureAsset): void;
    /**
     * Set the projection matrix uniform.
     * @param {Matrix} matrix Matrix to set.
     */
    setProjectionMatrix(matrix: Matrix): void;
    /**
     * Set the world matrix uniform.
     * @param {Matrix} matrix Matrix to set.
     */
    setWorldMatrix(matrix: Matrix): void;
    /**
     * Set the vertices position buffer.
     * Only works if there's an attribute type bound to 'Position'.
     * @param {WebGLBuffer} buffer Vertices position buffer.
     */
    setPositionsAttribute(buffer: WebGLBuffer): void;
    /**
     * Set the vertices texture coords buffer.
     * Only works if there's an attribute type bound to 'TextureCoords'.
     * @param {WebGLBuffer} buffer Vertices texture coords buffer.
     */
    setTextureCoordsAttribute(buffer: WebGLBuffer): void;
    /**
     * Set the vertices colors buffer.
     * Only works if there's an attribute type bound to 'Colors'.
     * @param {WebGLBuffer} buffer Vertices colors buffer.
     */
    setColorsAttribute(buffer: WebGLBuffer): void;
}
declare namespace Effect {
    export { UniformTypes, UniformBinds, AttributeTypes, AttributeBinds, UniformType };
}
import Matrix = require("../matrix.js");
import TextureAsset = require("../../assets/texture_asset.js");
import Color = require("../../utils/color.js");
import Rectangle = require("../../utils/rectangle.js");
/**
 * Uniform types enum.
 */
type UniformTypes = UniformType;
declare namespace UniformTypes {
    export const Texture: string;
    const Matrix_1: string;
    export { Matrix_1 as Matrix };
    const Color_1: string;
    export { Color_1 as Color };
    export const Float: string;
    export const FloatArray: string;
    export const Int: string;
    export const IntArray: string;
    export const Float2: string;
    export const Float2Array: string;
    export const Int2: string;
    export const Int2Array: string;
    export const Float3: string;
    export const Float3Array: string;
    export const Int3: string;
    export const Int3Array: string;
    export const Float4: string;
    export const Float4Array: string;
    export const Int4: string;
    export const Int4Array: string;
    const _values: any;
}
declare namespace UniformBinds {
    export const MainTexture: string;
    const Color_1: string;
    export { Color_1 as Color };
    export const Projection: string;
    export const World: string;
    export const UvOffset: string;
    export const UvScale: string;
}
declare namespace AttributeTypes {
    const Byte: string;
    const Short: string;
    const UByte: string;
    const UShort: string;
    const Float: string;
    const HalfFloat: string;
}
declare namespace AttributeBinds {
    const Position: string;
    const TextureCoords: string;
    const Colors: string;
}
type UniformType = string;
//# sourceMappingURL=effect.d.ts.map