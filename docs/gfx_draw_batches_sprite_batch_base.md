![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Sprite Batch Base

<a name="SpriteBatchBase"></a>

## SpriteBatchBase
Base class for sprite-based rendering, ie vertices with textures.

**Kind**: global class  

* [SpriteBatchBase](#SpriteBatchBase)
    * [new SpriteBatchBase([batchSpritesCount], [enableVertexColor], [enableNormals])](#new_SpriteBatchBase_new)
    * [.isDestroyed](#SpriteBatchBase+isDestroyed)
    * [.supportVertexColor](#SpriteBatchBase+supportVertexColor) ⇒ <code>Boolean</code>
    * [.defaultEffect](#SpriteBatchBase+defaultEffect)
    * [.quadsInBatch](#SpriteBatchBase+quadsInBatch) ⇒ <code>Number</code>
    * [.maxQuadsCount](#SpriteBatchBase+maxQuadsCount) ⇒ <code>Number</code>
    * [.isFull](#SpriteBatchBase+isFull) ⇒ <code>Boolean</code>
    * [.destroy()](#SpriteBatchBase+destroy)
    * [.clear()](#SpriteBatchBase+clear)
    * [.drawSprite(sprites, [transform], [cullOutOfScreen])](#SpriteBatchBase+drawSprite)

<a name="new_SpriteBatchBase_new"></a>

### new SpriteBatchBase([batchSpritesCount], [enableVertexColor], [enableNormals])
Create the sprites batch.


| Param | Type | Description |
| --- | --- | --- |
| [batchSpritesCount] | <code>Number</code> | Internal buffers size, in sprites count (sprite = 4 vertices). Bigger value = faster rendering but more RAM. |
| [enableVertexColor] | <code>Boolean</code> | If true (default) will support vertex color. |
| [enableNormals] | <code>Boolean</code> | If true (not default) will support vertex normals. |

<a name="SpriteBatchBase+isDestroyed"></a>

### spriteBatchBase.isDestroyed
**Kind**: instance property of [<code>SpriteBatchBase</code>](#SpriteBatchBase)  
<a name="SpriteBatchBase+supportVertexColor"></a>

### spriteBatchBase.supportVertexColor ⇒ <code>Boolean</code>
Get if this sprite batch support vertex color.

**Kind**: instance property of [<code>SpriteBatchBase</code>](#SpriteBatchBase)  
**Returns**: <code>Boolean</code> - True if support vertex color.  
<a name="SpriteBatchBase+defaultEffect"></a>

### spriteBatchBase.defaultEffect
**Kind**: instance property of [<code>SpriteBatchBase</code>](#SpriteBatchBase)  
<a name="SpriteBatchBase+quadsInBatch"></a>

### spriteBatchBase.quadsInBatch ⇒ <code>Number</code>
Get how many quads are currently in batch.

**Kind**: instance property of [<code>SpriteBatchBase</code>](#SpriteBatchBase)  
**Returns**: <code>Number</code> - Quads in batch count.  
<a name="SpriteBatchBase+maxQuadsCount"></a>

### spriteBatchBase.maxQuadsCount ⇒ <code>Number</code>
Get how many quads this sprite batch can contain.

**Kind**: instance property of [<code>SpriteBatchBase</code>](#SpriteBatchBase)  
**Returns**: <code>Number</code> - Max quads count.  
<a name="SpriteBatchBase+isFull"></a>

### spriteBatchBase.isFull ⇒ <code>Boolean</code>
Check if this batch is full.

**Kind**: instance property of [<code>SpriteBatchBase</code>](#SpriteBatchBase)  
**Returns**: <code>Boolean</code> - True if batch is full.  
<a name="SpriteBatchBase+destroy"></a>

### spriteBatchBase.destroy()
**Kind**: instance method of [<code>SpriteBatchBase</code>](#SpriteBatchBase)  
<a name="SpriteBatchBase+clear"></a>

### spriteBatchBase.clear()
**Kind**: instance method of [<code>SpriteBatchBase</code>](#SpriteBatchBase)  
<a name="SpriteBatchBase+drawSprite"></a>

### spriteBatchBase.drawSprite(sprites, [transform], [cullOutOfScreen])
Add sprite or sprites to batch.

**Kind**: instance method of [<code>SpriteBatchBase</code>](#SpriteBatchBase)  

| Param | Type | Description |
| --- | --- | --- |
| sprites | <code>Sprite</code> \| <code>Array.&lt;Sprite&gt;</code> | Sprite or multiple sprites to draw. |
| [transform] | <code>Matrix</code> | Optional transformations to apply on sprite vertices. Won't apply on static sprites. |
| [cullOutOfScreen] | <code>Boolean</code> | If true, will cull sprites that are not visible in currently set rendering region. |

