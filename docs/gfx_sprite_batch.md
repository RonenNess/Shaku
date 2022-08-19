![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Sprite Batch

<a name="SpriteBatch"></a>

## SpriteBatch
Sprite batch renderer, responsible on drawing a batch of sprites with as little draw calls as possible.

**Kind**: global class  

* [SpriteBatch](#SpriteBatch)
    * [new SpriteBatch(gfx)](#new_SpriteBatch_new)
    * [.snapPixels](#SpriteBatch+snapPixels)
    * [.applyAntiBleeding](#SpriteBatch+applyAntiBleeding)
    * [.drawing](#SpriteBatch+drawing) ⇒ <code>Boolean</code>
    * [.batchSpritesCount](#SpriteBatch+batchSpritesCount)
    * [.vertex(position, textureCoord, color)](#SpriteBatch+vertex) ⇒ <code>Vertex</code>
    * [.begin(effect, transform)](#SpriteBatch+begin)
    * [.end()](#SpriteBatch+end)
    * [.setTexture(texture)](#SpriteBatch+setTexture)
    * [.draw(sprites, cullOutOfScreen)](#SpriteBatch+draw)
    * [.pushVertices(vertices)](#SpriteBatch+pushVertices)

<a name="new_SpriteBatch_new"></a>

### new SpriteBatch(gfx)
Create the spritebatch.


| Param | Type | Description |
| --- | --- | --- |
| gfx | <code>Gfx</code> | Gfx manager. |

<a name="SpriteBatch+snapPixels"></a>

### spriteBatch.snapPixels
If true, will floor vertices positions before pushing them to batch.

**Kind**: instance property of [<code>SpriteBatch</code>](#SpriteBatch)  
<a name="SpriteBatch+applyAntiBleeding"></a>

### spriteBatch.applyAntiBleeding
If true, will slightly offset texture uv when rotating sprites, to prevent bleeding while using texture atlas.

**Kind**: instance property of [<code>SpriteBatch</code>](#SpriteBatch)  
<a name="SpriteBatch+drawing"></a>

### spriteBatch.drawing ⇒ <code>Boolean</code>
Get if batch is currently drawing.

**Kind**: instance property of [<code>SpriteBatch</code>](#SpriteBatch)  
**Returns**: <code>Boolean</code> - True if batch is drawing.  
<a name="SpriteBatch+batchSpritesCount"></a>

### spriteBatch.batchSpritesCount
How many sprites we can have in batch, in total.

**Kind**: instance property of [<code>SpriteBatch</code>](#SpriteBatch)  
<a name="SpriteBatch+vertex"></a>

### spriteBatch.vertex(position, textureCoord, color) ⇒ <code>Vertex</code>
Create and return a new vertex.

**Kind**: instance method of [<code>SpriteBatch</code>](#SpriteBatch)  
**Returns**: <code>Vertex</code> - new vertex object.  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>Vector2</code> | Vertex position. |
| textureCoord | <code>Vector2</code> | Vertex texture coord. |
| color | <code>Color</code> | Vertex color. |

<a name="SpriteBatch+begin"></a>

### spriteBatch.begin(effect, transform)
Start drawing a batch.

**Kind**: instance method of [<code>SpriteBatch</code>](#SpriteBatch)  

| Param | Type | Description |
| --- | --- | --- |
| effect | <code>Effect</code> | Effect to use. |
| transform | <code>Matrix</code> | Optional transformations to apply on all sprites. |

<a name="SpriteBatch+end"></a>

### spriteBatch.end()
Finish drawing batch (and render whatever left in buffers).

**Kind**: instance method of [<code>SpriteBatch</code>](#SpriteBatch)  
<a name="SpriteBatch+setTexture"></a>

### spriteBatch.setTexture(texture)
Set the currently active texture.

**Kind**: instance method of [<code>SpriteBatch</code>](#SpriteBatch)  

| Param | Type | Description |
| --- | --- | --- |
| texture | <code>Texture</code> | Texture to set. |

<a name="SpriteBatch+draw"></a>

### spriteBatch.draw(sprites, cullOutOfScreen)
Add sprite to batch.
Note: changing texture or blend mode may trigger a draw call.

**Kind**: instance method of [<code>SpriteBatch</code>](#SpriteBatch)  

| Param | Type | Description |
| --- | --- | --- |
| sprites | <code>Sprite</code> \| <code>Array.&lt;Sprite&gt;</code> | Sprite or multiple sprites to draw. |
| cullOutOfScreen | <code>Boolean</code> | If true, will cull sprites that are not visible. |

<a name="SpriteBatch+pushVertices"></a>

### spriteBatch.pushVertices(vertices)
Push vertices directly to batch.

**Kind**: instance method of [<code>SpriteBatch</code>](#SpriteBatch)  

| Param | Type | Description |
| --- | --- | --- |
| vertices | <code>Array.&lt;Vertex&gt;</code> | Vertices to push. |

