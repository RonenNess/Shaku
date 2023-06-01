![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Sprite Batch 3D

<a name="SpriteBatch3D"></a>

## SpriteBatch3D
3D Sprites batch renderer. 
Responsible to drawing 3D quads with textures on them.

**Kind**: global class  

* [SpriteBatch3D](#SpriteBatch3D)
    * [new SpriteBatch3D([batchSpritesCount], [normalizeUvs])](#new_SpriteBatch3D_new)
    * [.camera](#SpriteBatch3D+camera) ⇒ <code>Camera</code>
    * [.supportVertexColor](#SpriteBatch3D+supportVertexColor)
    * [.defaultEffect](#SpriteBatch3D+defaultEffect)
    * [.setPerspectiveCamera([fieldOfView], [aspectRatio], [zNear], [zFar])](#SpriteBatch3D+setPerspectiveCamera)
    * [.setCamera(camera)](#SpriteBatch3D+setCamera)

<a name="new_SpriteBatch3D_new"></a>

### new SpriteBatch3D([batchSpritesCount], [normalizeUvs])
Create the 3d sprites batch.


| Param | Type | Description |
| --- | --- | --- |
| [batchSpritesCount] | <code>Number</code> | Internal buffers size, in sprites count (sprite = 4 vertices). Bigger value = faster rendering but more RAM. |
| [normalizeUvs] | <code>Boolean</code> | If true (default) will normalize UV values from 0 to 1. |

<a name="SpriteBatch3D+camera"></a>

### spriteBatch3D.camera ⇒ <code>Camera</code>
Get camera instance.

**Kind**: instance property of [<code>SpriteBatch3D</code>](#SpriteBatch3D)  
**Returns**: <code>Camera</code> - Camera instance.  
<a name="SpriteBatch3D+supportVertexColor"></a>

### spriteBatch3D.supportVertexColor
**Kind**: instance property of [<code>SpriteBatch3D</code>](#SpriteBatch3D)  
<a name="SpriteBatch3D+defaultEffect"></a>

### spriteBatch3D.defaultEffect
**Kind**: instance property of [<code>SpriteBatch3D</code>](#SpriteBatch3D)  
<a name="SpriteBatch3D+setPerspectiveCamera"></a>

### spriteBatch3D.setPerspectiveCamera([fieldOfView], [aspectRatio], [zNear], [zFar])
Set perspective camera.

**Kind**: instance method of [<code>SpriteBatch3D</code>](#SpriteBatch3D)  

| Param | Type | Description |
| --- | --- | --- |
| [fieldOfView] | <code>Number</code> | Camera field of view. |
| [aspectRatio] | <code>Number</code> | Camera aspect ratio |
| [zNear] | <code>Number</code> | Z near plane. |
| [zFar] | <code>Number</code> | Z far plane. |

<a name="SpriteBatch3D+setCamera"></a>

### spriteBatch3D.setCamera(camera)
Set the camera for this batch.

**Kind**: instance method of [<code>SpriteBatch3D</code>](#SpriteBatch3D)  

| Param | Type | Description |
| --- | --- | --- |
| camera | <code>Camera</code> | Camera object to apply when drawing, or null if you want to set the camera manually. |

