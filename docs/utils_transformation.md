![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Transformation

## Classes

<dl>
<dt><a href="#Transformation">Transformation</a></dt>
<dd><p>Transformations helper class to store 2d position, rotation and scale.
Can also perform transformations inheritance, where we combine local with parent transformations.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#combineScalar">combineScalar(childValue, parentValue, parent, mode)</a> ⇒ <code>Number</code></dt>
<dd><p>Combine child scalar value with parent using a transformation mode.</p>
</dd>
<dt><a href="#combineVector">combineVector(childValue, parentValue, parent, mode)</a> ⇒ <code>Vector2</code></dt>
<dd><p>Combine child vector value with parent using a transformation mode.</p>
</dd>
<dt><a href="#combineVectorMul">combineVectorMul(childValue, parentValue, parent, mode)</a> ⇒ <code>Vector2</code></dt>
<dd><p>Combine child vector value with parent using a transformation mode and multiplication.</p>
</dd>
</dl>

<a name="Transformation"></a>

## Transformation
Transformations helper class to store 2d position, rotation and scale.
Can also perform transformations inheritance, where we combine local with parent transformations.

**Kind**: global class  

* [Transformation](#Transformation)
    * [new Transformation(position, rotation, scale)](#new_Transformation_new)
    * _instance_
        * [.onChange](#Transformation+onChange) : <code>function</code>
        * [.getPosition()](#Transformation+getPosition) ⇒ <code>Vector2</code>
        * [.getPositionMode()](#Transformation+getPositionMode) ⇒ <code>TransformModes</code>
        * [.setPosition(value)](#Transformation+setPosition) ⇒ [<code>Transformation</code>](#Transformation)
        * [.setPositionX(value)](#Transformation+setPositionX) ⇒ [<code>Transformation</code>](#Transformation)
        * [.setPositionY(value)](#Transformation+setPositionY) ⇒ [<code>Transformation</code>](#Transformation)
        * [.move(value)](#Transformation+move) ⇒ [<code>Transformation</code>](#Transformation)
        * [.setPositionMode(value)](#Transformation+setPositionMode) ⇒ [<code>Transformation</code>](#Transformation)
        * [.getScale()](#Transformation+getScale) ⇒ <code>Vector2</code>
        * [.getScaleMode()](#Transformation+getScaleMode) ⇒ <code>TransformModes</code>
        * [.setScale(value)](#Transformation+setScale) ⇒ [<code>Transformation</code>](#Transformation)
        * [.setScaleX(value)](#Transformation+setScaleX) ⇒ [<code>Transformation</code>](#Transformation)
        * [.setScaleY(value)](#Transformation+setScaleY) ⇒ [<code>Transformation</code>](#Transformation)
        * [.scale(value)](#Transformation+scale) ⇒ [<code>Transformation</code>](#Transformation)
        * [.setScaleMode(value)](#Transformation+setScaleMode) ⇒ [<code>Transformation</code>](#Transformation)
        * [.getRotation()](#Transformation+getRotation) ⇒ <code>Number</code>
        * [.getRotationDegrees()](#Transformation+getRotationDegrees) ⇒ <code>Number</code>
        * [.getRotationDegreesWrapped()](#Transformation+getRotationDegreesWrapped) ⇒ <code>Number</code>
        * [.getRotationMode()](#Transformation+getRotationMode) ⇒ <code>TransformModes</code>
        * [.setRotation(value, wrap)](#Transformation+setRotation) ⇒ [<code>Transformation</code>](#Transformation)
        * [.rotate(value, wrap)](#Transformation+rotate) ⇒ [<code>Transformation</code>](#Transformation)
        * [.setRotationDegrees(value, wrap)](#Transformation+setRotationDegrees) ⇒ [<code>Transformation</code>](#Transformation)
        * [.rotateDegrees(value)](#Transformation+rotateDegrees) ⇒ [<code>Transformation</code>](#Transformation)
        * [.setRotationMode(value)](#Transformation+setRotationMode) ⇒ [<code>Transformation</code>](#Transformation)
        * [.equals(other)](#Transformation+equals) ⇒ <code>Boolean</code>
        * [.clone()](#Transformation+clone) ⇒ [<code>Transformation</code>](#Transformation)
        * [.serialize()](#Transformation+serialize)
        * [.deserialize(data)](#Transformation+deserialize)
        * [.asMatrix()](#Transformation+asMatrix) ⇒ <code>Matrix</code>
    * _static_
        * [.combine(child, parent)](#Transformation.combine) ⇒ [<code>Transformation</code>](#Transformation)

<a name="new_Transformation_new"></a>

### new Transformation(position, rotation, scale)
Create the transformations.


| Param | Type | Description |
| --- | --- | --- |
| position | <code>Vector2</code> | Optional position value. |
| rotation | <code>Number</code> | Optional rotation value. |
| scale | <code>Vector2</code> | Optional sscale value. |

**Example**  
```js
// create local and world transformations
const transform = new Shaku.utils.Transformation();
const worldTransform = new Shaku.utils.Transformation();
// set offset to world transofm and rotation to local transform
worldTransform.setPosition({x: 100, y:50});
transform.setRotation(5);
// combine transformations and convert to a matrix
const combined = Shaku.utils.Transformation.combine(transform, worldTransform);
const matrix = combined.asMatrix();
```
<a name="Transformation+onChange"></a>

### transformation.onChange : <code>function</code>
Method to call when this transformation change.
Function params: transformation instance (this), properties changed (boolean), transform modes changed (boolean).

**Kind**: instance property of [<code>Transformation</code>](#Transformation)  
<a name="Transformation+getPosition"></a>

### transformation.getPosition() ⇒ <code>Vector2</code>
Get position.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: <code>Vector2</code> - Position.  
<a name="Transformation+getPositionMode"></a>

### transformation.getPositionMode() ⇒ <code>TransformModes</code>
Get position transformations mode.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: <code>TransformModes</code> - Position transformation mode.  
<a name="Transformation+setPosition"></a>

### transformation.setPosition(value) ⇒ [<code>Transformation</code>](#Transformation)
Set position.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Vector2</code> | New position. |

<a name="Transformation+setPositionX"></a>

### transformation.setPositionX(value) ⇒ [<code>Transformation</code>](#Transformation)
Set position X value.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | New position.x value. |

<a name="Transformation+setPositionY"></a>

### transformation.setPositionY(value) ⇒ [<code>Transformation</code>](#Transformation)
Set position Y value.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | New position.y value. |

<a name="Transformation+move"></a>

### transformation.move(value) ⇒ [<code>Transformation</code>](#Transformation)
Move position by a given vector.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Vector2</code> | Vector to move position by. |

<a name="Transformation+setPositionMode"></a>

### transformation.setPositionMode(value) ⇒ [<code>Transformation</code>](#Transformation)
Set position transformations mode.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>TransformModes</code> | Position transformation mode. |

<a name="Transformation+getScale"></a>

### transformation.getScale() ⇒ <code>Vector2</code>
Get scale.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: <code>Vector2</code> - Scale.  
<a name="Transformation+getScaleMode"></a>

### transformation.getScaleMode() ⇒ <code>TransformModes</code>
Get scale transformations mode.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: <code>TransformModes</code> - Scale transformation mode.  
<a name="Transformation+setScale"></a>

### transformation.setScale(value) ⇒ [<code>Transformation</code>](#Transformation)
Set scale.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Vector2</code> | New scale. |

<a name="Transformation+setScaleX"></a>

### transformation.setScaleX(value) ⇒ [<code>Transformation</code>](#Transformation)
Set scale X value.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | New scale.x value. |

<a name="Transformation+setScaleY"></a>

### transformation.setScaleY(value) ⇒ [<code>Transformation</code>](#Transformation)
Set scale Y value.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | New scale.y value. |

<a name="Transformation+scale"></a>

### transformation.scale(value) ⇒ [<code>Transformation</code>](#Transformation)
Scale by a given vector.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Vector2</code> | Vector to scale by. |

<a name="Transformation+setScaleMode"></a>

### transformation.setScaleMode(value) ⇒ [<code>Transformation</code>](#Transformation)
Set scale transformations mode.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>TransformModes</code> | Scale transformation mode. |

<a name="Transformation+getRotation"></a>

### transformation.getRotation() ⇒ <code>Number</code>
Get rotation.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: <code>Number</code> - rotation.  
<a name="Transformation+getRotationDegrees"></a>

### transformation.getRotationDegrees() ⇒ <code>Number</code>
Get rotation as degrees.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: <code>Number</code> - rotation.  
<a name="Transformation+getRotationDegreesWrapped"></a>

### transformation.getRotationDegreesWrapped() ⇒ <code>Number</code>
Get rotation as degrees, wrapped between 0 to 360.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: <code>Number</code> - rotation.  
<a name="Transformation+getRotationMode"></a>

### transformation.getRotationMode() ⇒ <code>TransformModes</code>
Get rotation transformations mode.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: <code>TransformModes</code> - Rotation transformations mode.  
<a name="Transformation+setRotation"></a>

### transformation.setRotation(value, wrap) ⇒ [<code>Transformation</code>](#Transformation)
Set rotation.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | New rotation. |
| wrap | <code>Boolean</code> | If true, will wrap value if out of possible range. |

<a name="Transformation+rotate"></a>

### transformation.rotate(value, wrap) ⇒ [<code>Transformation</code>](#Transformation)
Rotate transformation by given radians.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | Rotate value in radians. |
| wrap | <code>Boolean</code> | If true, will wrap value if out of possible range. |

<a name="Transformation+setRotationDegrees"></a>

### transformation.setRotationDegrees(value, wrap) ⇒ [<code>Transformation</code>](#Transformation)
Set rotation as degrees.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | New rotation. |
| wrap | <code>Boolean</code> | If true, will wrap value if out of possible range. |

<a name="Transformation+rotateDegrees"></a>

### transformation.rotateDegrees(value) ⇒ [<code>Transformation</code>](#Transformation)
Rotate transformation by given degrees.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | Rotate value in degrees. |

<a name="Transformation+setRotationMode"></a>

### transformation.setRotationMode(value) ⇒ [<code>Transformation</code>](#Transformation)
Set rotation transformations mode.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>TransformModes</code> | Rotation transformation mode. |

<a name="Transformation+equals"></a>

### transformation.equals(other) ⇒ <code>Boolean</code>
Check if this transformation equals another.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: <code>Boolean</code> - True if equal, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Transformation</code>](#Transformation) | Other transform to compare to. |

<a name="Transformation+clone"></a>

### transformation.clone() ⇒ [<code>Transformation</code>](#Transformation)
Return a clone of this transformations.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - Cloned transformations.  
<a name="Transformation+serialize"></a>

### transformation.serialize()
Serialize this transformation into a dictionary.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
<a name="Transformation+deserialize"></a>

### transformation.deserialize(data)
Deserialize this transformation from a dictionary.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | Data to set. |

<a name="Transformation+asMatrix"></a>

### transformation.asMatrix() ⇒ <code>Matrix</code>
Create and return a transformation matrix.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: <code>Matrix</code> - New transformation matrix.  
<a name="Transformation.combine"></a>

### Transformation.combine(child, parent) ⇒ [<code>Transformation</code>](#Transformation)
Combine child transformations with parent transformations.

**Kind**: static method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - Combined transformations.  

| Param | Type | Description |
| --- | --- | --- |
| child | [<code>Transformation</code>](#Transformation) | Child transformations. |
| parent | [<code>Transformation</code>](#Transformation) | Parent transformations. |

<a name="combineScalar"></a>

## combineScalar(childValue, parentValue, parent, mode) ⇒ <code>Number</code>
Combine child scalar value with parent using a transformation mode.

**Kind**: global function  
**Returns**: <code>Number</code> - Combined value.  

| Param | Type | Description |
| --- | --- | --- |
| childValue | <code>Number</code> | Child value. |
| parentValue | <code>Number</code> | Parent value. |
| parent | [<code>Transformation</code>](#Transformation) | Parent transformations. |
| mode | <code>TransformModes</code> | Transformation mode. |

<a name="combineVector"></a>

## combineVector(childValue, parentValue, parent, mode) ⇒ <code>Vector2</code>
Combine child vector value with parent using a transformation mode.

**Kind**: global function  
**Returns**: <code>Vector2</code> - Combined value.  

| Param | Type | Description |
| --- | --- | --- |
| childValue | <code>Vector2</code> | Child value. |
| parentValue | <code>Vector2</code> | Parent value. |
| parent | [<code>Transformation</code>](#Transformation) | Parent transformations. |
| mode | <code>TransformModes</code> | Transformation mode. |

<a name="combineVectorMul"></a>

## combineVectorMul(childValue, parentValue, parent, mode) ⇒ <code>Vector2</code>
Combine child vector value with parent using a transformation mode and multiplication.

**Kind**: global function  
**Returns**: <code>Vector2</code> - Combined value.  

| Param | Type | Description |
| --- | --- | --- |
| childValue | <code>Vector2</code> | Child value. |
| parentValue | <code>Vector2</code> | Parent value. |
| parent | [<code>Transformation</code>](#Transformation) | Parent transformations. |
| mode | <code>TransformModes</code> | Transformation mode. |

