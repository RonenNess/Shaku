import { Gfx } from "..";
import { TextureAssetBase } from "../../assets";
import { Color, LoggerFactory, Matrix, Vector2 } from "../../utils";
import { TextureFilterModes } from "../texture_filter_modes";
import { TextureWrapModes } from "../texture_wrap_modes";

const _logger = LoggerFactory.getLogger("gfx - effect"); // TODO

// currently applied effect
let _currEffect = null;

// will store all supported depth funcs
let _depthFuncs: DepthFunctions | null = null;

export interface DepthFunctions {
	Never: unknown;
	Less: unknown;
	Equal: unknown;
	LessEqual: unknown;
	Greater: unknown;
	GreaterEqual: unknown;
	Always: unknown;
	NotEqual: unknown;
}

/**
 * Uniform types enum.
 */
enum UniformTypes {
	TEXTURE = "texture",
	MATRIX = "uniformMatrix4fv",
	COLOR = "uniform4fv",

	FLOAT = "uniform1f",
	FLOAT_ARRAY = "uniform1fv",

	INT = "uniform1i",
	INT_ARRAY = "uniform1iv",

	FLOAT2 = "uniform2f",
	FLOAT2_ARRAY = "uniform2fv",

	INT2 = "uniform2i",
	INT2_ARRAY = "uniform2iv",

	FLOAT3 = "uniform3f",
	FLOAT3_ARRAY = "uniform3fv",

	INT3 = "uniform3i",
	INT3_ARRAY = "uniform3iv",

	FLOAT4 = "uniform4f",
	FLOAT4_ARRAY = "uniform4fv",

	INT4 = "uniform4i",
	INT4_ARRAY = "uniform4iv",
}

/**
 * Default uniform binds.
 * This is a set of commonly used uniforms and their names inside the shader code.
 *
 * Every bind here comes with a built-in method to set and is used internally by Shaku.
 * For example, if you want to include outline properties in your effect, you can use the "OutlineWeight" and "OutlineColor" binds (with matching name in the shader code).
 * When you use the built-in binds, Shaku will know how to set them itself when relevant, for example in text rendering Shaku will use the outline binds if they exist.
 *
 * If you don't use the built-in binds you can just call your uniforms however you like, but you'll need to set them all manually.
 * Shaku will not know how to set them.
 */
export enum UniformBinds {
	MainTexture = "mainTexture",                         // bind uniform to be used as the main texture.
	Color = "color",                                     // bind uniform to be used as a main color.
	Projection = "projection",                           // bind uniform to be used as the projection matrix.
	World = "world",                                     // bind uniform to be used as the world matrix.
	View = "view",                                       // bind uniform to be used as the view matrix.
	UvOffset = "uvOffset",                               // bind uniform to be used as UV offset.
	UvScale = "uvScale",                                 // bind uniform to be used as UV scale.
	OutlineWeight = "outlineWeight",                     // bind uniform to be used as outline weight.
	OutlineColor = "outlineColor",                       // bind uniform to be used as outline color.
	UvNormalizationFactor = "uvNormalizationFactor",     // bind uniform to be used as factor to normalize uv values to be 0-1.
	TextureWidth = "textureWidth",                       // bind uniform to be used as texture width in pixels.
	TextureHeight = "textureHeight"                      // bind uniform to be used as texture height in pixels.
}

/**
 * Define attribute types.
 */
export enum AttributeTypes {
	Byte = "BYTE",
	Short = "SHORT",
	UByte = "UNSIGNED_BYTE",
	UShort = "UNSIGNED_SHORT",
	Float = "FLOAT",
	HalfFloat = "HALF_FLOAT",
}

/**
 * Define built-in attribute binds to connect attribute names for specific use cases like position, uvs, colors, etc.
 * If an effect support one or more of these attributes, Shaku will know how to fill them automatically.
 */
export enum AttributeBinds {
	Position = "position",  // bind attribute to be used for vertices position array.
	TextureCoords = "uv",   // bind attribute to be used for texture coords array.
	Colors = "color",       // bind attribute to be used for vertices colors array.
	Normals = "normal",     // bind attribute to be used for vertices normals array.
	Binormals = "binormal", // bind attribute to be used for vertices binormals array.
	Tangents = "tangent",   // bind attribute to be used for vertices tangents array.
}

/**
 * Effect base class.
 * An effect = vertex shader + fragment shader + uniforms & attributes + setup code.
 */
