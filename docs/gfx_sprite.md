![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Sprite

<a name="Sprite"></a>

## Sprite
Sprite class.
This object is a helper class to hold all the properties of a texture to render.

**Kind**: global class  

* [Sprite](#Sprite)
    * [new Sprite(texture, sourceRect)](#new_Sprite_new)
    * [.texture](#Sprite+texture) : <code>TextureAsset</code>
    * [.position](#Sprite+position) : <code>Vector2</code> \| <code>Vector3</code>
    * [.size](#Sprite+size) : <code>Vector2</code> \| <code>Vector3</code>
    * [.sourceRect](#Sprite+sourceRect) : <code>Rectangle</code>
    * [.blendMode](#Sprite+blendMode) : <code>BlendModes</code>
    * [.rotation](#Sprite+rotation) : <code>Number</code>
    * [.origin](#Sprite+origin) : <code>Vector2</code>
    * [.skew](#Sprite+skew) : <code>Vector2</code>
    * [.color](#Sprite+color) : <code>Color</code> \| <code>Array.&lt;Color&gt;</code>
    * [.flipX](#Sprite+flipX) ⇒ <code>Boolean</code>
    * [.flipX](#Sprite+flipX)
    * [.flipY](#Sprite+flipY) ⇒ <code>Boolean</code>
    * [.flipY](#Sprite+flipY)
    * [.clone()](#Sprite+clone) ⇒ [<code>Sprite</code>](#Sprite)

<a name="new_Sprite_new"></a>

### new Sprite(texture, sourceRect)
Create the texture object.


| Param | Type | Description |
| --- | --- | --- |
| texture | <code>TextureAsset</code> | Texture asset. |
| sourceRect | <code>Rectangle</code> | Optional source rect. |

<a name="Sprite+texture"></a>

### sprite.texture : <code>TextureAsset</code>
Texture to use for this sprite.

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
<a name="Sprite+sourceRect"></a>

### sprite.sourceRect : <code>Rectangle</code>
Sprite source rectangle in texture.
Null will take entire texture.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
<a name="Sprite+blendMode"></a>

### sprite.blendMode : <code>BlendModes</code>
Sprite blend mode.

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

<a name="Sprite+clone"></a>

### sprite.clone() ⇒ [<code>Sprite</code>](#Sprite)
Clone this sprite.

**Kind**: instance method of [<code>Sprite</code>](#Sprite)  
**Returns**: [<code>Sprite</code>](#Sprite) - cloned sprite.  
