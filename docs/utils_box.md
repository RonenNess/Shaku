![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Box

<a name="Box"></a>

## Box
A 3D box shape.

**Kind**: global class  

* [Box](#Box)
    * [new Box(min, max)](#new_Box_new)
    * [.set(min, max)](#Box+set) ⇒ [<code>Box</code>](#Box)
    * [.setFromArray(array)](#Box+setFromArray) ⇒ [<code>Box</code>](#Box)
    * [.setFromPoints(points)](#Box+setFromPoints) ⇒ [<code>Box</code>](#Box)
    * [.setFromCenterAndSize(center, size)](#Box+setFromCenterAndSize) ⇒ [<code>Box</code>](#Box)
    * [.clone()](#Box+clone) ⇒ [<code>Box</code>](#Box)
    * [.copy(box)](#Box+copy) ⇒ [<code>Box</code>](#Box)
    * [.makeEmpty()](#Box+makeEmpty) ⇒ [<code>Box</code>](#Box)
    * [.isEmpty()](#Box+isEmpty) ⇒ <code>Boolean</code>
    * [.getCenter()](#Box+getCenter) ⇒ <code>Vector3</code>
    * [.getSize()](#Box+getSize) ⇒ <code>Vector3</code>
    * [.expandByPoint(point)](#Box+expandByPoint) ⇒ [<code>Box</code>](#Box)
    * [.expandByVector(vector)](#Box+expandByVector) ⇒ [<code>Box</code>](#Box)
    * [.expandByScalar(scalar)](#Box+expandByScalar) ⇒ [<code>Box</code>](#Box)
    * [.containsPoint(point)](#Box+containsPoint) ⇒ <code>Boolean</code>
    * [.containsBox(box)](#Box+containsBox) ⇒ <code>Boolean</code>
    * [.collideBox(box)](#Box+collideBox) ⇒ <code>Boolean</code>
    * [.collideSphere(sphere)](#Box+collideSphere) ⇒ <code>Boolean</code>
    * [.collidePlane(plane)](#Box+collidePlane) ⇒ <code>Boolean</code>
    * [.clampPoint(point)](#Box+clampPoint) ⇒ <code>Vector3</code>
    * [.distanceToPoint(point)](#Box+distanceToPoint) ⇒ <code>Number</code>
    * [.intersectWith(box)](#Box+intersectWith) ⇒ [<code>Box</code>](#Box)
    * [.unionWith(box)](#Box+unionWith) ⇒ [<code>Box</code>](#Box)
    * [.translate(offset)](#Box+translate) ⇒ [<code>Box</code>](#Box)
    * [.equals(other)](#Box+equals) ⇒ <code>Boolean</code>

<a name="new_Box_new"></a>

### new Box(min, max)
Create the 3d box.


| Param | Type | Description |
| --- | --- | --- |
| min | <code>Vector3</code> | Box min vector. |
| max | <code>Vector3</code> | Box max vector. |

<a name="Box+set"></a>

### box.set(min, max) ⇒ [<code>Box</code>](#Box)
Set the box min and max corners.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: [<code>Box</code>](#Box) - Self.  

| Param | Type | Description |
| --- | --- | --- |
| min | <code>Vector3</code> | Box min vector. |
| max | <code>Vector3</code> | Box max vector. |

<a name="Box+setFromArray"></a>

### box.setFromArray(array) ⇒ [<code>Box</code>](#Box)
Set box values from array.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: [<code>Box</code>](#Box) - Self.  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array.&lt;Number&gt;</code> | Array of values to load from. |

<a name="Box+setFromPoints"></a>

### box.setFromPoints(points) ⇒ [<code>Box</code>](#Box)
Set box from array of points.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: [<code>Box</code>](#Box) - Self.  

| Param | Type | Description |
| --- | --- | --- |
| points | <code>Array.&lt;Vector3&gt;</code> | Points to set box from. |

<a name="Box+setFromCenterAndSize"></a>

### box.setFromCenterAndSize(center, size) ⇒ [<code>Box</code>](#Box)
Set box from center and size.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: [<code>Box</code>](#Box) - Self.  

| Param | Type | Description |
| --- | --- | --- |
| center | <code>Vector3</code> | Center position. |
| size | <code>Vector3</code> | Box size. |

<a name="Box+clone"></a>

### box.clone() ⇒ [<code>Box</code>](#Box)
Clone this box.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: [<code>Box</code>](#Box) - Cloned box.  
<a name="Box+copy"></a>

### box.copy(box) ⇒ [<code>Box</code>](#Box)
Copy values from another box.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: [<code>Box</code>](#Box) - Self.  

| Param | Type | Description |
| --- | --- | --- |
| box | [<code>Box</code>](#Box) | Box to copy. |

<a name="Box+makeEmpty"></a>

### box.makeEmpty() ⇒ [<code>Box</code>](#Box)
Turn this box into empty state.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: [<code>Box</code>](#Box) - Self.  
<a name="Box+isEmpty"></a>

### box.isEmpty() ⇒ <code>Boolean</code>
Check if this box is empty.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: <code>Boolean</code> - True if empty.  
<a name="Box+getCenter"></a>

### box.getCenter() ⇒ <code>Vector3</code>
Get center position.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: <code>Vector3</code> - Center position.  
<a name="Box+getSize"></a>

### box.getSize() ⇒ <code>Vector3</code>
Get box size.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: <code>Vector3</code> - Box size.  
<a name="Box+expandByPoint"></a>

### box.expandByPoint(point) ⇒ [<code>Box</code>](#Box)
Expand this box by a point.
This will adjust the box boundaries to contain the point.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: [<code>Box</code>](#Box) - Self.  

| Param | Type | Description |
| --- | --- | --- |
| point | <code>Vector3</code> | Point to extend box by. |

<a name="Box+expandByVector"></a>

### box.expandByVector(vector) ⇒ [<code>Box</code>](#Box)
Expand this box by pushing its boundaries by a vector.
This will adjust the box boundaries by pushing them away from the center by the value of the given vector.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: [<code>Box</code>](#Box) - Self.  

| Param | Type | Description |
| --- | --- | --- |
| vector | <code>Vector3</code> | Vector to expand by. |

<a name="Box+expandByScalar"></a>

### box.expandByScalar(scalar) ⇒ [<code>Box</code>](#Box)
Expand this box by pushing its boundaries by a given scalar.
This will adjust the box boundaries by pushing them away from the center by the value of the given scalar.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: [<code>Box</code>](#Box) - Self.  

| Param | Type | Description |
| --- | --- | --- |
| scalar | <code>Number</code> | Value to expand by. |

<a name="Box+containsPoint"></a>

### box.containsPoint(point) ⇒ <code>Boolean</code>
Check if this box contains a point.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: <code>Boolean</code> - True if box containing the point.  

| Param | Type | Description |
| --- | --- | --- |
| point | <code>Vector3</code> | Point to check. |

<a name="Box+containsBox"></a>

### box.containsBox(box) ⇒ <code>Boolean</code>
Check if this box contains another box.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: <code>Boolean</code> - True if box containing the box.  

| Param | Type | Description |
| --- | --- | --- |
| box | [<code>Box</code>](#Box) | Box to check. |

<a name="Box+collideBox"></a>

### box.collideBox(box) ⇒ <code>Boolean</code>
Check if this box collides with another box.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: <code>Boolean</code> - True if collide, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| box | [<code>Box</code>](#Box) | Box to test collidion with. |

<a name="Box+collideSphere"></a>

### box.collideSphere(sphere) ⇒ <code>Boolean</code>
Check if this box collides with a sphere.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: <code>Boolean</code> - True if collide, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| sphere | <code>Sphere</code> | Sphere to test collidion with. |

<a name="Box+collidePlane"></a>

### box.collidePlane(plane) ⇒ <code>Boolean</code>
Check if this box collides with a plane.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: <code>Boolean</code> - True if collide, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| plane | <code>Plane</code> | Plane to test collidion with. |

<a name="Box+clampPoint"></a>

### box.clampPoint(point) ⇒ <code>Vector3</code>
Clamp a given vector inside this box.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: <code>Vector3</code> - Vector clammped.  

| Param | Type | Description |
| --- | --- | --- |
| point | <code>Vector3</code> | Vector to clamp. |

<a name="Box+distanceToPoint"></a>

### box.distanceToPoint(point) ⇒ <code>Number</code>
Get distance between this box and a given point.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: <code>Number</code> - Distance to point.  

| Param | Type | Description |
| --- | --- | --- |
| point | <code>Vector3</code> | Point to get distance to. |

<a name="Box+intersectWith"></a>

### box.intersectWith(box) ⇒ [<code>Box</code>](#Box)
Computes the intersection of this box with another box. 
This will set the upper bound of this box to the lesser of the two boxes' upper bounds and the lower bound of this box to the greater of the two boxes' lower bounds. 
If there's no overlap, makes this box empty.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: [<code>Box</code>](#Box) - Self.  

| Param | Type | Description |
| --- | --- | --- |
| box | [<code>Box</code>](#Box) | Box to intersect with. |

<a name="Box+unionWith"></a>

### box.unionWith(box) ⇒ [<code>Box</code>](#Box)
Computes the union of this box and box.
This will set the upper bound of this box to the greater of the two boxes' upper bounds and the lower bound of this box to the lesser of the two boxes' lower bounds.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: [<code>Box</code>](#Box) - Self.  

| Param | Type | Description |
| --- | --- | --- |
| box | [<code>Box</code>](#Box) | Box to union with. |

<a name="Box+translate"></a>

### box.translate(offset) ⇒ [<code>Box</code>](#Box)
Move this box.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: [<code>Box</code>](#Box) - Self.  

| Param | Type | Description |
| --- | --- | --- |
| offset | <code>Vector3</code> | Offset to move box by. |

<a name="Box+equals"></a>

### box.equals(other) ⇒ <code>Boolean</code>
Check if equal to another box.

**Kind**: instance method of [<code>Box</code>](#Box)  
**Returns**: <code>Boolean</code> - True if boxes are equal, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Box</code>](#Box) | Other box to compare to. |