export class Effect {
	public static _gfx: Gfx | null = null; // will be set by the gfx manager

	public static UniformTypes = UniformTypes;
	public static UniformBinds = UniformBinds;
	public static AttributeTypes = AttributeTypes;
	public static AttributeBinds = AttributeBinds;

	/**
	 * Get all supported depth funcs we can set.
	 * @returns Depth func options: {Never, Less, Equal, LessEqual, Greater, GreaterEqual, Always, NotEqual}.
	 */
	public static get DepthFuncs(): DepthFunctions {
		if(!_depthFuncs) {
			const gl = Effect._gfx._internal.gl;
			_depthFuncs = {
				Never: gl.NEVER,
				Less: gl.LESS,
				Equal: gl.EQUAL,
				LessEqual: gl.LEQUAL,
				Greater: gl.GREATER,
				GreaterEqual: gl.GEQUAL,
				Always: gl.ALWAYS,
				NotEqual: gl.NOTEQUAL,
			};
			Object.freeze(_depthFuncs);
		}
		return _depthFuncs;
	}

	public uniforms: Record<unknown, unknown>;
	public uniformTypes: Record<UniformTypes, { type: unknown, bind?: unknown; }>;
	public attributes: Record<unknown, unknown>;

	private _gl: WebGLRenderingContext;
	private _program: WebGLProgram;
	private _uniformBinds: Record<UniformBinds, (...args: unknown[]) => unknown>;
	private _pendingUniformValues: Partial<Record<AttributeTypes, unknown>>;
	private _pendingAttributeValues: Partial<Record<AttributeTypes, unknown>>;
	private _attributeBinds: Record<AttributeBinds, unknown>;
	private _cachedValues: Partial<{
		tangents: unknown;
		binormals: unknown;
		normals: unknown;
		colors: unknown;
		coords: unknown;
		positions: unknown;
		projection: unknown;
		color: unknown;
		texture: unknown;
	}>;

	/**
	 * Create the effect.
	 */
	public constructor() {
		this.#_build(Effect._gfx._internal.gl);
	}

	/**
	 * Build the effect.
	 * Called from gfx manager.
	 * @private
	 * @param gl WebGL context.
	 */
	#_build(gl: WebGLRenderingContext) {
		// create program
		const program = gl.createProgram();

		// build vertex shader
		{
			const shader = compileShader(this.constructor, gl, this.vertexCode, gl.VERTEX_SHADER);
			gl.attachShader(program, shader);
		}

		// build fragment shader
		{
			const shader = compileShader(this.constructor, gl, this.fragmentCode, gl.FRAGMENT_SHADER);
			gl.attachShader(program, shader);
		}

		// link program
		gl.linkProgram(program);

