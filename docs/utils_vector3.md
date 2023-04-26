![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Vector3

<a name="Vector3"></a>

## Vector3
A Vector object for 3d positions.

**Kind**: global class  

* [Vector3](#Vector3)
    * [new Vector3(x, y, z)](#new_Vector3_new)
    * _instance_
        * [.clone()](#Vector3+clone) ⇒ [<code>Vector3</code>](#Vector3)
        * [.set(x, y, z)](#Vector3+set) ⇒ [<code>Vector3</code>](#Vector3)
        * [.copy()](#Vector3+copy) ⇒ [<code>Vector3</code>](#Vector3)
        * [.add(Other)](#Vector3+add) ⇒ [<code>Vector3</code>](#Vector3)
        * [.sub(Other)](#Vector3+sub) ⇒ [<code>Vector3</code>](#Vector3)
        * [.div(Other)](#Vector3+div) ⇒ [<code>Vector3</code>](#Vector3)
        * [.mul(Other)](#Vector3+mul) ⇒ [<code>Vector3</code>](#Vector3)
        * [.round()](#Vector3+round) ⇒ [<code>Vector3</code>](#Vector3)
        * [.floor()](#Vector3+floor) ⇒ [<code>Vector3</code>](#Vector3)
        * [.ceil()](#Vector3+ceil) ⇒ [<code>Vector3</code>](#Vector3)
        * [.normalized()](#Vector3+normalized) ⇒ [<code>Vector3</code>](#Vector3)
        * [.addSelf(Other)](#Vector3+addSelf) ⇒ [<code>Vector3</code>](#Vector3)
        * [.subSelf(Other)](#Vector3+subSelf) ⇒ [<code>Vector3</code>](#Vector3)
        * [.divSelf(Other)](#Vector3+divSelf) ⇒ [<code>Vector3</code>](#Vector3)
        * [.mulSelf(Other)](#Vector3+mulSelf) ⇒ [<code>Vector3</code>](#Vector3)
        * [.roundSelf()](#Vector3+roundSelf) ⇒ [<code>Vector3</code>](#Vector3)
        * [.floorSelf()](#Vector3+floorSelf) ⇒ [<code>Vector3</code>](#Vector3)
        * [.ceilSelf()](#Vector3+ceilSelf) ⇒ [<code>Vector3</code>](#Vector3)
        * [.normalizeSelf()](#Vector3+normalizeSelf) ⇒ [<code>Vector3</code>](#Vector3)
        * [.equals(other)](#Vector3+equals) ⇒ <code>Boolean</code>
        * [.approximate(other, threshold)](#Vector3+approximate) ⇒ <code>Boolean</code>
        * [.length()](#Vector3+length) ⇒ <code>Number</code>
        * [.scaled()](#Vector3+scaled) ⇒ [<code>Vector3</code>](#Vector3)
        * [.distanceTo(other)](#Vector3+distanceTo) ⇒ <code>Number</code>
        * [.string()](#Vector3+string)
        * [.toArray()](#Vector3+toArray) ⇒ <code>Array.&lt;Number&gt;</code>
        * [.toDict(minimized)](#Vector3+toDict) ⇒ <code>\*</code>
    * _static_
        * [.zeroReadonly](#Vector3.zeroReadonly)
        * [.oneReadonly](#Vector3.oneReadonly)
        * [.halfReadonly](#Vector3.halfReadonly)
        * [.leftReadonly](#Vector3.leftReadonly)
        * [.rightReadonly](#Vector3.rightReadonly)
        * [.upReadonly](#Vector3.upReadonly)
        * [.downReadonly](#Vector3.downReadonly)
        * [.frontReadonly](#Vector3.frontReadonly)
        * [.backReadonly](#Vector3.backReadonly)
        * [.zero()](#Vector3.zero) ⇒ [<code>Vector3</code>](#Vector3)
        * [.one()](#Vector3.one) ⇒ [<code>Vector3</code>](#Vector3)
        * [.half()](#Vector3.half) ⇒ [<code>Vector3</code>](#Vector3)
        * [.left()](#Vector3.left) ⇒ [<code>Vector3</code>](#Vector3)
        * [.right()](#Vector3.right) ⇒ [<code>Vector3</code>](#Vector3)
        * [.up()](#Vector3.up) ⇒ [<code>Vector3</code>](#Vector3)
        * [.down()](#Vector3.down) ⇒ [<code>Vector3</code>](#Vector3)
        * [.front()](#Vector3.front) ⇒ [<code>Vector3</code>](#Vector3)
        * [.back()](#Vector3.back) ⇒ [<code>Vector3</code>](#Vector3)
        * [.lerp(p1, p2, a)](#Vector3.lerp) ⇒ [<code>Vector3</code>](#Vector3)
        * [.distance(p1, p2)](#Vector3.distance) ⇒ <code>Number</code>
        * [.crossVector(p1, p2)](#Vector3.crossVector) ⇒ [<code>Vector3</code>](#Vector3)
        * [.parse(str)](#Vector3.parse) ⇒ [<code>Vector3</code>](#Vector3)
        * [.fromArray(arr)](#Vector3.fromArray) ⇒ [<code>Vector3</code>](#Vector3)
        * [.fromDict(data)](#Vector3.fromDict) ⇒ [<code>Vector3</code>](#Vector3)

<a name="new_Vector3_new"></a>

### new Vector3(x, y, z)
Create the Vector object.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| x | <code>number</code> | <code>0</code> | Vector X. |
| y | <code>number</code> | <code>0</code> | Vector Y. |
| z | <code>number</code> | <code>0</code> | Vector Z. |

<a name="Vector3+clone"></a>

### vector3.clone() ⇒ [<code>Vector3</code>](#Vector3)
Clone the vector.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - cloned vector.  
<a name="Vector3+set"></a>

### vector3.set(x, y, z) ⇒ [<code>Vector3</code>](#Vector3)
Set vector value.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - this.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | X component. |
| y | <code>Number</code> | Y component. |
| z | <code>Number</code> | Z component. |

<a name="Vector3+copy"></a>

### vector3.copy() ⇒ [<code>Vector3</code>](#Vector3)
Copy values from other vector into self.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - this.  
<a name="Vector3+add"></a>

### vector3.add(Other) ⇒ [<code>Vector3</code>](#Vector3)
Return a new vector of this + other.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector3</code>](#Vector3) | Vector3 or number to add to all components. |

<a name="Vector3+sub"></a>

### vector3.sub(Other) ⇒ [<code>Vector3</code>](#Vector3)
Return a new vector of this - other.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector3</code>](#Vector3) | Vector3 or number to sub from all components. |

<a name="Vector3+div"></a>

### vector3.div(Other) ⇒ [<code>Vector3</code>](#Vector3)
Return a new vector of this / other.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector3</code>](#Vector3) | Vector3 or number to divide by all components. |

<a name="Vector3+mul"></a>

### vector3.mul(Other) ⇒ [<code>Vector3</code>](#Vector3)
Return a new vector of this * other.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector3</code>](#Vector3) | Vector3 or number to multiply with all components. |

<a name="Vector3+round"></a>

### vector3.round() ⇒ [<code>Vector3</code>](#Vector3)
Return a round copy of this vector.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3+floor"></a>

### vector3.floor() ⇒ [<code>Vector3</code>](#Vector3)
Return a floored copy of this vector.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3+ceil"></a>

### vector3.ceil() ⇒ [<code>Vector3</code>](#Vector3)
Return a ceiled copy of this vector.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3+normalized"></a>

### vector3.normalized() ⇒ [<code>Vector3</code>](#Vector3)
Return a normalized copy of this vector.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3+addSelf"></a>

### vector3.addSelf(Other) ⇒ [<code>Vector3</code>](#Vector3)
Add other vector values to self.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - this.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector3</code>](#Vector3) | Vector or number to add. |

<a name="Vector3+subSelf"></a>

### vector3.subSelf(Other) ⇒ [<code>Vector3</code>](#Vector3)
Sub other vector values from self.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - this.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector3</code>](#Vector3) | Vector or number to substract. |

<a name="Vector3+divSelf"></a>

### vector3.divSelf(Other) ⇒ [<code>Vector3</code>](#Vector3)
Divide this vector by other vector values.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - this.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector3</code>](#Vector3) | Vector or number to divide by. |

<a name="Vector3+mulSelf"></a>

### vector3.mulSelf(Other) ⇒ [<code>Vector3</code>](#Vector3)
Multiply this vector by other vector values.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - this.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector3</code>](#Vector3) | Vector or number to multiply by. |

<a name="Vector3+roundSelf"></a>

### vector3.roundSelf() ⇒ [<code>Vector3</code>](#Vector3)
Round self.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - this.  
<a name="Vector3+floorSelf"></a>

### vector3.floorSelf() ⇒ [<code>Vector3</code>](#Vector3)
Floor self.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - this.  
<a name="Vector3+ceilSelf"></a>

### vector3.ceilSelf() ⇒ [<code>Vector3</code>](#Vector3)
Ceil self.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - this.  
<a name="Vector3+normalizeSelf"></a>

### vector3.normalizeSelf() ⇒ [<code>Vector3</code>](#Vector3)
Return a normalized copy of this vector.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - this.  
<a name="Vector3+equals"></a>

### vector3.equals(other) ⇒ <code>Boolean</code>
Return if vector equals another vector.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: <code>Boolean</code> - if vectors are equal.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Vector3</code>](#Vector3) | Other vector to compare to. |

<a name="Vector3+approximate"></a>

### vector3.approximate(other, threshold) ⇒ <code>Boolean</code>
Return if vector approximately equals another vector.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: <code>Boolean</code> - if vectors are equal.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Vector3</code>](#Vector3) | Other vector to compare to. |
| threshold | <code>Number</code> | Distance threshold to consider as equal. Defaults to 1. |

<a name="Vector3+length"></a>

### vector3.length() ⇒ <code>Number</code>
Return vector length (aka magnitude).

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: <code>Number</code> - Vector length.  
<a name="Vector3+scaled"></a>

### vector3.scaled() ⇒ [<code>Vector3</code>](#Vector3)
Return a copy of this vector multiplied by a factor.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3+distanceTo"></a>

### vector3.distanceTo(other) ⇒ <code>Number</code>
Calculate distance between this vector and another vectors.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: <code>Number</code> - Distance between vectors.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Vector3</code>](#Vector3) | Other vector. |

<a name="Vector3+string"></a>

### vector3.string()
Convert to string.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
<a name="Vector3+toArray"></a>

### vector3.toArray() ⇒ <code>Array.&lt;Number&gt;</code>
Convert to array of numbers.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: <code>Array.&lt;Number&gt;</code> - Vector components as array.  
<a name="Vector3+toDict"></a>

### vector3.toDict(minimized) ⇒ <code>\*</code>
Convert to dictionary.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: <code>\*</code> - Dictionary with {x,y,z}  

| Param | Type | Description |
| --- | --- | --- |
| minimized | <code>Boolean</code> | If true, will not include keys that their values are 0. You can use fromDict on minimized dicts. |

<a name="Vector3.zeroReadonly"></a>

### Vector3.zeroReadonly
Vector with 0,0,0 values as a frozen shared object.
Be careful not to try and change it.

**Kind**: static property of [<code>Vector3</code>](#Vector3)  
<a name="Vector3.oneReadonly"></a>

### Vector3.oneReadonly
Vector with 1,1,1 values as a frozen shared object.
Be careful not to try and change it.

**Kind**: static property of [<code>Vector3</code>](#Vector3)  
<a name="Vector3.halfReadonly"></a>

### Vector3.halfReadonly
Vector with 0.5,0.5,0.5 values as a frozen shared object.
Be careful not to try and change it.

**Kind**: static property of [<code>Vector3</code>](#Vector3)  
<a name="Vector3.leftReadonly"></a>

### Vector3.leftReadonly
Vector with -1,0,0 values as a frozen shared object.
Be careful not to try and change it.

**Kind**: static property of [<code>Vector3</code>](#Vector3)  
<a name="Vector3.rightReadonly"></a>

### Vector3.rightReadonly
Vector with 1,0,0 values as a frozen shared object.
Be careful not to try and change it.

**Kind**: static property of [<code>Vector3</code>](#Vector3)  
<a name="Vector3.upReadonly"></a>

### Vector3.upReadonly
Vector with 0,-1,0 values as a frozen shared object.
Be careful not to try and change it.

**Kind**: static property of [<code>Vector3</code>](#Vector3)  
<a name="Vector3.downReadonly"></a>

### Vector3.downReadonly
Vector with 0,1,0 values as a frozen shared object.
Be careful not to try and change it.

**Kind**: static property of [<code>Vector3</code>](#Vector3)  
<a name="Vector3.frontReadonly"></a>

### Vector3.frontReadonly
Vector with 0,0,1 values as a frozen shared object.
Be careful not to try and change it.

**Kind**: static property of [<code>Vector3</code>](#Vector3)  
<a name="Vector3.backReadonly"></a>

### Vector3.backReadonly
Vector with 0,0,-1 values as a frozen shared object.
Be careful not to try and change it.

**Kind**: static property of [<code>Vector3</code>](#Vector3)  
<a name="Vector3.zero"></a>

### Vector3.zero() ⇒ [<code>Vector3</code>](#Vector3)
Get vector with 0,0,0 values.

**Kind**: static method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3.one"></a>

### Vector3.one() ⇒ [<code>Vector3</code>](#Vector3)
Get vector with 1,1,1 values.

**Kind**: static method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3.half"></a>

### Vector3.half() ⇒ [<code>Vector3</code>](#Vector3)
Get vector with 0.5,0.5 values.

**Kind**: static method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3.left"></a>

### Vector3.left() ⇒ [<code>Vector3</code>](#Vector3)
Get vector with -1,0,0 values.

**Kind**: static method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3.right"></a>

### Vector3.right() ⇒ [<code>Vector3</code>](#Vector3)
Get vector with 1,0,0 values.

**Kind**: static method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3.up"></a>

### Vector3.up() ⇒ [<code>Vector3</code>](#Vector3)
Get vector with 0,-1,0 values.

**Kind**: static method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3.down"></a>

### Vector3.down() ⇒ [<code>Vector3</code>](#Vector3)
Get vector with 0,1,0 values.

**Kind**: static method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3.front"></a>

### Vector3.front() ⇒ [<code>Vector3</code>](#Vector3)
Get vector with 0,0,1 values.

**Kind**: static method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3.back"></a>

### Vector3.back() ⇒ [<code>Vector3</code>](#Vector3)
Get vector with 0,0,-1 values.

**Kind**: static method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3.lerp"></a>

### Vector3.lerp(p1, p2, a) ⇒ [<code>Vector3</code>](#Vector3)
Lerp between two vectors.

**Kind**: static method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Vector3</code>](#Vector3) | First vector. |
| p2 | [<code>Vector3</code>](#Vector3) | Second vector. |
| a | <code>Number</code> | Lerp factor (0.0 - 1.0). |

<a name="Vector3.distance"></a>

### Vector3.distance(p1, p2) ⇒ <code>Number</code>
Calculate distance between two vectors.

**Kind**: static method of [<code>Vector3</code>](#Vector3)  
**Returns**: <code>Number</code> - Distance between vectors.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Vector3</code>](#Vector3) | First vector. |
| p2 | [<code>Vector3</code>](#Vector3) | Second vector. |

<a name="Vector3.crossVector"></a>

### Vector3.crossVector(p1, p2) ⇒ [<code>Vector3</code>](#Vector3)
Return cross product between two vectors.

**Kind**: static method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - Crossed vector.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Vector3</code>](#Vector3) | First vector. |
| p2 | [<code>Vector3</code>](#Vector3) | Second vector. |

<a name="Vector3.parse"></a>

### Vector3.parse(str) ⇒ [<code>Vector3</code>](#Vector3)
Parse and return a vector object from string in the form of "x,y".

**Kind**: static method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - Parsed vector.  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | String to parse. |

<a name="Vector3.fromArray"></a>

### Vector3.fromArray(arr) ⇒ [<code>Vector3</code>](#Vector3)
Create vector from array of numbers.

**Kind**: static method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - Vector instance.  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array.&lt;Number&gt;</code> | Array of numbers to create vector from. |

<a name="Vector3.fromDict"></a>

### Vector3.fromDict(data) ⇒ [<code>Vector3</code>](#Vector3)
Create vector from a dictionary.

**Kind**: static method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - Newly created vector.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | Dictionary with {x,y,z}. |

