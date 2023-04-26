![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Sprite

<a name="Sprite"></a>

## Sprite
Sprite class.

**Kind**: global class  

* [Sprite](#Sprite)
    * [new Sprite(texture, [sourceRectangle])](#new_Sprite_new)
    * _instance_
        * [.texture](#Sprite+texture) : <code>TextureAssetBase</code>
        * [.position](#Sprite+position) : <code>Vector2</code> \| <code>Vector3</code>
        * [.size](#Sprite+size) : <code>Vector2</code> \| <code>Vector3</code>
        * [.sourceRectangle](#Sprite+sourceRectangle) : <code>Rectangle</code>
        * [.rotation](#Sprite+rotation) : <code>Number</code>
        * [.origin](#Sprite+origin) : <code>Vector2</code>
        * [.skew](#Sprite+skew) : <code>Vector2</code>
        * [.color](#Sprite+color) : <code>Color</code> \| <code>Array.&lt;Color&gt;</code>
        * [.flipX](#Sprite+flipX) ⇒ <code>Boolean</code>
        * [.flipX](#Sprite+flipX)
        * [.flipY](#Sprite+flipY) ⇒ <code>Boolean</code>
        * [.flipY](#Sprite+flipY)
        * [.setToSourceRectangleSize()](#Sprite+setToSourceRectangleSize) ⇒ [<code>Sprite</code>](#Sprite)
        * [.setToTextureSize()](#Sprite+setToTextureSize) ⇒ [<code>Sprite</code>](#Sprite)
        * [.setSourceFromSpritesheet(texture, index, spritesCount, [margin], [setSize])](#Sprite+setSourceFromSpritesheet)
        * [.clone()](#Sprite+clone) ⇒ [<code>Sprite</code>](#Sprite)
    * _static_
        * [.build(texture, position, size, sourceRectangle, color, [rotation], [origin], [skew])](#Sprite.build) ⇒ [<code>Sprite</code>](#Sprite)

<a name="new_Sprite_new"></a>

### new Sprite(texture, [sourceRectangle])
Create the sprite object.


| Param | Type | Description |
| --- | --- | --- |
| texture | <code>TextureAssetBase</code> | Sprite texture. |
| [sourceRectangle] | <code>Rectangle</code> | Optional source rectangle. |

<a name="Sprite+texture"></a>

### sprite.texture : <code>TextureAssetBase</code>
Sprite's texture.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
<a name="Sprite+position"></a>

### sprite.position : <code>Vector2</code> \| <code>Vector3</code>
Sprite position.
If Vector3 is provided, the z value will be passed to vertices position in shader code.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
<a name="Sprite+size"></a>

### sprite.size : <code>Vector2</code> \| <code>Vector3</code>
Sprite size.
If Vector3 is provided, the z value will be passed to the bottom vertices position in shader code, as position.z + size.z.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
<a name="Sprite+sourceRectangle"></a>

### sprite.sourceRectangle : <code>Rectangle</code>
Sprite source rectangle in texture.
Null will take entire texture.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
<a name="Sprite+rotation"></a>

### sprite.rotation : <code>Number</code>
Sprite rotation in radians.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
<a name="Sprite+origin"></a>

### sprite.origin : <code>Vector2</code>
Sprite origin point.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
<a name="Sprite+skew"></a>

### sprite.skew : <code>Vector2</code>
Skew the sprite corners on X and Y axis, around the origin point.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
<a name="Sprite+color"></a>

### sprite.color : <code>Color</code> \| <code>Array.&lt;Color&gt;</code>
Sprite color.
If array is set, will assign each color to different vertex, starting from top-left.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
<a name="Sprite+flipX"></a>

### sprite.flipX ⇒ <code>Boolean</code>
Check if this sprite is flipped around X axis.
This is just a sugarcoat that returns if size.x < 0.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
**Returns**: <code>Boolean</code> - If sprite is flipped on X axis.  
<a name="Sprite+flipX"></a>

### sprite.flipX
Flip sprite around X axis.
This is just a sugarcoat that set size.x to negative or positive value, without changing its scale.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  

| Param | Type | Description |
| --- | --- | --- |
| flip | <code>Boolean</code> | Should we flip the sprite around X axis. If undefined, will take the negative of flipX current value, ie will toggle flipping. |

<a name="Sprite+flipY"></a>

### sprite.flipY ⇒ <code>Boolean</code>
Check if this sprite is flipped around y axis.
This is just a sugarcoat that returns if size.y < 0.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
**Returns**: <code>Boolean</code> - If sprite is flipped on Y axis.  
<a name="Sprite+flipY"></a>

### sprite.flipY
Flip sprite around Y axis.
This is just a sugarcoat that set size.y to negative or positive value, without changing its scale.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  

| Param | Type | Description |
| --- | --- | --- |
| flip | <code>Boolean</code> | Should we flip the sprite around Y axis. If undefined, will take the negative of flipY current value, ie will toggle flipping. |

<a name="Sprite+setToSourceRectangleSize"></a>

### sprite.setToSourceRectangleSize() ⇒ [<code>Sprite</code>](#Sprite)
Set size to source rectangle size.

**Kind**: instance method of [<code>Sprite</code>](#Sprite)  
**Returns**: [<code>Sprite</code>](#Sprite) - this.  
<a name="Sprite+setToTextureSize"></a>

### sprite.setToTextureSize() ⇒ [<code>Sprite</code>](#Sprite)
Set size to texture size.

**Kind**: instance method of [<code>Sprite</code>](#Sprite)  
**Returns**: [<code>Sprite</code>](#Sprite) - this.  
<a name="Sprite+setSourceFromSpritesheet"></a>

### sprite.setSourceFromSpritesheet(texture, index, spritesCount, [margin], [setSize])
Set the source Rectangle automatically from spritesheet.
This method get sprite index in sheet and how many sprites there are in total, and calculate the desired
offset and size in source Rectangle based on it + source image size.

**Kind**: instance method of [<code>Sprite</code>](#Sprite)  

| Param | Type | Description |
| --- | --- | --- |
| texture | <code>TextureAssetBase</code> | Texture to set source rectangle from. |
| index | <code>Vector2</code> | Sprite index in spritesheet. |
| spritesCount | <code>Vector2</code> | How many sprites there are in spritesheet in total. |
| [margin] | <code>Number</code> | How many pixels to trim from the tile (default is 0). |
| [setSize] | <code>Boolean</code> | If true will also set width and height based on source rectangle (default is true). |

<a name="Sprite+clone"></a>

### sprite.clone() ⇒ [<code>Sprite</code>](#Sprite)
Clone this sprite.

**Kind**: instance method of [<code>Sprite</code>](#Sprite)  
**Returns**: [<code>Sprite</code>](#Sprite) - cloned sprite.  
<a name="Sprite.build"></a>

### Sprite.build(texture, position, size, sourceRectangle, color, [rotation], [origin], [skew]) ⇒ [<code>Sprite</code>](#Sprite)
Build a sprite from params.

**Kind**: static method of [<code>Sprite</code>](#Sprite)  
**Returns**: [<code>Sprite</code>](#Sprite) - New sprite instance.  

| Param | Type | Description |
| --- | --- | --- |
| texture | <code>TextureAssetBase</code> | Sprite texture. |
| position | <code>Vector2</code> \| <code>Vector3</code> | Drawing position (at origin). If vector3 is provided, will pass z value to the shader code position attribute. |
| size | <code>Vector2</code> \| <code>Vector3</code> \| <code>Number</code> | Drawing size. If vector3 is provided, will pass z value to the shader code position attribute for the bottom vertices, as position.z + size.z. |
| sourceRectangle | <code>Rectangle</code> | Source rectangle, or undefined to use the entire texture. |
| color | <code>Color</code> \| <code>Array.&lt;Color&gt;</code> \| <code>undefined</code> | Tint color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left. |
| [rotation] | <code>Number</code> | Rotate sprite. |
| [origin] | <code>Vector2</code> | Drawing origin. This will be the point at 'position' and rotation origin. |
| [skew] | <code>Vector2</code> | Skew the drawing corners on X and Y axis, around the origin point. |

