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
    * [.uniformTypes](#Effect+uniformTypes) ⇒ <code>\*</code>
    * [.attributeTypes](#Effect+attributeTypes) ⇒ <code>\*</code>
    * [.vertexCode](#Effect+vertexCode) ⇒ <code>String</code>
    * [.fragmentCode](#Effect+fragmentCode) ⇒ <code>String</code>
    * [.enableDepthTest](#Effect+enableDepthTest)
    * [.enableFaceCulling](#Effect+enableFaceCulling)
    * [.enableStencilTest](#Effect+enableStencilTest)
    * [.enableDithering](#Effect+enableDithering)
    * [.setAsActive()](#Effect+setAsActive)
    * [.prepareToDrawBatch(mesh, world)](#Effect+prepareToDrawBatch)
    * [.setTexture(texture)](#Effect+setTexture) ⇒ <code>Boolean</code>
    * [.setColor(color)](#Effect+setColor)
    * [.setUvOffsetAndScale(sourceRect, texture)](#Effect+setUvOffsetAndScale)
    * [.setProjectionMatrix(matrix)](#Effect+setProjectionMatrix)
    * [.setWorldMatrix(matrix)](#Effect+setWorldMatrix)
    * [.setViewMatrix(matrix)](#Effect+setViewMatrix)
    * [.setPositionsAttribute(buffer, forceSetBuffer)](#Effect+setPositionsAttribute)
    * [.setTextureCoordsAttribute(buffer, forceSetBuffer)](#Effect+setTextureCoordsAttribute)
    * [.setColorsAttribute(buffer, forceSetBuffer)](#Effect+setColorsAttribute)

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
<a name="Effect+enableStencilTest"></a>

### effect.enableStencilTest
Should this effect enable stencil test?

**Kind**: instance property of [<code>Effect</code>](#Effect)  
<a name="Effect+enableDithering"></a>

### effect.enableDithering
Should this effect enable dithering?

**Kind**: instance property of [<code>Effect</code>](#Effect)  
<a name="Effect+setAsActive"></a>

### effect.setAsActive()
Make this effect active.

**Kind**: instance method of [<code>Effect</code>](#Effect)  
<a name="Effect+prepareToDrawBatch"></a>

### effect.prepareToDrawBatch(mesh, world)
Prepare effect before drawing it with batching.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| mesh | <code>Mesh</code> | Mesh we're about to draw. |
| world | <code>Matrix</code> | World matrix. |

<a name="Effect+setTexture"></a>

### effect.setTexture(texture) ⇒ <code>Boolean</code>
Set the main texture.
Only works if there's a uniform type bound to 'MainTexture'.

**Kind**: instance method of [<code>Effect</code>](#Effect)  
**Returns**: <code>Boolean</code> - True if texture was changed, false if there was no need to change the texture.  

| Param | Type | Description |
| --- | --- | --- |
| texture | <code>TextureAsset</code> | Texture to set. |

<a name="Effect+setColor"></a>

### effect.setColor(color)
Set the main tint color.
Only works if there's a uniform type bound to 'Color'.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>Color</code> | Color to set. |

<a name="Effect+setUvOffsetAndScale"></a>

### effect.setUvOffsetAndScale(sourceRect, texture)
Set uvOffset and uvScale params from source rectangle and texture.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| sourceRect | <code>Rectangle</code> | Source rectangle to set, or null to take entire texture. |
| texture | <code>TextureAsset</code> | Texture asset to set source rect for. |

<a name="Effect+setProjectionMatrix"></a>

### effect.setProjectionMatrix(matrix)
Set the projection matrix uniform.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| matrix | <code>Matrix</code> | Matrix to set. |

<a name="Effect+setWorldMatrix"></a>

### effect.setWorldMatrix(matrix)
Set the world matrix uniform.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| matrix | <code>Matrix</code> | Matrix to set. |

<a name="Effect+setViewMatrix"></a>

### effect.setViewMatrix(matrix)
Set the view matrix uniform.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| matrix | <code>Matrix</code> | Matrix to set. |

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
