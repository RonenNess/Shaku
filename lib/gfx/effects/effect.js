/**
 * Effect base class.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\effects\effect.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

const TextureAsset = require('../../assets/texture_asset.js');
const Color = require('../../utils/color.js');
const Rectangle = require('../../utils/rectangle.js');
const Matrix = require('../matrix.js');
const _logger = require('../../logger.js').getLogger('gfx-effect');


/**
 * Effect base class.
 * An effect = vertex shader + fragment shader + uniforms & attributes + setup code.
 */
class Effect
{
    /**
     * Build the effect.
     * Called from gfx manager.
     * @private
     * @param {WebGl} gl WebGL context.
     */
    _build(gl)
    {
        // create program
        let program = gl.createProgram();

        // build vertex shader
        {
            let shader = compileShader(gl, this.vertexCode, gl.VERTEX_SHADER);
            gl.attachShader(program, shader);
        }

        // build fragment shader
        {
            let shader = compileShader(gl, this.fragmentCode, gl.FRAGMENT_SHADER);
            gl.attachShader(program, shader);
        }

        // link program
        gl.linkProgram(program)

        // check for errors
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
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

        // initialize uniform setters
        for (let uniform in this.uniformTypes) {

            // get uniform location
            let uniformLocation = this._gl.getUniformLocation(this._program, uniform);
            if (uniformLocation === -1) { 
                _logger.error("Could not find uniform: " + uniform);
                throw new Error(`Uniform named '${uniform}' was not found in shader code!`); 
            }

            // get gl setter method
            let uniformData = this.uniformTypes[uniform];
            if (!UniformTypes._values.has(uniformData.type)) { 
                _logger.error("Uniform has invalid type: " + uniformData.type);
                throw new Error(`Uniform '${uniform}' have illegal value type '${uniformData.type}'!`); 
            }

            // build setter method for matrices
            if (uniformData.type === UniformTypes.Matrix) {
                (function(_this, name, location, method) {
                    _this.uniforms[name] = (mat) => {
                        _this._gl[method](location, false, mat);
                    }
                })(this, uniform, uniformLocation, uniformData.type);
            }
            // build setter method for textures
            else if (uniformData.type === UniformTypes.Texture) {
                (function(_this, name, location, method) {
                    _this.uniforms[name] = (texture, index) => {
                        index = index || 0;
                        const glTexture = texture.texture || texture;
                        const textureCode = _this._gl['TEXTURE' + (index || 0)];
                        _this._gl.enable(textureCode);
                        _this._gl.activeTexture(textureCode);
                        _this._gl.bindTexture(_this._gl.TEXTURE_2D, glTexture);
                        _this._gl.uniform1i(location, (index || 0));
                    }
                })(this, uniform, uniformLocation, uniformData.type);
            }
            // build setter method for other types
            else {
                (function(_this, name, location, method) {
                    _this.uniforms[name] = (v1, v2, v3, v4) => {
                        _this._gl[method](location, v1, v2, v3, v4);
                    }
                })(this, uniform, uniformLocation, uniformData.type);       
            }

            // set binding
            let bindTo = uniformData.bind;
            if (bindTo) {
                this._uniformBinds[bindTo] = uniform;
            }
        }

        // a set of dynamically-created setters to set attribute values
        this.attributes = {};

        // dictionary to bind attribute to built-in roles, like vertices positions or uvs
        this._attributeBinds = {};

        // get attribute locations
        for (let attr in this.attributeTypes) {

            // get attribute location
            let attributeLocation = this._gl.getAttribLocation(this._program, attr);
            if (attributeLocation === -1) { 
                _logger.error("Could not find attribute: " + attr);
                throw new Error(`Attribute named '${attr}' was not found in shader code!`); 
            }

            // get attribute data
            let attributeData = this.attributeTypes[attr];

            // build setter method
            (function(_this, name, location, data) {
                _this.attributes[name] = (buffer) => {
                    if (buffer) {
                        _this._gl.bindBuffer(_this._gl.ARRAY_BUFFER, buffer);
                        _this._gl.vertexAttribPointer(location, data.size, _this._gl[data.type] || _this._gl.FLOAT, data.normalize || false, data.stride || 0, data.offset || 0);
                        _this._gl.enableVertexAttribArray(location);
                    }
                    else {
                        _this._gl.disableVertexAttribArray(location);
                    }
                }
            })(this, attr, attributeLocation, attributeData);
      
            // set binding
            let bindTo = attributeData.bind;
            if (bindTo) {
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
     * @returns {*} Dictionary with uniforms descriptions.
     */
    get uniformTypes()
    {
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
     * @returns {*} Dictionary with attributes descriptions.
     */
    get attributeTypes()
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Make this effect active.
     */
    setAsActive()
    {
        // use effect program
        this._gl.useProgram(this._program);

        // disable all textures by default (they are enabled when set)
        this._gl.disable(this._gl.TEXTURE0);
        this._gl.disable(this._gl.TEXTURE1);
        this._gl.disable(this._gl.TEXTURE2);
        this._gl.disable(this._gl.TEXTURE3);
        this._gl.disable(this._gl.TEXTURE4);
        this._gl.disable(this._gl.TEXTURE5);
        this._gl.disable(this._gl.TEXTURE6);
        this._gl.disable(this._gl.TEXTURE7);

        // enable / disable some features
        if (this.enableDepthTest) { this._gl.enable(gl.DEPTH_TEST); } else { this._gl.disable(this._gl.DEPTH_TEST); }
        if (this.enableFaceCulling) { this._gl.enable(gl.CULL_FACE); } else { this._gl.disable(this._gl.CULL_FACE); }
        if (this.enableStencilTest) { this._gl.enable(gl.STENCIL_TEST); } else { this._gl.disable(this._gl.STENCIL_TEST); }

        // reset cached values
        this._cachedValues = {};
    }

    /**
     * Prepare effect before drawing it.
     * @param {Mesh} mesh Mesh we're about to draw.
     * @param {Color} color Optional color to set as the color uniform.
     * @param {Matrix} world World matrix.
     * @param {Rectangle} sourceRect Optional source rectangle.
     * @param {TextureAsset} texture Texture asset.
     */
    prepareToDraw(mesh, color, world, sourceRect, texture)
    {
        this.setPositionsAttribute(mesh.positions);
        this.setTextureCoordsAttribute(mesh.textureCoords);
        this.setColorsAttribute(mesh.colors);
        this.setColor(color || Color.white);
        this.setWorldMatrix(world);
        this.setUvOffsetAndScale(sourceRect, texture);
    }

    /**
     * Prepare effect before drawing it with batching.
     * @param {Mesh} mesh Mesh we're about to draw.
     * @param {Matrix} world World matrix.
     */
    prepareToDrawBatch(mesh, world)
    {
        this._cachedValues = {};
        this.setPositionsAttribute(mesh.positions);
        this.setTextureCoordsAttribute(mesh.textureCoords);
        this.setColorsAttribute(mesh.colors);
        this.setWorldMatrix(world);
        this.resetUvOffsetAndScale();
    }

    /**
     * Reset UV offset and scale uniforms.
     */
    resetUvOffsetAndScale()
    {
        // set uv offset
        let uvOffset = this._uniformBinds[Effect.UniformBinds.UvOffset];
        if (uvOffset) {
            this.uniforms[uvOffset](0, 0);
        }
        
        // set uv scale
        let uvScale = this._uniformBinds[Effect.UniformBinds.UvScale];
        if (uvScale) {
            this.uniforms[uvScale](1, 1);
        }

        // reset source rect in cached values
        this._cachedValues.sourceRect = null;
    }

    /**
     * Get this effect's vertex shader code, as string.
     * @returns {String} Vertex shader code. 
     */
    get vertexCode()
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Get this effect's fragment shader code, as string.
     * @returns {String} Fragment shader code. 
     */
    get fragmentCode()
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Should this effect enable depth test?
     */
    get enableDepthTest()
    {
        return false;
    }

    /**
     * Should this effect enable face culling?
     */
    get enableFaceCulling()
    {
        return false;
    }

    /**
     * Should this effect enable stencil test?
     */
    get enableStencilTest()
    {
        return false;
    }

    /**
     * Set the main texture.
     * Only works if there's a uniform type bound to 'MainTexture'.
     * @param {TextureAsset} texture Texture to set.
     * @returns {Boolean} True if texture was changed, false if there was no need to change the texture.
     */
    setTexture(texture)
    {
        let uniform = this._uniformBinds[Effect.UniformBinds.MainTexture];
        if (uniform) {
            if (texture === this._cachedValues.texture) { return false; }
            this._cachedValues.texture = texture;
            let glTexture = texture.texture || texture;
            this._gl.activeTexture(this._gl.TEXTURE0);
            this._gl.bindTexture(this._gl.TEXTURE_2D, glTexture);
            this.uniforms[uniform](glTexture, 0);
            return true;
        }
        return false;
    }

    /**
     * Set the main tint color.
     * Only works if there's a uniform type bound to 'Color'.
     * @param {Color} color Color to set.
     */
    setColor(color)
    {
        let uniform = this._uniformBinds[Effect.UniformBinds.Color];
        if (uniform) {
            if (color.equals(this._cachedValues.color)) { return; }
            this._cachedValues.color = color.clone();
            this.uniforms[uniform](color.floatArray);
        }
    }

    /**
     * Set uvOffset and uvScale params from source rectangle and texture.
     * @param {Rectangle} sourceRect Source rectangle to set, or null to take entire texture.
     * @param {TextureAsset} texture Texture asset to set source rect for.
     */
    setUvOffsetAndScale(sourceRect, texture)
    {
        // skip if the same
        if (sourceRect) {
            if (sourceRect.equals(this._cachedValues.sourceRect)) { return; }
        }
        else {
            if (this._cachedValues.sourceRect === null) { return; }
        }
        this._cachedValues.sourceRect = sourceRect ? sourceRect.clone() : null;

        // default source rect
        if (!sourceRect) { sourceRect = new Rectangle(0, 0, texture.width, texture.height); }

        // set uv offset
        let uvOffset = this._uniformBinds[Effect.UniformBinds.UvOffset];
        if (uvOffset) {
            this.uniforms[uvOffset](sourceRect.x / texture.width, sourceRect.y / texture.height);
        }
        
        // set uv scale
        let uvScale = this._uniformBinds[Effect.UniformBinds.UvScale];
        if (uvScale) {
            this.uniforms[uvScale](sourceRect.width / texture.width, sourceRect.height / texture.height);
        }
    }

    /**
     * Set the projection matrix uniform.
     * @param {Matrix} matrix Matrix to set.
     */
    setProjectionMatrix(matrix)
    {
        let uniform = this._uniformBinds[Effect.UniformBinds.Projection];
        if (uniform) {
            if (matrix.equals(this._cachedValues.projection)) { return; }
            this._cachedValues.projection = matrix.clone();
            this.uniforms[uniform](matrix.values);
        }
    }

    /**
     * Set the world matrix uniform.
     * @param {Matrix} matrix Matrix to set.
     */
    setWorldMatrix(matrix)
    {
        let uniform = this._uniformBinds[Effect.UniformBinds.World];
        if (uniform) {
            this.uniforms[uniform](matrix.values);
        }
    }
     
    /**
     * Set the vertices position buffer.
     * Only works if there's an attribute type bound to 'Position'.
     * @param {WebGLBuffer} buffer Vertices position buffer.
     */
    setPositionsAttribute(buffer)
    {
        let attr = this._attributeBinds[Effect.AttributeBinds.Position];
        if (attr) {
            if (buffer === this._cachedValues.positions) { return; }
            this._cachedValues.positions = buffer;
            this.attributes[attr](buffer);
        }
    }
     
    /**
     * Set the vertices texture coords buffer.
     * Only works if there's an attribute type bound to 'TextureCoords'.
     * @param {WebGLBuffer} buffer Vertices texture coords buffer.
     */
    setTextureCoordsAttribute(buffer)
    {
        let attr = this._attributeBinds[Effect.AttributeBinds.TextureCoords];
        if (attr) {
            if (buffer === this._cachedValues.coords) { return; }
            this._cachedValues.coords = buffer;
            this.attributes[attr](buffer);
        }
    }
         
    /**
     * Set the vertices colors buffer.
     * Only works if there's an attribute type bound to 'Colors'.
     * @param {WebGLBuffer} buffer Vertices colors buffer.
     */
     setColorsAttribute(buffer)
     {
         let attr = this._attributeBinds[Effect.AttributeBinds.Colors];
         if (attr) {
            if (buffer === this._cachedValues.colors) { return; }
            this._cachedValues.colors = buffer;
            this.attributes[attr](buffer);
         }
     }
}

/**
 * Build a shader.
 */
function compileShader(gl, code, type) 
{
    let shader = gl.createShader(type);

    gl.shaderSource(shader, code);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        _logger.error(`Error compiling ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"} shader:`);
        _logger.error(gl.getShaderInfoLog(shader));
        throw new Error("Failed to compile a shader.");
    }

    return shader;
}


/**
 * Uniform types enum.
 */
const UniformTypes = 
{
    Texture: 'texture',
    Matrix: 'uniformMatrix4fv',
    Color: 'uniform4fv',

    Float: 'uniform1f',
    FloatArray: 'uniform1fv',

    Int: 'uniform1i',
    IntArray: 'uniform1iv',

    Float2: 'uniform2f',
    Float2Array: 'uniform2fv',

    Int2: 'uniform2i',
    Int2Array: 'uniform2iv',
    
    Float3: 'uniform3f',
    Float3Array: 'uniform3fv',

    Int3: 'uniform3i',
    Int3Array: 'uniform3iv',
    
    Float4: 'uniform4f',
    Float4Array: 'uniform4fv',

    Int4: 'uniform4i',
    Int4Array: 'uniform4iv',
}
Object.defineProperty(UniformTypes, '_values', {
    value: new Set(Object.values(UniformTypes)),
    writable: false,
});
Object.freeze(UniformTypes);

// attach uniform types to effect
Effect.UniformTypes = UniformTypes;

// define uniform binds - connect uniform name to special usage, like key texture, etc.
Effect.UniformBinds = {
    MainTexture: 'texture',     // bind uniform to be used as the main texture.
    Color: 'color',             // bind uniform to be used as a main color.
    Projection: 'projection',   // bind uniform to be used as the projection matrix.
    World: 'world',             // bind uniform to be used as the world matrix.
    UvOffset: 'uvOffset',       // bind uniform to be used as UV offset.
    UvScale: 'uvScale',         // bind uniform to be used as UV scale.
};
Object.freeze(Effect.UniformBinds);

// define attribute value types.
Effect.AttributeTypes = {
    Byte: 'BYTE',
    Short: 'SHORT',
    UByte: 'UNSIGNED_BYTE',
    UShort: 'UNSIGNED_SHORT',
    Float: 'FLOAT',
    HalfFloat: 'HALF_FLOAT',
};
Object.freeze(Effect.AttributeTypes);

// define attribute binds - connect attribute name to special usage, like position, uvs, etc.
Effect.AttributeBinds = {
    Position: 'position',   // bind attribute to be used for vertices position array.
    TextureCoords: 'uvs',   // bind attribute to be used for texture coords array.
    Colors: 'colors',       // bind attribute to be used for vertices colors array.
}
Object.freeze(Effect.AttributeBinds);


// export the effect class.
module.exports = Effect;