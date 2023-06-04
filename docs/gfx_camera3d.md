![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Camera3D

<a name="Camera3D"></a>

## Camera3D
Implements a 3d Camera object.

**Kind**: global class  

* [Camera3D](#Camera3D)
    * [new Camera3D(gfx)](#new_Camera3D_new)
    * [.projection](#Camera3D+projection)
    * [.view](#Camera3D+view)
    * [.calcVisibleFrustum()](#Camera3D+calcVisibleFrustum) ⇒ <code>Frustum</code>
    * [.setViewLookat([eyePosition], [lookAt])](#Camera3D+setViewLookat)
    * [.getDirection()](#Camera3D+getDirection) ⇒ <code>Vector3</code>
    * [.getViewProjection()](#Camera3D+getViewProjection) ⇒ <code>Matrix</code>
    * [.getProjectionView()](#Camera3D+getProjectionView) ⇒ <code>Matrix</code>
    * [.perspective(fieldOfView, aspectRatio, near, far)](#Camera3D+perspective)
    * [.unproject(point, zDistance)](#Camera3D+unproject) ⇒ <code>Vector3</code>

<a name="new_Camera3D_new"></a>

### new Camera3D(gfx)
Create the camera.


| Param | Type | Description |
| --- | --- | --- |
| gfx | <code>Gfx</code> | The gfx manager instance. |

<a name="Camera3D+projection"></a>

### camera3D.projection
Camera projection matrix.
You can set it manually, or use 'orthographicOffset' / 'orthographic' / 'perspective' helper functions.

**Kind**: instance property of [<code>Camera3D</code>](#Camera3D)  
<a name="Camera3D+view"></a>

### camera3D.view
Camera view matrix.
You can set it manually, or use 'setViewLookat' helper function.

**Kind**: instance property of [<code>Camera3D</code>](#Camera3D)  
<a name="Camera3D+calcVisibleFrustum"></a>

### camera3D.calcVisibleFrustum() ⇒ <code>Frustum</code>
Calc and return the currently-visible view frustum, based on active camera.

**Kind**: instance method of [<code>Camera3D</code>](#Camera3D)  
**Returns**: <code>Frustum</code> - Visible frustum.  
<a name="Camera3D+setViewLookat"></a>

### camera3D.setViewLookat([eyePosition], [lookAt])
Set camera view matrix from source position and lookat.

**Kind**: instance method of [<code>Camera3D</code>](#Camera3D)  

| Param | Type | Description |
| --- | --- | --- |
| [eyePosition] | <code>Vector3</code> | Camera source position. |
| [lookAt] | <code>Vector3</code> | Camera look-at target. |

<a name="Camera3D+getDirection"></a>

### camera3D.getDirection() ⇒ <code>Vector3</code>
Get 3d direction vector of this camera.

**Kind**: instance method of [<code>Camera3D</code>](#Camera3D)  
**Returns**: <code>Vector3</code> - 3D direction vector.  
<a name="Camera3D+getViewProjection"></a>

### camera3D.getViewProjection() ⇒ <code>Matrix</code>
Get view projection matrix.

**Kind**: instance method of [<code>Camera3D</code>](#Camera3D)  
**Returns**: <code>Matrix</code> - View-projection matrix.  
<a name="Camera3D+getProjectionView"></a>

### camera3D.getProjectionView() ⇒ <code>Matrix</code>
Get projection view matrix.

**Kind**: instance method of [<code>Camera3D</code>](#Camera3D)  
**Returns**: <code>Matrix</code> - Projection-view matrix.  
<a name="Camera3D+perspective"></a>

### camera3D.perspective(fieldOfView, aspectRatio, near, far)
Make this camera a perspective camera.

**Kind**: instance method of [<code>Camera3D</code>](#Camera3D)  

| Param | Type | Description |
| --- | --- | --- |
| fieldOfView | <code>\*</code> | Field of view angle in radians. |
| aspectRatio | <code>\*</code> | Aspect ratio. |
| near | <code>\*</code> | Near clipping plane. |
| far | <code>\*</code> | Far clipping plane. |

<a name="Camera3D+unproject"></a>

### camera3D.unproject(point, zDistance) ⇒ <code>Vector3</code>
Unproject a 2d vector into 3D space.
You can use this method to get the 3D direction the user points on with the mouse.

**Kind**: instance method of [<code>Camera3D</code>](#Camera3D)  
**Returns**: <code>Vector3</code> - Unprojected point in 3D space.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| point | <code>Vector2</code> |  | Vector to unproject. |
| zDistance | <code>Number</code> | <code>0</code> | Distance from camera to locate the 3D point at (0 = near plane, 1 = far plane). |

