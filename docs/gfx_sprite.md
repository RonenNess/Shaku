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
    * [.position](#Sprite+position) : <code>Vector2</code>
    * [.size](#Sprite+size) : <code>Vector2</code>
    * [.sourceRect](#Sprite+sourceRect) : <code>Rectangle</code>
    * [.blendMode](#Sprite+blendMode) : <code>BlendModes</code>
    * [.rotation](#Sprite+rotation) : <code>Number</code>
    * [.origin](#Sprite+origin) : <code>Vector2</code>
    * [.color](#Sprite+color) : <code>Color</code>

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

### sprite.position : <code>Vector2</code>
Sprite position.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
<a name="Sprite+size"></a>

### sprite.size : <code>Vector2</code>
Sprite size.

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
<a name="Sprite+color"></a>

### sprite.color : <code>Color</code>
Sprite color.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
