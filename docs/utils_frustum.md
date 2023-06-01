![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Frustum

<a name="Frustum"></a>

## Frustum
Implement a 3D Frustum shape.

**Kind**: global class  

* [Frustum](#Frustum)
    * [new Frustum(p0, p1, p2, p3, p4, p5)](#new_Frustum_new)
    * [.set(p0, p1, p2, p3, p4, p5)](#Frustum+set) ⇒ [<code>Frustum</code>](#Frustum)
    * [.copy(frustum)](#Frustum+copy) ⇒ [<code>Frustum</code>](#Frustum)
    * [.setFromProjectionMatrix(m)](#Frustum+setFromProjectionMatrix) ⇒ [<code>Frustum</code>](#Frustum)
    * [.collideSphere(sphere)](#Frustum+collideSphere) ⇒ <code>Boolean</code>
    * [.collideBox(box)](#Frustum+collideBox) ⇒ <code>Boolean</code>
    * [.containsPoint(point)](#Frustum+containsPoint) ⇒ <code>Boolean</code>
    * [.clone()](#Frustum+clone) ⇒ [<code>Frustum</code>](#Frustum)

<a name="new_Frustum_new"></a>

### new Frustum(p0, p1, p2, p3, p4, p5)
Create the frustum.


| Param | Type | Description |
| --- | --- | --- |
| p0 | <code>Plane</code> | Frustum plane. |
| p1 | <code>Plane</code> | Frustum plane. |
| p2 | <code>Plane</code> | Frustum plane. |
| p3 | <code>Plane</code> | Frustum plane. |
| p4 | <code>Plane</code> | Frustum plane. |
| p5 | <code>Plane</code> | Frustum plane. |

<a name="Frustum+set"></a>

### frustum.set(p0, p1, p2, p3, p4, p5) ⇒ [<code>Frustum</code>](#Frustum)
Set the Frustum values.

**Kind**: instance method of [<code>Frustum</code>](#Frustum)  
**Returns**: [<code>Frustum</code>](#Frustum) - Self.  

| Param | Type | Description |
| --- | --- | --- |
| p0 | <code>Plane</code> | Frustum plane. |
| p1 | <code>Plane</code> | Frustum plane. |
| p2 | <code>Plane</code> | Frustum plane. |
| p3 | <code>Plane</code> | Frustum plane. |
| p4 | <code>Plane</code> | Frustum plane. |
| p5 | <code>Plane</code> | Frustum plane. |

<a name="Frustum+copy"></a>

### frustum.copy(frustum) ⇒ [<code>Frustum</code>](#Frustum)
Copy values from another frustum.

**Kind**: instance method of [<code>Frustum</code>](#Frustum)  
**Returns**: [<code>Frustum</code>](#Frustum) - Self.  

| Param | Type | Description |
| --- | --- | --- |
| frustum | [<code>Frustum</code>](#Frustum) | Frustum to copy. |

<a name="Frustum+setFromProjectionMatrix"></a>

### frustum.setFromProjectionMatrix(m) ⇒ [<code>Frustum</code>](#Frustum)
Set frustum from projection matrix.

**Kind**: instance method of [<code>Frustum</code>](#Frustum)  
**Returns**: [<code>Frustum</code>](#Frustum) - Self.  

| Param | Type | Description |
| --- | --- | --- |
| m | <code>Matrix</code> | Matrix to build frustum from. |

<a name="Frustum+collideSphere"></a>

### frustum.collideSphere(sphere) ⇒ <code>Boolean</code>
Check if the frustum collides with a sphere.

**Kind**: instance method of [<code>Frustum</code>](#Frustum)  
**Returns**: <code>Boolean</code> - True if point is in frustum, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| sphere | <code>Sphere</code> | Sphere to check. |

<a name="Frustum+collideBox"></a>

### frustum.collideBox(box) ⇒ <code>Boolean</code>
Check if collide with a box.

**Kind**: instance method of [<code>Frustum</code>](#Frustum)  
**Returns**: <code>Boolean</code> - True if collide, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| box | <code>Box</code> | Box to check. |

<a name="Frustum+containsPoint"></a>

### frustum.containsPoint(point) ⇒ <code>Boolean</code>
Check if the frustum contains a point.

**Kind**: instance method of [<code>Frustum</code>](#Frustum)  
**Returns**: <code>Boolean</code> - True if point is in frustum, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| point | <code>Vector3</code> | Vector to check. |

<a name="Frustum+clone"></a>

### frustum.clone() ⇒ [<code>Frustum</code>](#Frustum)
Clone this frustum.

**Kind**: instance method of [<code>Frustum</code>](#Frustum)  
**Returns**: [<code>Frustum</code>](#Frustum) - Cloned frustum.  
