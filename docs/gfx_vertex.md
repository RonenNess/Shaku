![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Vertex

<a name="Vertex"></a>

## Vertex
A vertex we can push to sprite batch.

**Kind**: global class  

* [Vertex](#Vertex)
    * [new Vertex(position, textureCoord, color)](#new_Vertex_new)
    * [.setPosition(position, useRef)](#Vertex+setPosition) ⇒ [<code>Vertex</code>](#Vertex)
    * [.setTextureCoords(textureCoord, useRef)](#Vertex+setTextureCoords) ⇒ [<code>Vertex</code>](#Vertex)
    * [.setColor(color, useRef)](#Vertex+setColor) ⇒ [<code>Vertex</code>](#Vertex)

<a name="new_Vertex_new"></a>

### new Vertex(position, textureCoord, color)
Create the vertex data.


| Param | Type | Description |
| --- | --- | --- |
| position | <code>Vector2</code> \| <code>Vector3</code> | Vertex position. |
| textureCoord | <code>Vector2</code> | Vertex texture coord (in pixels). |
| color | <code>Color</code> | Vertex color (undefined will default to white). |

<a name="Vertex+setPosition"></a>

### vertex.setPosition(position, useRef) ⇒ [<code>Vertex</code>](#Vertex)
Set position.

**Kind**: instance method of [<code>Vertex</code>](#Vertex)  
**Returns**: [<code>Vertex</code>](#Vertex) - this.  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>Vector2</code> \| <code>Vector3</code> | Vertex position. |
| useRef | <code>Boolean</code> | If true, will not clone the given position vector and use its reference instead. |

<a name="Vertex+setTextureCoords"></a>

### vertex.setTextureCoords(textureCoord, useRef) ⇒ [<code>Vertex</code>](#Vertex)
Set texture coordinates.

**Kind**: instance method of [<code>Vertex</code>](#Vertex)  
**Returns**: [<code>Vertex</code>](#Vertex) - this.  

| Param | Type | Description |
| --- | --- | --- |
| textureCoord | <code>Vector2</code> | Vertex texture coord (in pixels). |
| useRef | <code>Boolean</code> | If true, will not clone the given coords vector and use its reference instead. |

<a name="Vertex+setColor"></a>

### vertex.setColor(color, useRef) ⇒ [<code>Vertex</code>](#Vertex)
Set vertex color.

**Kind**: instance method of [<code>Vertex</code>](#Vertex)  
**Returns**: [<code>Vertex</code>](#Vertex) - this.  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>Color</code> | Vertex color. |
| useRef | <code>Boolean</code> | If true, will not clone the given color and use its reference instead. |

