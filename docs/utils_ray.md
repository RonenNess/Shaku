![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Ray

<a name="Ray"></a>

## Ray
A 3D ray.

**Kind**: global class  

* [Ray](#Ray)
    * [new Ray(origin, direction)](#new_Ray_new)
    * [.set(origin, direction)](#Ray+set) ⇒ <code>Plane</code>
    * [.copy(ray)](#Ray+copy) ⇒ [<code>Ray</code>](#Ray)
    * [.equals(ray)](#Ray+equals) ⇒ <code>Boolean</code>
    * [.at(distance)](#Ray+at) ⇒ <code>Vector3</code>
    * [.distanceToPoint(point)](#Ray+distanceToPoint) ⇒ <code>Number</code>
    * [.distanceToPointSquared(point)](#Ray+distanceToPointSquared) ⇒ <code>Number</code>
    * [.collideSphere(sphere)](#Ray+collideSphere) ⇒ <code>Boolean</code>
    * [.collideBox(box)](#Ray+collideBox) ⇒ <code>Boolean</code>
    * [.findColliionPointWithBox(box)](#Ray+findColliionPointWithBox) ⇒ <code>Vector3</code> \| <code>null</code>
    * [.clone()](#Ray+clone) ⇒ [<code>Ray</code>](#Ray)

<a name="new_Ray_new"></a>

### new Ray(origin, direction)
Create the Ray.


| Param | Type | Description |
| --- | --- | --- |
| origin | <code>Vector3</code> | Ray origin point. |
| direction | <code>Vector3</code> | Ray 3d direction. |

<a name="Ray+set"></a>

### ray.set(origin, direction) ⇒ <code>Plane</code>
Set the ray components.

**Kind**: instance method of [<code>Ray</code>](#Ray)  
**Returns**: <code>Plane</code> - Self.  

| Param | Type | Description |
| --- | --- | --- |
| origin | <code>Vector3</code> | Ray origin point. |
| direction | <code>Vector3</code> | Ray 3d direction. |

<a name="Ray+copy"></a>

### ray.copy(ray) ⇒ [<code>Ray</code>](#Ray)
Copy values from another ray.

**Kind**: instance method of [<code>Ray</code>](#Ray)  
**Returns**: [<code>Ray</code>](#Ray) - Self.  

| Param | Type | Description |
| --- | --- | --- |
| ray | [<code>Ray</code>](#Ray) | Ray to copy. |

<a name="Ray+equals"></a>

### ray.equals(ray) ⇒ <code>Boolean</code>
Check if this ray equals another ray.

**Kind**: instance method of [<code>Ray</code>](#Ray)  
**Returns**: <code>Boolean</code> - True if equal, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| ray | [<code>Ray</code>](#Ray) | Other ray to compare to. |

<a name="Ray+at"></a>

### ray.at(distance) ⇒ <code>Vector3</code>
Get the 3d point on the ray by distance from origin.

**Kind**: instance method of [<code>Ray</code>](#Ray)  
**Returns**: <code>Vector3</code> - Point on ray from origin.  

| Param | Type | Description |
| --- | --- | --- |
| distance | <code>Number</code> | Distance from origin to travel. |

<a name="Ray+distanceToPoint"></a>

### ray.distanceToPoint(point) ⇒ <code>Number</code>
Calculate distance to a 3d point.

**Kind**: instance method of [<code>Ray</code>](#Ray)  
**Returns**: <code>Number</code> - Distance to point.  

| Param | Type | Description |
| --- | --- | --- |
| point | <code>Vector3</code> | Point to calculate distance to. |

<a name="Ray+distanceToPointSquared"></a>

### ray.distanceToPointSquared(point) ⇒ <code>Number</code>
Calculate squared distance to a 3d point.

**Kind**: instance method of [<code>Ray</code>](#Ray)  
**Returns**: <code>Number</code> - Squared distance to point.  

| Param | Type | Description |
| --- | --- | --- |
| point | <code>Vector3</code> | Point to calculate distance to. |

<a name="Ray+collideSphere"></a>

### ray.collideSphere(sphere) ⇒ <code>Boolean</code>
Check if this ray collides with a sphere.

**Kind**: instance method of [<code>Ray</code>](#Ray)  
**Returns**: <code>Boolean</code> - True if collide with sphere, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| sphere | <code>Sphere</code> | Sphere to test collision with. |

<a name="Ray+collideBox"></a>

### ray.collideBox(box) ⇒ <code>Boolean</code>
Check if this ray collides with a box.

**Kind**: instance method of [<code>Ray</code>](#Ray)  
**Returns**: <code>Boolean</code> - True if collide with box, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| box | <code>Box</code> | Box to test collision with. |

<a name="Ray+findColliionPointWithBox"></a>

### ray.findColliionPointWithBox(box) ⇒ <code>Vector3</code> \| <code>null</code>
Return the collision point between the ray and a box, or null if they don't collide.

**Kind**: instance method of [<code>Ray</code>](#Ray)  
**Returns**: <code>Vector3</code> \| <code>null</code> - Collision point or null.  

| Param | Type | Description |
| --- | --- | --- |
| box | <code>Box</code> | Box to get collision with. |

<a name="Ray+clone"></a>

### ray.clone() ⇒ [<code>Ray</code>](#Ray)
Clone this ray.

**Kind**: instance method of [<code>Ray</code>](#Ray)  
**Returns**: [<code>Ray</code>](#Ray) - Cloned ray.  
