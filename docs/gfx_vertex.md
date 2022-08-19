![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Vertex

<a name="Vertex"></a>

## Vertex
A vertex we can push to sprite batch.

**Kind**: global class  

* [Vertex](#Vertex)
    * [new Vertex(position, textureCoord, color)](#new_Vertex_new)
    * [.transform(matrix)](#Vertex+transform) ⇒ [<code>Vertex</code>](#Vertex)
    * [.setPosition(position)](#Vertex+setPosition) ⇒ [<code>Vertex</code>](#Vertex)
    * [.setTextureCoords(textureCoord)](#Vertex+setTextureCoords) ⇒ [<code>Vertex</code>](#Vertex)
    * [.setColor(color)](#Vertex+setColor) ⇒ [<code>Vertex</code>](#Vertex)

<a name="new_Vertex_new"></a>

### new Vertex(position, textureCoord, color)
Create the vertex data.


| Param | Type | Description |
| --- | --- | --- |
| position | <code>Vector2</code> \| <code>Vector3</code> | Vertex position. |
| textureCoord | <code>Vector2</code> | Vertex texture coord (in pixels). |
| color | <code>Color</code> | Vertex color (undefined will default to white). |

<a name="Vertex+transform"></a>

### vertex.transform(matrix) ⇒ [<code>Vertex</code>](#Vertex)
Transform this vertex position from a matrix.

**Kind**: instance method of [<code>Vertex</code>](#Vertex)  
**Returns**: [<code>Vertex</code>](#Vertex) - this.  

| Param | Type | Description |
| --- | --- | --- |
| matrix | <code>Matrix</code> | Transformation matrix. |

<a name="Vertex+setPosition"></a>

### vertex.setPosition(position) ⇒ [<code>Vertex</code>](#Vertex)
Set position.

**Kind**: instance method of [<code>Vertex</code>](#Vertex)  
**Returns**: [<code>Vertex</code>](#Vertex) - this.  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>Vector2</code> \| <code>Vector3</code> | Vertex position. |

<a name="Vertex+setTextureCoords"></a>

### vertex.setTextureCoords(textureCoord) ⇒ [<code>Vertex</code>](#Vertex)
Set texture coordinates.

**Kind**: instance method of [<code>Vertex</code>](#Vertex)  
**Returns**: [<code>Vertex</code>](#Vertex) - this.  

| Param | Type | Description |
| --- | --- | --- |
| textureCoord | <code>Vector2</code> | Vertex texture coord (in pixels). |

<a name="Vertex+setColor"></a>

### vertex.setColor(color) ⇒ [<code>Vertex</code>](#Vertex)
Set vertex color.

**Kind**: instance method of [<code>Vertex</code>](#Vertex)  
**Returns**: [<code>Vertex</code>](#Vertex) - this.  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>Color</code> | Vertex color. |