		// check for errors
		if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			_logger.error("Error linking shader program:");
			_logger.error(gl.getProgramInfoLog(program));
			throw new Error("Failed to link shader program.");
		}

		// store program and gl
		this._gl = gl;
		this._program = program;

		// a set of dynamically-created setters to set uniform values
		this.uniforms = {};

		// dictionary to bind uniform to built-in roles, like main texture or color
		this._uniformBinds = {};

		// values waiting to set as soon as the effect turns active
		this._pendingUniformValues = {};
		this._pendingAttributeValues = {};

		// initialize uniform setters
		for(const uniform in this.uniformTypes) {

			// get uniform location
			const uniformLocation = this._gl.getUniformLocation(this._program, uniform);
			if(uniformLocation === -1) {
				_logger.error("Could not find uniform: " + uniform);
				throw new Error(`Uniform named "${uniform}" was not found in shader code!`);
			}

			// get gl setter method
			const uniformData = this.uniformTypes[uniform as keyof typeof this.uniformTypes];
			if(!Object.values(UniformTypes).includes(uniformData.type)) {
				_logger.error("Uniform has invalid type: " + uniformData.type);
				throw new Error(`Uniform "${uniform}" have illegal value type "${uniformData.type}"!`);
			}

			// build setter method for matrices
			if(uniformData.type === UniformTypes.MATRIX) {
				(function(_this, name, location, method) {
					_this.uniforms[name] = (mat) => {
						if(_currEffect !== _this) {
							_this._pendingUniformValues[name] = [mat];
							return;
						}
						_this._gl[method](location, false, mat);
					};
				})(this, uniform, uniformLocation, uniformData.type);
			}
			// build setter method for textures
			else if(uniformData.type === UniformTypes.TEXTURE) {
				(function(_this, name, location, method) {
					_this.uniforms[name] = (texture, index) => {
						if(_currEffect !== _this) {
							_this._pendingUniformValues[name] = [texture, index];
							return;
						}
						index = index || 0;
						const glTexture = texture._glTexture || texture;
						const textureCode = _this._gl["TEXTURE" + (index || 0)];
						_this._gl.activeTexture(textureCode);
						_this._gl.bindTexture(_this._gl.TEXTURE_2D, glTexture);
						_this._gl.uniform1i(location, (index || 0));
						if(texture.filter) { _setTextureFilter(_this._gl, texture.filter); }
						if(texture.wrapMode) { _setTextureWrapMode(_this._gl, texture.wrapMode); }
					};
				})(this, uniform, uniformLocation, uniformData.type);
			}
			// build setter method for colors
			else if(uniformData.type === UniformTypes.COLOR) {
				(function(_this, name, location, method) {
					_this.uniforms[name] = (v1, v2, v3, v4) => {
						if(_currEffect !== _this) {
							_this._pendingUniformValues[name] = [v1, v2, v3, v4];
							return;
						}
						if(v1.isColor) {
							_this._gl[method](location, v1.floatArray);
						}
						else {
							_this._gl[method](location, v1, v2, v3, v4);
						}
					};
				})(this, uniform, uniformLocation, uniformData.type);
			}
			// build setter method for other types
			else {
				(function(_this, name, location, method) {
					_this.uniforms[name] = (v1, v2, v3, v4) => {
						if(_currEffect !== _this) {
							_this._pendingUniformValues[name] = [v1, v2, v3, v4];
							return;
						}
						_this._gl[method](location, v1, v2, v3, v4);
					};
				})(this, uniform, uniformLocation, uniformData.type);
			}

			// set binding
			const bindTo = uniformData.bind;
			if(bindTo) {
				this._uniformBinds[bindTo] = uniform;
			}
		}

		// a set of dynamically-created setters to set attribute values
		this.attributes = {};

		// dictionary to bind attribute to built-in roles, like vertices positions or uvs
		this._attributeBinds = {};

		// get attribute locations
		for(const attr in this.attributeTypes) {

			// get attribute location
			const attributeLocation = this._gl.getAttribLocation(this._program, attr);
			if(attributeLocation === -1) {
				_logger.error("Could not find attribute: " + attr);
				throw new Error(`Attribute named "${attr}" was not found in shader code!`);
			}

			// get attribute data
			const attributeData = this.attributeTypes[attr];

			// build setter method
			(function(_this, name, location, data) {
				_this.attributes[name] = (buffer) => {

					if(_currEffect !== _this) {
						_this._pendingAttributeValues[name] = [buffer];
						return;
					}

					if(buffer) {
						_this._gl.bindBuffer(_this._gl.ARRAY_BUFFER, buffer);
						_this._gl.vertexAttribPointer(location, data.size, _this._gl[data.type] || _this._gl.FLOAT, data.normalize || false, data.stride || 0, data.offset || 0);
						_this._gl.enableVertexAttribArray(location);
					}
					else {
						_this._gl.disableVertexAttribArray(location);
					}
				};
			})(this, attr, attributeLocation, attributeData);

			// set binding
			const bindTo = attributeData.bind;
			if(bindTo) {
				this._attributeBinds[bindTo] = attr;
			}
		}

		// values we already set for this effect, so we won't set them again
		this._cachedValues = {};
	}

	/**
	 * Get a dictionary with all shaders uniforms.
	 * Key = uniform name, as appears in shader code.
	 * Value = {
	 *              type: UniformTypes to represent uniform type,
	 *              bind: Optional bind to one of the built-in uniforms. See Effect.UniformBinds for details.
	 *         }
	 * @returns Dictionary with uniforms descriptions.
	 */
	public get uniformTypess() { // TODO
		throw new Error("Not Implemented!");
	}

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
	 * @returns Dictionary with attributes descriptions.
	 */
	public get attributeTypes() {
		throw new Error("Not Implemented!");
	}

	/**
	 * Make this effect active.
	 * @param overrideFlags Optional flags to override in effect.
	 * May include the following: enableDepthTest, enableFaceCulling, enableStencilTest, enableDithering.
	 */
	public setAsActive(overrideFlags: Partial<{ enableDepthTest: boolean; enableFaceCulling: boolean; enableStencilTest: boolean; enableDithering: boolean; polygonOffset: Partial<{ factor: number; units: number; }>; depthFunc: unknown; }>) {
		// use effect program
		this._gl.useProgram(this._program);

		// enable / disable some features
		overrideFlags = overrideFlags || {};
		if(overrideFlags.enableDepthTest ?? this.enableDepthTest) { this._gl.enable(this._gl.DEPTH_TEST); } else { this._gl.disable(this._gl.DEPTH_TEST); }
		if(overrideFlags.enableFaceCulling ?? this.enableFaceCulling) { this._gl.enable(this._gl.CULL_FACE); } else { this._gl.disable(this._gl.CULL_FACE); }
		if(overrideFlags.enableStencilTest ?? this.enableStencilTest) { this._gl.enable(this._gl.STENCIL_TEST); } else { this._gl.disable(this._gl.STENCIL_TEST); }
		if(overrideFlags.enableDithering ?? this.enableDithering) { this._gl.enable(this._gl.DITHER); } else { this._gl.disable(this._gl.DITHER); }

		// set polygon offset
		const polygonOffset = overrideFlags.polygonOffset ?? this.polygonOffset;
		if(polygonOffset) {
			this._gl.enable(this._gl.POLYGON_OFFSET_FILL);
			this._gl.polygonOffset(polygonOffset.factor ?? 0, polygonOffset.units ?? 0);
		}
		else {
			this._gl.disable(this._gl.POLYGON_OFFSET_FILL);
			this._gl.polygonOffset(0, 0);
		}

		// default depth func
		this._gl.depthFunc(overrideFlags.depthFunc ?? this.depthFunc);

		// set as active
		_currEffect = this;

		// set pending uniforms that were set while this effect was not active
		for(const key in this._pendingUniformValues) {
			this.uniforms[key](...this._pendingUniformValues[key]);
		}
		this._pendingUniformValues = {};

		// set pending attributes that were set while this effect was not active
		for(const key in this._pendingAttributeValues) {
			this.attributes[key](...this._pendingAttributeValues[key]);
		}
		this._pendingAttributeValues = {};

		// reset cached values
		this._cachedValues = {};
	}

	/**
	 * Get a uniform method from a bind key.
	 * @param bindKey Uniform bind key.
	 * @returns Uniform set method, or null if not set.
	 */
	public getBoundUniform(bindKey: UniformBinds): ((...args: unknown[]) => unknown) | null {
		const key = this._uniformBinds[bindKey];
		if(key) return this.uniforms[key] || null;
		return null;
	}

	/**
	 * Get this effect's vertex shader code, as string.
	 * @returns Vertex shader code.
	 */
	public get vertexCode(): string {
		throw new Error("Not Implemented!");
	}

	/**
	 * Get this effect's fragment shader code, as string.
	 * @returns Fragment shader code.
	 */
	public get fragmentCode(): string {
		throw new Error("Not Implemented!");
	}

	/**
	 * Should this effect enable depth test?
	 */
	public get enableDepthTest() {
		return false;
	}

	/**
	 * Should this effect enable face culling?
	 */
	public get enableFaceCulling() {
		return false;
	}

	/**
	 * Get depth func to use when rendering using this effect.
	 * Use "DepthFuncs" to get options.
	 */
	public get depthFunc() {
		return Effect.DepthFuncs.LessEqual;
	}

	/**
	 * Should this effect enable stencil test?
	 */
	public get enableStencilTest() {
		return false;
	}

	/**
	 * Should this effect enable dithering?
	 */
	public get enableDithering() {
		return false;
	}

	/**
	 * Get polygon offset factor, to apply on depth value before checking.
	 * @returns Return false to disable polygon offset, or {factor, unit} to apply polygon offset.
	 */
	public get polygonOffset(): false | { factor: number; units: number; } {
		return false;
	}

	/**
	 * Set the main texture.
	 * Note: this will only work for effects that utilize the "MainTexture" uniform.
	 * @param texture Texture to set.
	 * @returns True if texture was changed, false if there was no need to change the texture.
	 */
	public setTexture(texture: TextureAssetBase): boolean {
		// already using this texture? skip
		if(texture === this._cachedValues.texture) return false;

		// get texture uniform
		const uniform = this.getBoundUniform(Effect.UniformBinds.MainTexture);

		if(!uniform) return false; // didn't set..

		// set texture value
		this._cachedValues.texture = texture;
		const glTexture = texture._glTexture || texture;
		this._gl.activeTexture(this._gl.TEXTURE0);
		this._gl.bindTexture(this._gl.TEXTURE_2D, glTexture);
		uniform(texture, 0);

		// set texture size
		const textWidth = this.getBoundUniform(Effect.UniformBinds.TextureWidth);
		if(textWidth) textWidth(texture.width);
		const textHeight = this.getBoundUniform(Effect.UniformBinds.TextureHeight);
		if(textHeight) textHeight(texture.height);

		// success
		return true;
	}

	/**
	 * Set the main tint color.
	 * Note: this will only work for effects that utilize the "Color" uniform.
	 * @param color Color to set.
	 */
	public setColor(color: Color): void {
		const uniform = this.getBoundUniform(Effect.UniformBinds.Color);
		if(!uniform) return;
		if(color.equals(this._cachedValues.color)) return;
		this._cachedValues.color = color.clone();
		uniform(color.floatArray);
	}

	/**
	 * Set the projection matrix uniform.
	 * Note: this will only work for effects that utilize the "Projection" uniform.
	 * @param matrix Matrix to set.
	 */
	public setProjectionMatrix(matrix: Matrix): void {
		const uniform = this.getBoundUniform(Effect.UniformBinds.Projection);
		if(!uniform) return;
		if(matrix.equals(this._cachedValues.projection)) return;
		this._cachedValues.projection = matrix.clone();
		uniform(matrix.values);
	}

	/**
	 * Set the world matrix uniform.
	 * Note: this will only work for effects that utilize the "World" uniform.
	 * @param matrix Matrix to set.
	 */
	public setWorldMatrix(matrix: Matrix): void {
		const uniform = this.getBoundUniform(Effect.UniformBinds.World);
		if(!uniform) return;
		uniform(matrix.values);
	}

	/**
	 * Set the view matrix uniform.
	 * Note: this will only work for effects that utilize the "View" uniform.
	 * @param matrix Matrix to set.
	 */
	public setViewMatrix(matrix: Matrix): void {
		const uniform = this.getBoundUniform(Effect.UniformBinds.View);
		if(!uniform) return;
		uniform(matrix.values);
	}

	/**
	 * Set outline params.
	 * Note: this will only work for effects that utilize the "OutlineWeight" and "OutlineColor" uniforms.
	 * @param weight Outline weight, range from 0.0 to 1.0.
	 * @param color Outline color.
	 */
	public setOutline(weight: number, color: Color): void {
		const weightUniform = this.getBoundUniform(Effect.UniformBinds.OutlineWeight);
		if(weightUniform) weightUniform(weight);

		const colorUniform = this.getBoundUniform(Effect.UniformBinds.OutlineColor);
		if(colorUniform) colorUniform(color);
	}

	/**
	 * Set a factor to normalize UV values to be 0-1.
	 * Note: this will only work for effects that utilize the "UvNormalizationFactor" uniform.
	 * @param factor Normalize UVs factor.
	 */
	public setUvNormalizationFactor(factor: Vector2): void {
		const uniform = this.getBoundUniform(Effect.UniformBinds.UvNormalizationFactor);
		if(!uniform) return;
		uniform(factor.x, factor.y);
	}

	/**
	 * Set the vertices position buffer.
	 * Only works if there's an attribute type bound to 'Position'.
	 * @param buffer Vertices position buffer.
	 * @param forceSetBuffer If true, will always set buffer even if buffer is currently set.
	 */
	public setPositionsAttribute(buffer: WebGLBuffer, forceSetBuffer: boolean): void {
		const attr = this._attributeBinds[Effect.AttributeBinds.Position];
		if(!attr) return;
		if(!forceSetBuffer && buffer === this._cachedValues.positions) return;
		this._cachedValues.positions = buffer;
		this.attributes[attr](buffer);
	}

	/**
	 * Set the vertices texture coords buffer.
	 * Only works if there's an attribute type bound to 'TextureCoords'.
	 * @param buffer Vertices texture coords buffer.
	 * @param forceSetBuffer If true, will always set buffer even if buffer is currently set.
	 */
	public setTextureCoordsAttribute(buffer: WebGLBuffer, forceSetBuffer: boolean): void {
		const attr = this._attributeBinds[Effect.AttributeBinds.TextureCoords];
		if(!attr) return;
		if(!forceSetBuffer && buffer === this._cachedValues.coords) return;
		this._cachedValues.coords = buffer;
		this.attributes[attr](buffer);
	}

	/**
	 * Return if this effect have colors attribute on vertices.
	 * @returns True if got vertices color attribute.
	 */
	public get hasVertexColor(): boolean {
		return Boolean(this._attributeBinds[Effect.AttributeBinds.Colors]);
	}

	/**
	 * Set the vertices colors buffer.
	 * Only works if there's an attribute type bound to 'Colors'.
	 * @param buffer Vertices colors buffer.
	 * @param forceSetBuffer If true, will always set buffer even if buffer is currently set.
	 */
	public setColorsAttribute(buffer: WebGLBuffer, forceSetBuffer: boolean): void {
		const attr = this._attributeBinds[Effect.AttributeBinds.Colors];
		if(!attr) return;
		if(!forceSetBuffer && buffer === this._cachedValues.colors) return;
		this._cachedValues.colors = buffer;
		this.attributes[attr](buffer);
	}

	/**
	 * Set the vertices normals buffer.
	 * Only works if there's an attribute type bound to 'Normals'.
	 * @param buffer Vertices normals buffer.
	 * @param forceSetBuffer If true, will always set buffer even if buffer is currently set.
	 */
	public setNormalsAttribute(buffer: WebGLBuffer, forceSetBuffer: boolean): void {
		const attr = this._attributeBinds[Effect.AttributeBinds.Normals];
		if(!attr) return;
		if(!forceSetBuffer && buffer === this._cachedValues.normals) return;
		this._cachedValues.normals = buffer;
		this.attributes[attr](buffer);
	}

	/**
	 * Set the vertices binormals buffer.
	 * Only works if there's an attribute type bound to 'Binormals'.
	 * @param buffer Vertices binormals buffer.
	 * @param forceSetBuffer If true, will always set buffer even if buffer is currently set.
	 */
	public setBinormalsAttribute(buffer: WebGLBuffer, forceSetBuffer: boolean): void {
		const attr = this._attributeBinds[Effect.AttributeBinds.Binormals];
		if(!attr) return;
		if(!forceSetBuffer && buffer === this._cachedValues.binormals) return;
		this._cachedValues.binormals = buffer;
		this.attributes[attr](buffer);
	}

	/**
	 * Set the vertices tangents buffer.
	 * Only works if there's an attribute type bound to 'Tangents'.
	 * @param buffer Vertices tangents buffer.
	 * @param forceSetBuffer If true, will always set buffer even if buffer is currently set.
	 */
	public setTangentsAttribute(buffer: WebGLBuffer, forceSetBuffer: boolean): void {
		const attr = this._attributeBinds[Effect.AttributeBinds.Tangents];
		if(!attr) return;
		if(!forceSetBuffer && buffer === this._cachedValues.tangents) return;
		this._cachedValues.tangents = buffer;
		this.attributes[attr](buffer);
	}

}

/**
 * Build a shader.
 */
function compileShader(effectClass: typeof Effect, gl: WebGLRenderingContext, code: string, type: number): WebGLShader {
	const shader = gl.createShader(type);
	if(!shader) throw new Error("Failed to compile a shader.");

	gl.shaderSource(shader, code);
	gl.compileShader(shader);

	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		_logger.error(`Error compiling ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"} shader for effect "${effectClass.name}":`);
		_logger.error(gl.getShaderInfoLog(shader));
		throw new Error("Failed to compile a shader.");
	}

	return shader;
}

/**
 * Set texture mag and min filters.
 * @private
 * @param filter Texture filter to set.
 */
function _setTextureFilter(gl: WebGLRenderingContext, filter: TextureFilterModes) {
	const glMode = gl[filter];
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glMode);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glMode);
}

/**
 * Set texture wrap mode on X and Y axis.
 * @private
 * @param wrapX Wrap mode on X axis.
 * @param wrapY Wrap mode on Y axis.
 */
function _setTextureWrapMode(gl: WebGLRenderingContext, wrapX: TextureWrapModes, wrapY = wrapX) {
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[wrapX]);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[wrapY]);
}
