![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Vector2

<a name="Vector2"></a>

## Vector2
A simple Vector object for 2d positions.

**Kind**: global class  

* [Vector2](#Vector2)
    * [new Vector2(x, y)](#new_Vector2_new)
    * _instance_
        * [.clone()](#Vector2+clone) ⇒ [<code>Vector2</code>](#Vector2)
        * [.set(x, y)](#Vector2+set) ⇒ [<code>Vector2</code>](#Vector2)
        * [.copy()](#Vector2+copy) ⇒ [<code>Vector2</code>](#Vector2)
        * [.add(Other)](#Vector2+add) ⇒ [<code>Vector2</code>](#Vector2)
        * [.sub(Other)](#Vector2+sub) ⇒ [<code>Vector2</code>](#Vector2)
        * [.div(Other)](#Vector2+div) ⇒ [<code>Vector2</code>](#Vector2)
        * [.mul(Other)](#Vector2+mul) ⇒ [<code>Vector2</code>](#Vector2)
        * [.round()](#Vector2+round) ⇒ [<code>Vector2</code>](#Vector2)
        * [.floor()](#Vector2+floor) ⇒ [<code>Vector2</code>](#Vector2)
        * [.ceil()](#Vector2+ceil) ⇒ [<code>Vector2</code>](#Vector2)
        * [.minSelf(v)](#Vector2+minSelf) ⇒ [<code>Vector2</code>](#Vector2)
        * [.maxSelf(v)](#Vector2+maxSelf) ⇒ [<code>Vector2</code>](#Vector2)
        * [.min(v)](#Vector2+min) ⇒ [<code>Vector2</code>](#Vector2)
        * [.max(v)](#Vector2+max) ⇒ [<code>Vector2</code>](#Vector2)
        * [.normalized()](#Vector2+normalized) ⇒ [<code>Vector2</code>](#Vector2)
        * [.rotatedByRadians(radians)](#Vector2+rotatedByRadians) ⇒ [<code>Vector2</code>](#Vector2)
        * [.rotatedByDegrees(degrees)](#Vector2+rotatedByDegrees) ⇒ [<code>Vector2</code>](#Vector2)
        * [.addSelf(Other)](#Vector2+addSelf) ⇒ [<code>Vector2</code>](#Vector2)
        * [.subSelf(Other)](#Vector2+subSelf) ⇒ [<code>Vector2</code>](#Vector2)
        * [.divSelf(Other)](#Vector2+divSelf) ⇒ [<code>Vector2</code>](#Vector2)
        * [.mulSelf(Other)](#Vector2+mulSelf) ⇒ [<code>Vector2</code>](#Vector2)
        * [.roundSelf()](#Vector2+roundSelf) ⇒ [<code>Vector2</code>](#Vector2)
        * [.floorSelf()](#Vector2+floorSelf) ⇒ [<code>Vector2</code>](#Vector2)
        * [.ceilSelf()](#Vector2+ceilSelf) ⇒ [<code>Vector2</code>](#Vector2)
        * [.normalizeSelf()](#Vector2+normalizeSelf) ⇒ [<code>Vector2</code>](#Vector2)
        * [.equals(other)](#Vector2+equals) ⇒ <code>Boolean</code>
        * [.approximate(other, threshold)](#Vector2+approximate) ⇒ <code>Boolean</code>
        * [.length()](#Vector2+length) ⇒ <code>Number</code>
        * [.scaled()](#Vector2+scaled) ⇒ [<code>Vector2</code>](#Vector2)
        * [.degreesTo(other)](#Vector2+degreesTo) ⇒ <code>Number</code>
        * [.radiansTo(other)](#Vector2+radiansTo) ⇒ <code>Number</code>
        * [.wrappedDegreesTo(other)](#Vector2+wrappedDegreesTo) ⇒ <code>Number</code>
        * [.wrappedRadiansTo(other)](#Vector2+wrappedRadiansTo) ⇒ <code>Number</code>
        * [.distanceTo(other)](#Vector2+distanceTo) ⇒ <code>Number</code>
        * [.distanceToSquared(other)](#Vector2+distanceToSquared) ⇒ <code>Number</code>
        * [.clamp(min, max)](#Vector2+clamp) ⇒ [<code>Vector2</code>](#Vector2)
        * [.clampSelf(min, max)](#Vector2+clampSelf) ⇒ [<code>Vector2</code>](#Vector2)
        * [.dot(other)](#Vector2+dot) ⇒ <code>Number</code>
        * [.getDegrees()](#Vector2+getDegrees) ⇒ <code>Number</code>
        * [.getRadians()](#Vector2+getRadians) ⇒ <code>Number</code>
        * [.string()](#Vector2+string)
        * [.toArray()](#Vector2+toArray) ⇒ <code>Array.&lt;Number&gt;</code>
        * [.toDict(minimized)](#Vector2+toDict) ⇒ <code>\*</code>
    * _static_
        * [.zeroReadonly](#Vector2.zeroReadonly)
        * [.oneReadonly](#Vector2.oneReadonly)
        * [.halfReadonly](#Vector2.halfReadonly)
        * [.leftReadonly](#Vector2.leftReadonly)
        * [.rightReadonly](#Vector2.rightReadonly)
        * [.upReadonly](#Vector2.upReadonly)
        * [.downReadonly](#Vector2.downReadonly)
        * [.zero()](#Vector2.zero) ⇒ [<code>Vector2</code>](#Vector2)
        * [.one()](#Vector2.one) ⇒ [<code>Vector2</code>](#Vector2)
        * [.half()](#Vector2.half) ⇒ [<code>Vector2</code>](#Vector2)
        * [.left()](#Vector2.left) ⇒ [<code>Vector2</code>](#Vector2)
        * [.right()](#Vector2.right) ⇒ [<code>Vector2</code>](#Vector2)
        * [.up()](#Vector2.up) ⇒ [<code>Vector2</code>](#Vector2)
        * [.down()](#Vector2.down) ⇒ [<code>Vector2</code>](#Vector2)
        * [.random()](#Vector2.random) ⇒ [<code>Vector2</code>](#Vector2)
        * [.fromDegrees(degrees)](#Vector2.fromDegrees) ⇒ [<code>Vector2</code>](#Vector2)
        * [.fromRadians(radians)](#Vector2.fromRadians) ⇒ [<code>Vector2</code>](#Vector2)
        * [.lerp(p1, p2, a)](#Vector2.lerp) ⇒ [<code>Vector2</code>](#Vector2)
        * [.degreesBetween(p1, p2)](#Vector2.degreesBetween) ⇒ <code>Number</code>
        * [.radiansBetween(p1, p2)](#Vector2.radiansBetween) ⇒ <code>Number</code>
        * [.wrappedDegreesBetween(p1, p2)](#Vector2.wrappedDegreesBetween) ⇒ <code>Number</code>
        * [.wrappedRadiansBetween(p1, p2)](#Vector2.wrappedRadiansBetween) ⇒ <code>Number</code>
        * [.distance(p1, p2)](#Vector2.distance) ⇒ <code>Number</code>
        * [.cross(p1, p2)](#Vector2.cross) ⇒ <code>Number</code>
        * [.dot(p1, p2)](#Vector2.dot) ⇒ <code>Number</code>
        * [.parse(str)](#Vector2.parse) ⇒ [<code>Vector2</code>](#Vector2)
        * [.fromArray(arr)](#Vector2.fromArray) ⇒ [<code>Vector2</code>](#Vector2)
        * [.fromDict(data)](#Vector2.fromDict) ⇒ [<code>Vector2</code>](#Vector2)

<a name="new_Vector2_new"></a>

### new Vector2(x, y)
Create the Vector object.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| x | <code>number</code> | <code>0</code> | Vector X. |
| y | <code>number</code> | <code>0</code> | Vector Y. |

<a name="Vector2+clone"></a>

### vector2.clone() ⇒ [<code>Vector2</code>](#Vector2)
Clone the vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - cloned vector.  
<a name="Vector2+set"></a>

### vector2.set(x, y) ⇒ [<code>Vector2</code>](#Vector2)
Set vector value.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - this.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | X component. |
| y | <code>Number</code> | Y component. |

<a name="Vector2+copy"></a>

### vector2.copy() ⇒ [<code>Vector2</code>](#Vector2)
Copy values from other vector into self.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - this.  
<a name="Vector2+add"></a>

### vector2.add(Other) ⇒ [<code>Vector2</code>](#Vector2)
Return a new vector of this + other.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector2</code>](#Vector2) | Vector3 or number to add to all components. |

<a name="Vector2+sub"></a>

### vector2.sub(Other) ⇒ [<code>Vector2</code>](#Vector2)
Return a new vector of this - other.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector2</code>](#Vector2) | Vector3 or number to sub from all components. |

<a name="Vector2+div"></a>

### vector2.div(Other) ⇒ [<code>Vector2</code>](#Vector2)
Return a new vector of this / other.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector2</code>](#Vector2) | Vector3 or number to divide by all components. |

<a name="Vector2+mul"></a>

### vector2.mul(Other) ⇒ [<code>Vector2</code>](#Vector2)
Return a new vector of this * other.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector2</code>](#Vector2) | Vector2 or number to multiply with all components. |

<a name="Vector2+round"></a>

### vector2.round() ⇒ [<code>Vector2</code>](#Vector2)
Return a round copy of this vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2+floor"></a>

### vector2.floor() ⇒ [<code>Vector2</code>](#Vector2)
Return a floored copy of this vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2+ceil"></a>

### vector2.ceil() ⇒ [<code>Vector2</code>](#Vector2)
Return a ceiled copy of this vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2+minSelf"></a>

### vector2.minSelf(v) ⇒ [<code>Vector2</code>](#Vector2)
Set self values to be min values between self and a given vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - Self.  

| Param | Type | Description |
| --- | --- | --- |
| v | [<code>Vector2</code>](#Vector2) | Vector to min with. |

<a name="Vector2+maxSelf"></a>

### vector2.maxSelf(v) ⇒ [<code>Vector2</code>](#Vector2)
Set self values to be max values between self and a given vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - Self.  

| Param | Type | Description |
| --- | --- | --- |
| v | [<code>Vector2</code>](#Vector2) | Vector to max with. |

<a name="Vector2+min"></a>

### vector2.min(v) ⇒ [<code>Vector2</code>](#Vector2)
Create a clone vector that is the min result between self and a given vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - Result vector.  

| Param | Type | Description |
| --- | --- | --- |
| v | [<code>Vector2</code>](#Vector2) | Vector to min with. |

<a name="Vector2+max"></a>

### vector2.max(v) ⇒ [<code>Vector2</code>](#Vector2)
Create a clone vector that is the max result between self and a given vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - Result vector.  

| Param | Type | Description |
| --- | --- | --- |
| v | [<code>Vector2</code>](#Vector2) | Vector to max with. |

<a name="Vector2+normalized"></a>

### vector2.normalized() ⇒ [<code>Vector2</code>](#Vector2)
Return a normalized copy of this vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2+rotatedByRadians"></a>

### vector2.rotatedByRadians(radians) ⇒ [<code>Vector2</code>](#Vector2)
Get a copy of this vector rotated by radians.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - New vector with the length of this vector and direction rotated by given radians.  

| Param | Type | Description |
| --- | --- | --- |
| radians | <code>Number</code> | Radians to rotate by. |

<a name="Vector2+rotatedByDegrees"></a>

### vector2.rotatedByDegrees(degrees) ⇒ [<code>Vector2</code>](#Vector2)
Get a copy of this vector rotated by degrees.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - New vector with the length of this vector and direction rotated by given degrees.  

| Param | Type | Description |
| --- | --- | --- |
| degrees | <code>Number</code> | Degrees to rotate by. |

<a name="Vector2+addSelf"></a>

### vector2.addSelf(Other) ⇒ [<code>Vector2</code>](#Vector2)
Add other vector values to self.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - this.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector2</code>](#Vector2) | Vector or number to add. |

<a name="Vector2+subSelf"></a>

### vector2.subSelf(Other) ⇒ [<code>Vector2</code>](#Vector2)
Sub other vector values from self.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - this.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector2</code>](#Vector2) | Vector or number to substract. |

<a name="Vector2+divSelf"></a>

### vector2.divSelf(Other) ⇒ [<code>Vector2</code>](#Vector2)
Divide this vector by other vector values.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - this.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector2</code>](#Vector2) | Vector or number to divide by. |

<a name="Vector2+mulSelf"></a>

### vector2.mulSelf(Other) ⇒ [<code>Vector2</code>](#Vector2)
Multiply this vector by other vector values.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - this.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector2</code>](#Vector2) | Vector or number to multiply by. |

<a name="Vector2+roundSelf"></a>

### vector2.roundSelf() ⇒ [<code>Vector2</code>](#Vector2)
Round self.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - this.  
<a name="Vector2+floorSelf"></a>

### vector2.floorSelf() ⇒ [<code>Vector2</code>](#Vector2)
Floor self.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - this.  
<a name="Vector2+ceilSelf"></a>

### vector2.ceilSelf() ⇒ [<code>Vector2</code>](#Vector2)
Ceil self.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - this.  
<a name="Vector2+normalizeSelf"></a>

### vector2.normalizeSelf() ⇒ [<code>Vector2</code>](#Vector2)
Return a normalized copy of this vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - this.  
<a name="Vector2+equals"></a>

### vector2.equals(other) ⇒ <code>Boolean</code>
Return if vector equals another vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Boolean</code> - if vectors are equal.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Vector2</code>](#Vector2) | Other vector to compare to. |

<a name="Vector2+approximate"></a>

### vector2.approximate(other, threshold) ⇒ <code>Boolean</code>
Return if vector approximately equals another vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Boolean</code> - if vectors are equal.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Vector2</code>](#Vector2) | Other vector to compare to. |
| threshold | <code>Number</code> | Distance threshold to consider as equal. Defaults to 1. |

<a name="Vector2+length"></a>

### vector2.length() ⇒ <code>Number</code>
Return vector length (aka magnitude).

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Vector length.  
<a name="Vector2+scaled"></a>

### vector2.scaled() ⇒ [<code>Vector2</code>](#Vector2)
Return a copy of this vector multiplied by a factor.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2+degreesTo"></a>

### vector2.degreesTo(other) ⇒ <code>Number</code>
Get degrees between this vector and another vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Angle between vectors in degrees.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Vector2</code>](#Vector2) | Other vector. |

<a name="Vector2+radiansTo"></a>

### vector2.radiansTo(other) ⇒ <code>Number</code>
Get radians between this vector and another vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Angle between vectors in radians.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Vector2</code>](#Vector2) | Other vector. |

<a name="Vector2+wrappedDegreesTo"></a>

### vector2.wrappedDegreesTo(other) ⇒ <code>Number</code>
Get degrees between this vector and another vector.
Return values between 0 to 360.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Angle between vectors in degrees.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Vector2</code>](#Vector2) | Other vector. |

<a name="Vector2+wrappedRadiansTo"></a>

### vector2.wrappedRadiansTo(other) ⇒ <code>Number</code>
Get radians between this vector and another vector.
Return values between 0 to PI2.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Angle between vectors in radians.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Vector2</code>](#Vector2) | Other vector. |

<a name="Vector2+distanceTo"></a>

### vector2.distanceTo(other) ⇒ <code>Number</code>
Calculate distance between this vector and another vectors.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Distance between vectors.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Vector2</code>](#Vector2) | Other vector. |

<a name="Vector2+distanceToSquared"></a>

### vector2.distanceToSquared(other) ⇒ <code>Number</code>
Calculate squared distance between this vector and another vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Distance between vectors.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Vector2</code>](#Vector2) | Other vector. |

<a name="Vector2+clamp"></a>

### vector2.clamp(min, max) ⇒ [<code>Vector2</code>](#Vector2)
Return a clone and clamp its values to be between min and max.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - Clamped vector.  

| Param | Type | Description |
| --- | --- | --- |
| min | [<code>Vector2</code>](#Vector2) | Min vector. |
| max | [<code>Vector2</code>](#Vector2) | Max vector. |

<a name="Vector2+clampSelf"></a>

### vector2.clampSelf(min, max) ⇒ [<code>Vector2</code>](#Vector2)
Clamp this vector values to be between min and max.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - Self.  

| Param | Type | Description |
| --- | --- | --- |
| min | [<code>Vector2</code>](#Vector2) | Min vector. |
| max | [<code>Vector2</code>](#Vector2) | Max vector. |

<a name="Vector2+dot"></a>

### vector2.dot(other) ⇒ <code>Number</code>
Calculate the dot product with another vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Dot product value.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Vector2</code>](#Vector2) | Vector to calculate dot with. |

<a name="Vector2+getDegrees"></a>

### vector2.getDegrees() ⇒ <code>Number</code>
Get vector's angle in degrees.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Vector angle in degrees.  
<a name="Vector2+getRadians"></a>

### vector2.getRadians() ⇒ <code>Number</code>
Get vector's angle in radians.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Vector angle in degrees.  
<a name="Vector2+string"></a>

### vector2.string()
Convert to string.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
<a name="Vector2+toArray"></a>

### vector2.toArray() ⇒ <code>Array.&lt;Number&gt;</code>
Convert to array of numbers.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Array.&lt;Number&gt;</code> - Vector components as array.  
<a name="Vector2+toDict"></a>

### vector2.toDict(minimized) ⇒ <code>\*</code>
Convert to dictionary.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>\*</code> - Dictionary with {x,y}  

| Param | Type | Description |
| --- | --- | --- |
| minimized | <code>Boolean</code> | If true, will not include keys that their values are 0. You can use fromDict on minimized dicts. |

<a name="Vector2.zeroReadonly"></a>

### Vector2.zeroReadonly
Vector with 0,0 values as a frozen shared object.
Be careful not to try and change it.

**Kind**: static property of [<code>Vector2</code>](#Vector2)  
<a name="Vector2.oneReadonly"></a>

### Vector2.oneReadonly
Vector with 1,1 values as a frozen shared object.
Be careful not to try and change it.

**Kind**: static property of [<code>Vector2</code>](#Vector2)  
<a name="Vector2.halfReadonly"></a>

### Vector2.halfReadonly
Vector with 0.5,0.5 values as a frozen shared object.
Be careful not to try and change it.

**Kind**: static property of [<code>Vector2</code>](#Vector2)  
<a name="Vector2.leftReadonly"></a>

### Vector2.leftReadonly
Vector with -1,0 values as a frozen shared object.
Be careful not to try and change it.

**Kind**: static property of [<code>Vector2</code>](#Vector2)  
<a name="Vector2.rightReadonly"></a>

### Vector2.rightReadonly
Vector with 1,0 values as a frozen shared object.
Be careful not to try and change it.

**Kind**: static property of [<code>Vector2</code>](#Vector2)  
<a name="Vector2.upReadonly"></a>

### Vector2.upReadonly
Vector with 0,1 values as a frozen shared object.
Be careful not to try and change it.

**Kind**: static property of [<code>Vector2</code>](#Vector2)  
<a name="Vector2.downReadonly"></a>

### Vector2.downReadonly
Vector with 0,-1 values as a frozen shared object.
Be careful not to try and change it.

**Kind**: static property of [<code>Vector2</code>](#Vector2)  
<a name="Vector2.zero"></a>

### Vector2.zero() ⇒ [<code>Vector2</code>](#Vector2)
Get vector (0,0).

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2.one"></a>

### Vector2.one() ⇒ [<code>Vector2</code>](#Vector2)
Get vector with 1,1 values.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2.half"></a>

### Vector2.half() ⇒ [<code>Vector2</code>](#Vector2)
Get vector with 0.5,0.5 values.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2.left"></a>

### Vector2.left() ⇒ [<code>Vector2</code>](#Vector2)
Get vector with -1,0 values.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2.right"></a>

### Vector2.right() ⇒ [<code>Vector2</code>](#Vector2)
Get vector with 1,0 values.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2.up"></a>

### Vector2.up() ⇒ [<code>Vector2</code>](#Vector2)
Get vector with 0,-1 values.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2.down"></a>

### Vector2.down() ⇒ [<code>Vector2</code>](#Vector2)
Get vector with 0,1 values.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2.random"></a>

### Vector2.random() ⇒ [<code>Vector2</code>](#Vector2)
Get a random vector with length of 1.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2.fromDegrees"></a>

### Vector2.fromDegrees(degrees) ⇒ [<code>Vector2</code>](#Vector2)
Get vector from degrees.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| degrees | <code>Number</code> | Angle to create vector from (0 = vector pointing right). |

<a name="Vector2.fromRadians"></a>

### Vector2.fromRadians(radians) ⇒ [<code>Vector2</code>](#Vector2)
Get vector from radians.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| radians | <code>Number</code> | Angle to create vector from (0 = vector pointing right). |

<a name="Vector2.lerp"></a>

### Vector2.lerp(p1, p2, a) ⇒ [<code>Vector2</code>](#Vector2)
Lerp between two vectors.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Vector2</code>](#Vector2) | First vector. |
| p2 | [<code>Vector2</code>](#Vector2) | Second vector. |
| a | <code>Number</code> | Lerp factor (0.0 - 1.0). |

<a name="Vector2.degreesBetween"></a>

### Vector2.degreesBetween(p1, p2) ⇒ <code>Number</code>
Get degrees between two vectors.
Return values between -180 to 180.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Angle between vectors in degrees.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Vector2</code>](#Vector2) | First vector. |
| p2 | [<code>Vector2</code>](#Vector2) | Second vector. |

<a name="Vector2.radiansBetween"></a>

### Vector2.radiansBetween(p1, p2) ⇒ <code>Number</code>
Get radians between two vectors.
Return values between -PI to PI.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Angle between vectors in radians.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Vector2</code>](#Vector2) | First vector. |
| p2 | [<code>Vector2</code>](#Vector2) | Second vector. |

<a name="Vector2.wrappedDegreesBetween"></a>

### Vector2.wrappedDegreesBetween(p1, p2) ⇒ <code>Number</code>
Get degrees between two vectors.
Return values between 0 to 360.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Angle between vectors in degrees.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Vector2</code>](#Vector2) | First vector. |
| p2 | [<code>Vector2</code>](#Vector2) | Second vector. |

<a name="Vector2.wrappedRadiansBetween"></a>

### Vector2.wrappedRadiansBetween(p1, p2) ⇒ <code>Number</code>
Get radians between two vectors.
Return values between 0 to PI2.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Angle between vectors in radians.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Vector2</code>](#Vector2) | First vector. |
| p2 | [<code>Vector2</code>](#Vector2) | Second vector. |

<a name="Vector2.distance"></a>

### Vector2.distance(p1, p2) ⇒ <code>Number</code>
Calculate distance between two vectors.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Distance between vectors.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Vector2</code>](#Vector2) | First vector. |
| p2 | [<code>Vector2</code>](#Vector2) | Second vector. |

<a name="Vector2.cross"></a>

### Vector2.cross(p1, p2) ⇒ <code>Number</code>
Return cross product between two vectors.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Cross between vectors.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Vector2</code>](#Vector2) | First vector. |
| p2 | [<code>Vector2</code>](#Vector2) | Second vector. |

<a name="Vector2.dot"></a>

### Vector2.dot(p1, p2) ⇒ <code>Number</code>
Return dot product between two vectors.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Dot between vectors.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Vector2</code>](#Vector2) | First vector. |
| p2 | [<code>Vector2</code>](#Vector2) | Second vector. |

<a name="Vector2.parse"></a>

### Vector2.parse(str) ⇒ [<code>Vector2</code>](#Vector2)
Parse and return a vector object from string in the form of "x,y".

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - Parsed vector.  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | String to parse. |

<a name="Vector2.fromArray"></a>

### Vector2.fromArray(arr) ⇒ [<code>Vector2</code>](#Vector2)
Create vector from array of numbers.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - Vector instance.  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array.&lt;Number&gt;</code> | Array of numbers to create vector from. |

<a name="Vector2.fromDict"></a>

### Vector2.fromDict(data) ⇒ [<code>Vector2</code>](#Vector2)
Create vector from a dictionary.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - Newly created vector.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | Dictionary with {x,y}. |

