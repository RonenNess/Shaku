![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Sprite Batch

<a name="SpriteBatch"></a>

## SpriteBatch
Sprite batch renderer. 
Responsible to drawing a batch of sprites with as little draw calls as possible.

**Kind**: global class  

* [SpriteBatch](#SpriteBatch)
    * [new SpriteBatch([batchSpritesCount], [enableVertexColor])](#new_SpriteBatch_new)
    * [.defaultEffect](#SpriteBatch+defaultEffect)
    * [.drawVertices(texture, vertices)](#SpriteBatch+drawVertices)
    * [.drawQuad(texture, position, size, sourceRectangle, color, [rotation], [origin], [skew])](#SpriteBatch+drawQuad)
    * [.drawSpriteGroup(group, [cullOutOfScreen])](#SpriteBatch+drawSpriteGroup)
    * [.drawRectangle(texture, destRect, [sourceRect], color, [origin])](#SpriteBatch+drawRectangle)

<a name="new_SpriteBatch_new"></a>

### new SpriteBatch([batchSpritesCount], [enableVertexColor])
Create the sprites batch.


| Param | Type | Description |
| --- | --- | --- |
| [batchSpritesCount] | <code>Number</code> | Internal buffers size, in sprites count (sprite = 4 vertices). Bigger value = faster rendering but more RAM. |
| [enableVertexColor] | <code>Boolean</code> | If true (default) will support vertex color. |

<a name="SpriteBatch+defaultEffect"></a>

### spriteBatch.defaultEffect
**Kind**: instance property of [<code>SpriteBatch</code>](#SpriteBatch)  
<a name="SpriteBatch+drawVertices"></a>

### spriteBatch.drawVertices(texture, vertices)
Push vertices to drawing batch.

**Kind**: instance method of [<code>SpriteBatch</code>](#SpriteBatch)  

| Param | Type | Description |
| --- | --- | --- |
| texture | <code>TextureAssetBase</code> | Texture to draw. |
| vertices | <code>Array.&lt;Vertex&gt;</code> | Vertices to push. Vertices count must be dividable by 4 to keep the batch consistent of quads. |

<a name="SpriteBatch+drawQuad"></a>

### spriteBatch.drawQuad(texture, position, size, sourceRectangle, color, [rotation], [origin], [skew])
Add a quad to draw.

**Kind**: instance method of [<code>SpriteBatch</code>](#SpriteBatch)  

| Param | Type | Description |
| --- | --- | --- |
| texture | <code>TextureAssetBase</code> | Texture to draw. |
| position | <code>Vector2</code> \| <code>Vector3</code> | Drawing position (at origin). If vector3 is provided, will pass z value to the shader code position attribute. |
| size | <code>Vector2</code> \| <code>Vector3</code> \| <code>Number</code> | Drawing size. If vector3 is provided, will pass z value to the shader code position attribute for the bottom vertices, as position.z + size.z. |
| sourceRectangle | <code>Rectangle</code> | Source rectangle, or undefined to use the entire texture. |
| color | <code>Color</code> \| <code>Array.&lt;Color&gt;</code> \| <code>undefined</code> | Tint color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left. |
| [rotation] | <code>Number</code> | Rotate sprite. |
| [origin] | <code>Vector2</code> | Drawing origin. This will be the point at 'position' and rotation origin. |
| [skew] | <code>Vector2</code> | Skew the drawing corners on X and Y axis, around the origin point. |

<a name="SpriteBatch+drawSpriteGroup"></a>

### spriteBatch.drawSpriteGroup(group, [cullOutOfScreen])
Add sprites group to this batch.

**Kind**: instance method of [<code>SpriteBatch</code>](#SpriteBatch)  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>SpritesGroup</code> | Sprite group to draw. |
| [cullOutOfScreen] | <code>Boolean</code> | If true, will cull sprites that are not visible in currently set rendering region. |

<a name="SpriteBatch+drawRectangle"></a>

### spriteBatch.drawRectangle(texture, destRect, [sourceRect], color, [origin])
Add a quad that covers a given destination rectangle.

**Kind**: instance method of [<code>SpriteBatch</code>](#SpriteBatch)  

| Param | Type | Description |
| --- | --- | --- |
| texture | <code>TextureAssetBase</code> | Texture to draw. |
| destRect | <code>Rectangle</code> \| <code>Vector2</code> | Destination rectangle to draw on. If vector is provided, will draw from 0,0 with vector as size. |
| [sourceRect] | <code>Rectangle</code> | Source rectangle, or undefined to use the entire texture. |
| color | <code>Color</code> \| <code>Array.&lt;Color&gt;</code> \| <code>undefined</code> | Tint color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left. |
| [origin] | <code>Vector2</code> | Drawing origin. This will be the point at 'position' and rotation origin. |

