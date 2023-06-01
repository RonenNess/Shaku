![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Plane

<a name="Plane"></a>

## Plane
A plane in 3D space shape.

**Kind**: global class  

* [Plane](#Plane)
    * [new Plane(normal, constant)](#new_Plane_new)
    * [.set(normal, constant)](#Plane+set) ⇒ [<code>Plane</code>](#Plane)
    * [.setComponents(x, y, z, w)](#Plane+setComponents) ⇒ [<code>Plane</code>](#Plane)
    * [.setFromNormalAndCoplanarPoint(normal, point)](#Plane+setFromNormalAndCoplanarPoint) ⇒ [<code>Plane</code>](#Plane)
    * [.copy(plane)](#Plane+copy) ⇒ [<code>Plane</code>](#Plane)
    * [.normalizeSelf()](#Plane+normalizeSelf) ⇒ [<code>Plane</code>](#Plane)
    * [.normalized()](#Plane+normalized) ⇒ [<code>Plane</code>](#Plane)
    * [.negateSelf()](#Plane+negateSelf) ⇒ [<code>Plane</code>](#Plane)
    * [.distanceToPoint(point)](#Plane+distanceToPoint) ⇒ <code>Number</code>
    * [.distanceToSphere(sphere)](#Plane+distanceToSphere) ⇒ <code>Number</code>
    * [.collideLine(line)](#Plane+collideLine) ⇒ <code>Boolean</code>
    * [.collideSphere(sphere)](#Plane+collideSphere) ⇒ <code>Boolean</code>
    * [.coplanarPoint()](#Plane+coplanarPoint) ⇒ <code>Vector3</code>
    * [.translateSelf(offset)](#Plane+translateSelf) ⇒ [<code>Plane</code>](#Plane)
    * [.equals(plane)](#Plane+equals) ⇒ <code>Boolean</code>
    * [.clone()](#Plane+clone) ⇒ [<code>Plane</code>](#Plane)

<a name="new_Plane_new"></a>

### new Plane(normal, constant)
Create the plane.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| normal | <code>Vector3</code> |  | Plane normal vector. |
| constant | <code>Number</code> | <code>0</code> | Plane constant. |

<a name="Plane+set"></a>

### plane.set(normal, constant) ⇒ [<code>Plane</code>](#Plane)
Set the plane components.

**Kind**: instance method of [<code>Plane</code>](#Plane)  
**Returns**: [<code>Plane</code>](#Plane) - Self.  

| Param | Type | Description |
| --- | --- | --- |
| normal | <code>Vector3</code> | Plane normal. |
| constant | <code>Number</code> | Plane constant. |

<a name="Plane+setComponents"></a>

### plane.setComponents(x, y, z, w) ⇒ [<code>Plane</code>](#Plane)
Set the plane components.

**Kind**: instance method of [<code>Plane</code>](#Plane)  
**Returns**: [<code>Plane</code>](#Plane) - Self.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | Plane normal X. |
| y | <code>Number</code> | Plane normal Y. |
| z | <code>Number</code> | Plane normal Z. |
| w | <code>Number</code> | Plane constant. |

<a name="Plane+setFromNormalAndCoplanarPoint"></a>

### plane.setFromNormalAndCoplanarPoint(normal, point) ⇒ [<code>Plane</code>](#Plane)
Set plane from normal and coplanar point vectors.

**Kind**: instance method of [<code>Plane</code>](#Plane)  
**Returns**: [<code>Plane</code>](#Plane) - Self.  

| Param | Type | Description |
| --- | --- | --- |
| normal | <code>Vector3</code> | Plane normal. |
| point | <code>Vector3</code> | Coplanar point. |

<a name="Plane+copy"></a>

### plane.copy(plane) ⇒ [<code>Plane</code>](#Plane)
Copy values from another plane.

**Kind**: instance method of [<code>Plane</code>](#Plane)  
**Returns**: [<code>Plane</code>](#Plane) - Self.  

| Param | Type | Description |
| --- | --- | --- |
| plane | [<code>Plane</code>](#Plane) | Plane to copy. |

<a name="Plane+normalizeSelf"></a>

### plane.normalizeSelf() ⇒ [<code>Plane</code>](#Plane)
Normalize the plane.

**Kind**: instance method of [<code>Plane</code>](#Plane)  
**Returns**: [<code>Plane</code>](#Plane) - self.  
<a name="Plane+normalized"></a>

### plane.normalized() ⇒ [<code>Plane</code>](#Plane)
Normalize a clone of this plane.

**Kind**: instance method of [<code>Plane</code>](#Plane)  
**Returns**: [<code>Plane</code>](#Plane) - Normalized clone.  
<a name="Plane+negateSelf"></a>

### plane.negateSelf() ⇒ [<code>Plane</code>](#Plane)
Negate this plane.

**Kind**: instance method of [<code>Plane</code>](#Plane)  
**Returns**: [<code>Plane</code>](#Plane) - Self.  
<a name="Plane+distanceToPoint"></a>

### plane.distanceToPoint(point) ⇒ <code>Number</code>
Calculate distance to point.

**Kind**: instance method of [<code>Plane</code>](#Plane)  
**Returns**: <code>Number</code> - Distance to point.  

| Param | Type | Description |
| --- | --- | --- |
| point | <code>Vector3</code> | Point to calculate distance to. |

<a name="Plane+distanceToSphere"></a>

### plane.distanceToSphere(sphere) ⇒ <code>Number</code>
Calculate distance to sphere.

**Kind**: instance method of [<code>Plane</code>](#Plane)  
**Returns**: <code>Number</code> - Distance to sphere.  

| Param | Type | Description |
| --- | --- | --- |
| sphere | <code>Sphere</code> | Sphere to calculate distance to. |

<a name="Plane+collideLine"></a>

### plane.collideLine(line) ⇒ <code>Boolean</code>
Check if this plane collide with a line.

**Kind**: instance method of [<code>Plane</code>](#Plane)  
**Returns**: <code>Boolean</code> - True if collide, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| line | <code>Line</code> | Line to check. |

<a name="Plane+collideSphere"></a>

### plane.collideSphere(sphere) ⇒ <code>Boolean</code>
Check if this plane collide with a sphere.

**Kind**: instance method of [<code>Plane</code>](#Plane)  
**Returns**: <code>Boolean</code> - True if collide, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| sphere | <code>Sphere</code> | Sphere to check. |

<a name="Plane+coplanarPoint"></a>

### plane.coplanarPoint() ⇒ <code>Vector3</code>
Coplanar a point.

**Kind**: instance method of [<code>Plane</code>](#Plane)  
**Returns**: <code>Vector3</code> - Coplanar point as a new vector.  
<a name="Plane+translateSelf"></a>

### plane.translateSelf(offset) ⇒ [<code>Plane</code>](#Plane)
Translate this plane.

**Kind**: instance method of [<code>Plane</code>](#Plane)  
**Returns**: [<code>Plane</code>](#Plane) - Self.  

| Param | Type | Description |
| --- | --- | --- |
| offset | <code>Vector3</code> | Offset to translate to. |

<a name="Plane+equals"></a>

### plane.equals(plane) ⇒ <code>Boolean</code>
Check if this plane equals another plane.

**Kind**: instance method of [<code>Plane</code>](#Plane)  
**Returns**: <code>Boolean</code> - True if equal, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| plane | [<code>Plane</code>](#Plane) | Other plane to compare to. |

<a name="Plane+clone"></a>

### plane.clone() ⇒ [<code>Plane</code>](#Plane)
Clone this plane.

**Kind**: instance method of [<code>Plane</code>](#Plane)  
**Returns**: [<code>Plane</code>](#Plane) - Cloned plane.  
