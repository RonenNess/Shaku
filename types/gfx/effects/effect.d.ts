export = Effect;
/**
 * Effect base class.
 * An effect = vertex shader + fragment shader + uniforms & attributes + setup code.
 */
declare class Effect {
    /**
     * Get all supported depth funcs we can set.
     * @returns {*} Depth func options: {Never, Less, Equal, LessEqual, Greater, GreaterEqual, Always, NotEqual}.
     */
    static get DepthFuncs(): any;
    _gl: WebGl;
    _program: any;
    uniforms: {};
    _uniformBinds: {};
    _pendingUniformValues: {};
    _pendingAttributeValues: {};
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
     * @param {*} overrideFlags Optional flags to override in effect.
     * May include the following: enableDepthTest, enableFaceCulling, enableStencilTest, enableDithering.
     */
    setAsActive(overrideFlags: any): void;
    /**
     * Get a uniform method from a bind key.
     * @param {UniformBinds} bindKey Uniform bind key.
     * @returns Uniform set method, or null if not set.
     */
    getBoundUniform(bindKey: UniformBinds): any;
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
     * Get depth func to use when rendering using this effect.
     * Use 'DepthFuncs' to get options.
     */
    get depthFunc(): any;
    /**
     * Should this effect enable stencil test?
     */
    get enableStencilTest(): boolean;
    /**
     * Should this effect enable dithering?
     */
    get enableDithering(): boolean;
    /**
     * Get polygon offset factor, to apply on depth value before checking.
     * @returns {Boolean|*} Return false to disable polygon offset, or {factor, unit} to apply polygon offset.
     */
    get polygonOffset(): any;
    /**
     * Set the main texture.
     * Note: this will only work for effects that utilize the 'MainTexture' uniform.
     * @param {TextureAssetBase} texture Texture to set.
     * @returns {Boolean} True if texture was changed, false if there was no need to change the texture.
     */
    setTexture(texture: TextureAssetBase): boolean;
    /**
     * Set the main tint color.
     * Note: this will only work for effects that utilize the 'Color' uniform.
     * @param {Color} color Color to set.
     */
    setColor(color: Color): void;
    /**
     * Set the projection matrix uniform.
     * Note: this will only work for effects that utilize the 'Projection' uniform.
     * @param {Matrix} matrix Matrix to set.
     */
    setProjectionMatrix(matrix: Matrix): void;
    /**
     * Set the world matrix uniform.
     * Note: this will only work for effects that utilize the 'World' uniform.
     * @param {Matrix} matrix Matrix to set.
     */
    setWorldMatrix(matrix: Matrix): void;
    /**
     * Set the view matrix uniform.
     * Note: this will only work for effects that utilize the 'View' uniform.
     * @param {Matrix} matrix Matrix to set.
     */
    setViewMatrix(matrix: Matrix): void;
    /**
     * Set outline params.
     * Note: this will only work for effects that utilize the 'OutlineWeight' and 'OutlineColor' uniforms.
     * @param {Number} weight Outline weight, range from 0.0 to 1.0.
     * @param {Color} color Outline color.
     */
    setOutline(weight: number, color: Color): void;
    /**
     * Set a factor to normalize UV values to be 0-1.
     * Note: this will only work for effects that utilize the 'UvNormalizationFactor' uniform.
     * @param {Vector2} factor Normalize UVs factor.
     */
    setUvNormalizationFactor(factor: Vector2): void;
    /**
     * Set the vertices position buffer.
     * Only works if there's an attribute type bound to 'Position'.
     * @param {WebGLBuffer} buffer Vertices position buffer.
     * @param {Boolean} forceSetBuffer If true, will always set buffer even if buffer is currently set.
     */
    setPositionsAttribute(buffer: WebGLBuffer, forceSetBuffer: boolean): void;
    /**
     * Set the vertices texture coords buffer.
     * Only works if there's an attribute type bound to 'TextureCoords'.
     * @param {WebGLBuffer} buffer Vertices texture coords buffer.
     * @param {Boolean} forceSetBuffer If true, will always set buffer even if buffer is currently set.
     */
    setTextureCoordsAttribute(buffer: WebGLBuffer, forceSetBuffer: boolean): void;
    /**
     * Return if this effect have colors attribute on vertices.
     * @returns {Boolean} True if got vertices color attribute.
     */
    get hasVertexColor(): boolean;
    /**
     * Set the vertices colors buffer.
     * Only works if there's an attribute type bound to 'Colors'.
     * @param {WebGLBuffer} buffer Vertices colors buffer.
     * @param {Boolean} forceSetBuffer If true, will always set buffer even if buffer is currently set.
     */
    setColorsAttribute(buffer: WebGLBuffer, forceSetBuffer: boolean): void;
    /**
     * Set the vertices normals buffer.
     * Only works if there's an attribute type bound to 'Normals'.
     * @param {WebGLBuffer} buffer Vertices normals buffer.
     * @param {Boolean} forceSetBuffer If true, will always set buffer even if buffer is currently set.
     */
    setNormalsAttribute(buffer: WebGLBuffer, forceSetBuffer: boolean): void;
    #private;
}
declare namespace Effect {
    export { UniformTypes, UniformBinds, AttributeTypes, AttributeBinds, _gfx, UniformType };
}
import TextureAssetBase = require("../../assets/texture_asset_base.js");
import Color = require("../../utils/color.js");
import Matrix = require("../../utils/matrix.js");
import Vector2 = require("../../utils/vector2.js");
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
    export const View: string;
    export const UvOffset: string;
    export const UvScale: string;
    export const OutlineWeight: string;
    export const OutlineColor: string;
    export const UvNormalizationFactor: string;
    export const TextureWidth: string;
    export const TextureHeight: string;
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
    const Normals: string;
}
declare var _gfx: any;
type UniformType = string;
//# sourceMappingURL=effect.d.ts.map