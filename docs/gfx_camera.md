![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Camera

<a name="Camera"></a>

## Camera
Implements a Camera object.

**Kind**: global class  

* [Camera](#Camera)
    * [new Camera(gfx)](#new_Camera_new)
    * [.projection](#Camera+projection)
    * [.viewport](#Camera+viewport) ⇒ <code>Rectangle</code>
    * [.viewport](#Camera+viewport)
    * [.getRegion()](#Camera+getRegion) ⇒ <code>Rectangle</code>
    * [.orthographicOffset(offset, ignoreViewportSize, near, far)](#Camera+orthographicOffset)
    * [.orthographic(region, near, far)](#Camera+orthographic)

<a name="new_Camera_new"></a>

### new Camera(gfx)
Create the camera.


| Param | Type | Description |
| --- | --- | --- |
| gfx | <code>Gfx</code> | The gfx manager instance. |

<a name="Camera+projection"></a>

### camera.projection
Camera projection matrix.
You can set it manually, or use 'orthographicOffset' / 'orthographic' / 'perspective' helper functions.

**Kind**: instance property of [<code>Camera</code>](#Camera)  
<a name="Camera+viewport"></a>

### camera.viewport ⇒ <code>Rectangle</code>
Get camera's viewport (drawing region to set when using this camera).

**Kind**: instance property of [<code>Camera</code>](#Camera)  
**Returns**: <code>Rectangle</code> - Camera's viewport as rectangle.  
<a name="Camera+viewport"></a>

### camera.viewport
Set camera's viewport.

**Kind**: instance property of [<code>Camera</code>](#Camera)  

| Param | Type | Description |
| --- | --- | --- |
| viewport | <code>Rectangle</code> | New viewport to set or null to not use any viewport when using this camera. |

<a name="Camera+getRegion"></a>

### camera.getRegion() ⇒ <code>Rectangle</code>
Get the region this camera covers.

**Kind**: instance method of [<code>Camera</code>](#Camera)  
**Returns**: <code>Rectangle</code> - region this camera covers.  
<a name="Camera+orthographicOffset"></a>

### camera.orthographicOffset(offset, ignoreViewportSize, near, far)
Make this camera an orthographic camera with offset.

**Kind**: instance method of [<code>Camera</code>](#Camera)  

| Param | Type | Description |
| --- | --- | --- |
| offset | <code>Vector2</code> | Camera offset (top-left corner). |
| ignoreViewportSize | <code>Boolean</code> | If true, will take the entire canvas size for calculation and ignore the viewport size, if set. |
| near | <code>Number</code> | Near clipping plane. |
| far | <code>Number</code> | Far clipping plane. |

<a name="Camera+orthographic"></a>

### camera.orthographic(region, near, far)
Make this camera an orthographic camera.

**Kind**: instance method of [<code>Camera</code>](#Camera)  

| Param | Type | Description |
| --- | --- | --- |
| region | <code>Rectangle</code> | Camera left, top, bottom and right. If not set, will take entire canvas. |
| near | <code>Number</code> | Near clipping plane. |
| far | <code>Number</code> | Far clipping plane. |

