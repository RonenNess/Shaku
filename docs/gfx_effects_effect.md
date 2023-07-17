![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Effect

## Classes

<dl>
<dt><a href="#Effect">Effect</a></dt>
<dd><p>Effect base class.
An effect = vertex shader + fragment shader + uniforms &amp; attributes + setup code.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#compileShader">compileShader()</a></dt>
<dd><p>Build a shader.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#UniformType">UniformType</a> : <code>String</code></dt>
<dd></dd>
</dl>

<a name="Effect"></a>

## Effect
Effect base class.
An effect = vertex shader + fragment shader + uniforms & attributes + setup code.

**Kind**: global class  

* [Effect](#Effect)
    * [new Effect()](#new_Effect_new)
    * _instance_
        * [.uniformTypes](#Effect+uniformTypes) ⇒ <code>\*</code>
        * [.attributeTypes](#Effect+attributeTypes) ⇒ <code>\*</code>
        * [.vertexCode](#Effect+vertexCode) ⇒ <code>String</code>
        * [.fragmentCode](#Effect+fragmentCode) ⇒ <code>String</code>
        * [.enableDepthTest](#Effect+enableDepthTest)
        * [.enableFaceCulling](#Effect+enableFaceCulling)
        * [.depthFunc](#Effect+depthFunc)
        * [.enableStencilTest](#Effect+enableStencilTest)
        * [.enableDithering](#Effect+enableDithering)
        * [.polygonOffset](#Effect+polygonOffset) ⇒ <code>Boolean</code> \| <code>\*</code>
        * [.hasVertexColor](#Effect+hasVertexColor) ⇒ <code>Boolean</code>
        * [.setAsActive(overrideFlags)](#Effect+setAsActive)
        * [.getBoundUniform(bindKey)](#Effect+getBoundUniform) ⇒
        * [.setTexture(texture)](#Effect+setTexture) ⇒ <code>Boolean</code>
        * [.setColor(color)](#Effect+setColor)
        * [.setProjectionMatrix(matrix)](#Effect+setProjectionMatrix)
        * [.setWorldMatrix(matrix)](#Effect+setWorldMatrix)
        * [.setViewMatrix(matrix)](#Effect+setViewMatrix)
        * [.setOutline(weight, color)](#Effect+setOutline)
        * [.setUvNormalizationFactor(factor)](#Effect+setUvNormalizationFactor)
        * [.setPositionsAttribute(buffer, forceSetBuffer)](#Effect+setPositionsAttribute)
        * [.setTextureCoordsAttribute(buffer, forceSetBuffer)](#Effect+setTextureCoordsAttribute)
        * [.setColorsAttribute(buffer, forceSetBuffer)](#Effect+setColorsAttribute)
        * [.setNormalsAttribute(buffer, forceSetBuffer)](#Effect+setNormalsAttribute)
        * [.setBinormalsAttribute(buffer, forceSetBuffer)](#Effect+setBinormalsAttribute)
        * [.setTangentsAttribute(buffer, forceSetBuffer)](#Effect+setTangentsAttribute)
    * _static_
        * [.DepthFuncs](#Effect.DepthFuncs) ⇒ <code>\*</code>
        * [.UniformBinds](#Effect.UniformBinds)
        * [.AttributeTypes](#Effect.AttributeTypes)
        * [.AttributeBinds](#Effect.AttributeBinds)

<a name="new_Effect_new"></a>

### new Effect()
Create the effect.

<a name="Effect+uniformTypes"></a>

### effect.uniformTypes ⇒ <code>\*</code>
Get a dictionary with all shaders uniforms.
Key = uniform name, as appears in shader code.
Value = {
             type: UniformTypes to represent uniform type,
             bind: Optional bind to one of the built-in uniforms. See Effect.UniformBinds for details.
        }

**Kind**: instance property of [<code>Effect</code>](#Effect)  
**Returns**: <code>\*</code> - Dictionary with uniforms descriptions.  
<a name="Effect+attributeTypes"></a>

### effect.attributeTypes ⇒ <code>\*</code>
Get a dictionary with all shader attributes.
Key = attribute name, as appears in shader code.
Value = {
            size: size of every value in this attribute.
            type: attribute type. See Effect.AttributeTypes for details.
            normalize: if true, will normalize values.
            stride: optional stride. 
            offset: optional offset.
            bind: Optional bind to one of the built-in attributes. See Effect.AttributeBinds for details.
        }

**Kind**: instance property of [<code>Effect</code>](#Effect)  
**Returns**: <code>\*</code> - Dictionary with attributes descriptions.  
<a name="Effect+vertexCode"></a>

### effect.vertexCode ⇒ <code>String</code>
Get this effect's vertex shader code, as string.

**Kind**: instance property of [<code>Effect</code>](#Effect)  
**Returns**: <code>String</code> - Vertex shader code.  
<a name="Effect+fragmentCode"></a>

### effect.fragmentCode ⇒ <code>String</code>
Get this effect's fragment shader code, as string.

**Kind**: instance property of [<code>Effect</code>](#Effect)  
**Returns**: <code>String</code> - Fragment shader code.  
<a name="Effect+enableDepthTest"></a>

### effect.enableDepthTest
Should this effect enable depth test?

**Kind**: instance property of [<code>Effect</code>](#Effect)  
<a name="Effect+enableFaceCulling"></a>

### effect.enableFaceCulling
Should this effect enable face culling?

**Kind**: instance property of [<code>Effect</code>](#Effect)  
<a name="Effect+depthFunc"></a>

### effect.depthFunc
Get depth func to use when rendering using this effect.
Use 'DepthFuncs' to get options.

**Kind**: instance property of [<code>Effect</code>](#Effect)  
<a name="Effect+enableStencilTest"></a>

### effect.enableStencilTest
Should this effect enable stencil test?

**Kind**: instance property of [<code>Effect</code>](#Effect)  
<a name="Effect+enableDithering"></a>

### effect.enableDithering
Should this effect enable dithering?

**Kind**: instance property of [<code>Effect</code>](#Effect)  
<a name="Effect+polygonOffset"></a>

### effect.polygonOffset ⇒ <code>Boolean</code> \| <code>\*</code>
Get polygon offset factor, to apply on depth value before checking.

**Kind**: instance property of [<code>Effect</code>](#Effect)  
**Returns**: <code>Boolean</code> \| <code>\*</code> - Return false to disable polygon offset, or {factor, unit} to apply polygon offset.  
<a name="Effect+hasVertexColor"></a>

### effect.hasVertexColor ⇒ <code>Boolean</code>
Return if this effect have colors attribute on vertices.

**Kind**: instance property of [<code>Effect</code>](#Effect)  
**Returns**: <code>Boolean</code> - True if got vertices color attribute.  
<a name="Effect+setAsActive"></a>

### effect.setAsActive(overrideFlags)
Make this effect active.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| overrideFlags | <code>\*</code> | Optional flags to override in effect.  May include the following: enableDepthTest, enableFaceCulling, enableStencilTest, enableDithering. |

<a name="Effect+getBoundUniform"></a>

### effect.getBoundUniform(bindKey) ⇒
Get a uniform method from a bind key.

**Kind**: instance method of [<code>Effect</code>](#Effect)  
**Returns**: Uniform set method, or null if not set.  

| Param | Type | Description |
| --- | --- | --- |
| bindKey | <code>UniformBinds</code> | Uniform bind key. |

<a name="Effect+setTexture"></a>

### effect.setTexture(texture) ⇒ <code>Boolean</code>
Set the main texture.
Note: this will only work for effects that utilize the 'MainTexture' uniform.

**Kind**: instance method of [<code>Effect</code>](#Effect)  
**Returns**: <code>Boolean</code> - True if texture was changed, false if there was no need to change the texture.  

| Param | Type | Description |
| --- | --- | --- |
| texture | <code>TextureAssetBase</code> | Texture to set. |

<a name="Effect+setColor"></a>

### effect.setColor(color)
Set the main tint color.
Note: this will only work for effects that utilize the 'Color' uniform.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>Color</code> | Color to set. |

<a name="Effect+setProjectionMatrix"></a>

### effect.setProjectionMatrix(matrix)
Set the projection matrix uniform.
Note: this will only work for effects that utilize the 'Projection' uniform.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| matrix | <code>Matrix</code> | Matrix to set. |

<a name="Effect+setWorldMatrix"></a>

### effect.setWorldMatrix(matrix)
Set the world matrix uniform.
Note: this will only work for effects that utilize the 'World' uniform.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| matrix | <code>Matrix</code> | Matrix to set. |

<a name="Effect+setViewMatrix"></a>

### effect.setViewMatrix(matrix)
Set the view matrix uniform.
Note: this will only work for effects that utilize the 'View' uniform.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| matrix | <code>Matrix</code> | Matrix to set. |

<a name="Effect+setOutline"></a>

### effect.setOutline(weight, color)
Set outline params.
Note: this will only work for effects that utilize the 'OutlineWeight' and 'OutlineColor' uniforms.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| weight | <code>Number</code> | Outline weight, range from 0.0 to 1.0. |
| color | <code>Color</code> | Outline color. |

<a name="Effect+setUvNormalizationFactor"></a>

### effect.setUvNormalizationFactor(factor)
Set a factor to normalize UV values to be 0-1.
Note: this will only work for effects that utilize the 'UvNormalizationFactor' uniform.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| factor | <code>Vector2</code> | Normalize UVs factor. |

<a name="Effect+setPositionsAttribute"></a>

### effect.setPositionsAttribute(buffer, forceSetBuffer)
Set the vertices position buffer.
Only works if there's an attribute type bound to 'Position'.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>WebGLBuffer</code> | Vertices position buffer. |
| forceSetBuffer | <code>Boolean</code> | If true, will always set buffer even if buffer is currently set. |

<a name="Effect+setTextureCoordsAttribute"></a>

### effect.setTextureCoordsAttribute(buffer, forceSetBuffer)
Set the vertices texture coords buffer.
Only works if there's an attribute type bound to 'TextureCoords'.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>WebGLBuffer</code> | Vertices texture coords buffer. |
| forceSetBuffer | <code>Boolean</code> | If true, will always set buffer even if buffer is currently set. |

<a name="Effect+setColorsAttribute"></a>

### effect.setColorsAttribute(buffer, forceSetBuffer)
Set the vertices colors buffer.
Only works if there's an attribute type bound to 'Colors'.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>WebGLBuffer</code> | Vertices colors buffer. |
| forceSetBuffer | <code>Boolean</code> | If true, will always set buffer even if buffer is currently set. |

<a name="Effect+setNormalsAttribute"></a>

### effect.setNormalsAttribute(buffer, forceSetBuffer)
Set the vertices normals buffer.
Only works if there's an attribute type bound to 'Normals'.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>WebGLBuffer</code> | Vertices normals buffer. |
| forceSetBuffer | <code>Boolean</code> | If true, will always set buffer even if buffer is currently set. |

<a name="Effect+setBinormalsAttribute"></a>

### effect.setBinormalsAttribute(buffer, forceSetBuffer)
Set the vertices binormals buffer.
Only works if there's an attribute type bound to 'Binormals'.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>WebGLBuffer</code> | Vertices binormals buffer. |
| forceSetBuffer | <code>Boolean</code> | If true, will always set buffer even if buffer is currently set. |

<a name="Effect+setTangentsAttribute"></a>

### effect.setTangentsAttribute(buffer, forceSetBuffer)
Set the vertices tangents buffer.
Only works if there's an attribute type bound to 'Tangents'.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>WebGLBuffer</code> | Vertices tangents buffer. |
| forceSetBuffer | <code>Boolean</code> | If true, will always set buffer even if buffer is currently set. |

<a name="Effect.DepthFuncs"></a>

### Effect.DepthFuncs ⇒ <code>\*</code>
Get all supported depth funcs we can set.

**Kind**: static property of [<code>Effect</code>](#Effect)  
**Returns**: <code>\*</code> - Depth func options: {Never, Less, Equal, LessEqual, Greater, GreaterEqual, Always, NotEqual}.  
<a name="Effect.UniformBinds"></a>

### Effect.UniformBinds
Default uniform binds.
This is a set of commonly used uniforms and their names inside the shader code.

Every bind here comes with a built-in method to set and is used internally by Shaku.
For example, if you want to include outline properties in your effect, you can use the 'OutlineWeight' and 'OutlineColor' binds (with matching name in the shader code). 
When you use the built-in binds, Shaku will know how to set them itself when relevant, for example in text rendering Shaku will use the outline binds if they exist.

If you don't use the built-in binds you can just call your uniforms however you like, but you'll need to set them all manually. 
Shaku will not know how to set them.

**Kind**: static property of [<code>Effect</code>](#Effect)  
<a name="Effect.AttributeTypes"></a>

### Effect.AttributeTypes
Define attribute types.

**Kind**: static property of [<code>Effect</code>](#Effect)  
<a name="Effect.AttributeBinds"></a>

### Effect.AttributeBinds
Define built-in attribute binds to connect attribute names for specific use cases like position, uvs, colors, etc.
If an effect support one or more of these attributes, Shaku will know how to fill them automatically.

**Kind**: static property of [<code>Effect</code>](#Effect)  
<a name="UniformTypes"></a>

## UniformTypes : <code>enum</code>
Uniform types enum.

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| Texture | [<code>UniformType</code>](#UniformType) | <code>texture</code> | 
| Matrix | [<code>UniformType</code>](#UniformType) | <code>uniformMatrix4fv</code> | 
| Color | [<code>UniformType</code>](#UniformType) | <code>uniform4fv</code> | 
| Float | [<code>UniformType</code>](#UniformType) | <code>uniform1f</code> | 
| FloatArray | [<code>UniformType</code>](#UniformType) | <code>uniform1fv</code> | 
| Int | [<code>UniformType</code>](#UniformType) | <code>uniform1i</code> | 
| IntArray | [<code>UniformType</code>](#UniformType) | <code>uniform1iv</code> | 
| Float2 | [<code>UniformType</code>](#UniformType) | <code>uniform2f</code> | 
| Float2Array | [<code>UniformType</code>](#UniformType) | <code>uniform2fv</code> | 
| Int2 | [<code>UniformType</code>](#UniformType) | <code>uniform2i</code> | 
| Int2Array | [<code>UniformType</code>](#UniformType) | <code>uniform2iv</code> | 
| Float3 | [<code>UniformType</code>](#UniformType) | <code>uniform3f</code> | 
| Float3Array | [<code>UniformType</code>](#UniformType) | <code>uniform3fv</code> | 
| Int3 | [<code>UniformType</code>](#UniformType) | <code>uniform3i</code> | 
| Int3Array | [<code>UniformType</code>](#UniformType) | <code>uniform3iv</code> | 
| Float4 | [<code>UniformType</code>](#UniformType) | <code>uniform4f</code> | 
| Float4Array | [<code>UniformType</code>](#UniformType) | <code>uniform4fv</code> | 
| Int4 | [<code>UniformType</code>](#UniformType) | <code>uniform4i</code> | 
| Int4Array | [<code>UniformType</code>](#UniformType) | <code>uniform4iv</code> | 

<a name="compileShader"></a>

## compileShader()
Build a shader.

**Kind**: global function  
<a name="UniformType"></a>

## UniformType : <code>String</code>
**Kind**: global typedef  
